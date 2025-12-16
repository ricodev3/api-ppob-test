const pool = require('../db');

exports.getBalance = async (req, res) => {
  try {
    const email = req.user.email;

    const result = await pool.query(
      `SELECT balance
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        status: 1,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    return res.json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: {
        balance: result.rows[0].balance
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  }
};
