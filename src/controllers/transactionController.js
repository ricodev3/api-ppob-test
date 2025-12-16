// src/controllers/transactionController.js
const pool = require('../db');

//Create Transaction Logic
exports.createTransaction = async (req, res) => {
  const { service_code } = req.body;
  const { user_id } = req.user;

  if (!service_code) {
    return res.status(400).json({
      status: 102,
      message: 'Service ataus Layanan tidak ditemukan',
      data: null
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Get service
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
        message: 'Service ataus Layanan tidak ditemukan',
        data: null
      });
    }

    const service = serviceResult.rows[0];

    // 2. Get user balance
    const userResult = await client.query(
      'SELECT balance FROM users WHERE id = $1',
      [user_id]
    );

    if (!userResult.rowCount) {
      throw new Error('User not found');
    }

    const balance = userResult.rows[0].balance;

    // 3. Check balance
    if (balance < service.service_tariff) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    // 4. Deduct balance
    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [service.service_tariff, user_id]
    );

    // 5. Insert transaction
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
        service.service_tariff
      ]
    );

    await client.query('COMMIT');

    // 6. Response
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
    console.error(err);

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

