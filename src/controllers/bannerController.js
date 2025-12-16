const pool = require('../db');

exports.getBanners = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT banner_name, banner_image, description
       FROM banners
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
