const pool = require('../db');

exports.topupBalance = async (req, res) => {
  const { top_up_amount } = req.body;
  const { user_id } = req.user;

  if (!Number.isInteger(top_up_amount) || top_up_amount < 0) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      data: null
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const balanceResult = await client.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance',
      [top_up_amount, user_id]
    );

    if (!balanceResult.rowCount) {
      throw new Error('User not found');
    }

    const invoice = `INV${Date.now()}`;

    await client.query(
      `INSERT INTO transactions
       (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'TOPUP', 'Top Up balance', $3)`,
      [user_id, invoice, top_up_amount]
    );

    await client.query('COMMIT');

    return res.json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: balanceResult.rows[0].balance
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
