// src/controllers/transactionController.js
const pool = require('../db');

//Create Transaction Logic
exports.createTransaction = async (req, res) => {
  const { service_code } = req.body;
  const { user_id } = req.user;

  if (!service_code) {
    return res.status(400).json({
      status: 102,
      message: 'Service atau Layanan tidak ditemukan',
      data: null
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Get service - FIXED: Ensure proper column name
    const serviceResult = await client.query(
      `SELECT service_code, service_name, service_tariff
       FROM services
       WHERE service_code = $1`,
      [service_code]
    );

    if (!serviceResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    const service = serviceResult.rows[0];
    
    // ✅ CRITICAL FIX: Parse to integers
    const tariff = parseInt(service.service_tariff, 10);
    if (isNaN(tariff)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 102,
        message: 'Invalid service tariff',
        data: null
      });
    }

    // 2. Get user balance
    const userResult = await client.query(
      'SELECT balance FROM users WHERE id = $1',
      [user_id]
    );

    if (!userResult.rowCount) {
      throw new Error('User not found');
    }

    // ✅ CRITICAL FIX: Parse to integer
    const balance = parseInt(userResult.rows[0].balance, 10);
    if (isNaN(balance)) {
      await client.query('ROLLBACK');
      return res.status(500).json({
        status: 1,
        message: 'Invalid user balance',
        data: null
      });
    }

    // 3. Debug log to see actual values
    console.log('DEBUG: balance =', balance, 'tariff =', tariff);
    console.log('DEBUG: balance type =', typeof balance, 'tariff type =', typeof tariff);
    
    // 4. Check balance - use integers
    if (balance < tariff) {
      console.log('DEBUG: Insufficient!', balance, '<', tariff);
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    // 5. Deduct balance
    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [tariff, user_id]
    );

    // 6. Insert transaction
    const invoiceNumber = `INV${Date.now()}`;

    const trxResult = await client.query(
      `INSERT INTO transactions
       (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'PAYMENT', $3, $4)
       RETURNING invoice_number, transaction_type, total_amount, created_on`,
      [
        user_id,
        invoiceNumber,
        service.service_name,
        tariff
      ]
    );

    await client.query('COMMIT');

    // 7. Response
    return res.json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: trxResult.rows[0].invoice_number,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: trxResult.rows[0].transaction_type,
        total_amount: trxResult.rows[0].total_amount,
        created_on: trxResult.rows[0].created_on
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', err.message, err.stack);

    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  } finally {
    client.release();
  }
};

//Get History Transaction Logic
exports.getHistory = async (req, res) => {
  const { user_id } = req.user;
  const { limit, offset = 0 } = req.query;

  let query = `
    SELECT invoice_number, transaction_type, description, total_amount, created_on
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_on DESC
  `;

  const params = [user_id];

  if (limit) {
    query += ' LIMIT $2 OFFSET $3';
    params.push(limit, offset);
  }

  const result = await pool.query(query, params);

  return res.json({
    status: 0,
    message: 'Get History Berhasil',
    data: {
      offset: Number(offset),
      limit: limit ? Number(limit) : null,
      records: result.rows
    }
  });
};

