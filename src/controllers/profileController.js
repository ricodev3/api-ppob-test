const pool = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const email = req.user.email;

    const result = await pool.query(
      `SELECT email, first_name, last_name, profile_image
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
      message: 'Sukses',
      data: result.rows[0]
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

exports.updateProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { first_name, last_name } = req.body;

    // Basic validation
    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 1,
        message: 'First name dan last name wajib diisi',
        data: null
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2
       WHERE email = $3
       RETURNING email, first_name, last_name, profile_image`,
      [first_name, last_name, email]
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
      message: 'Update Pofile berhasil',
      data: result.rows[0]
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

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }

    const email = req.user.email;
    
    // Generate image URL
    const baseUrl = process.env.API_URL 
      ? process.env.API_URL.replace(/\/$/, '')
      : `http://localhost:${process.env.PORT || 3000}`;
    
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Update database
    const result = await pool.query(
      `UPDATE users
       SET profile_image = $1
       WHERE email = $2
       RETURNING email, first_name, last_name, profile_image`,
      [imageUrl, email]
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
      message: 'Update Profile Image berhasil',
      data: result.rows[0]
    });

  } catch (err) {
    // Production error logging (without stack traces in response)
    console.error(`[ProfileImage Error] ${err.message}`);
    
    // Return generic error to client
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  }
};