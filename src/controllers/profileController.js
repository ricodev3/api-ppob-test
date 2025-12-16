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
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai. Hanya JPEG dan PNG yang diperbolehkan',
        data: null
      });
    }

    const email = req.user.email;
    
    // Generate image URL using your API_URL environment variable
    let baseUrl;
    
    if (process.env.API_URL) {
      // Use API_URL if set (e.g., https://your-app.up.railway.app)
      baseUrl = process.env.API_URL.replace(/\/$/, ''); // Remove trailing slash
    } else if (process.env.NODE_ENV === 'production') {
      // Railway environment without explicit API_URL
      baseUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:3000'}`;
    } else {
      // Local development
      const port = process.env.PORT || 3000;
      baseUrl = `http://localhost:${port}`;
    }
    
    // Construct the full image URL
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Update database using SUPABASE_DB_URL connection
    const result = await pool.query(
      `UPDATE users
       SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
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

    // Return success response
    return res.json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Profile image update error:', err.message);
    
    // Handle specific multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 102,
          message: 'File terlalu besar. Maksimum 5MB',
          data: null
        });
      }
    }
    
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  }
};