const pool = require('../db');

//Get Service Logic
exports.getServices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT service_code, service_name, service_icon, service_tariff
       FROM services
       ORDER BY id ASC`
    );

    return res.json({
      status: 0,
      message: 'Sukses',
      data: result.rows
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
