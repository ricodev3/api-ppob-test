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
  console.log('🔄 updateProfileImage called');
  console.log('📁 File:', req.file ? 'Exists' : 'Missing');
  console.log('👤 User from token:', req.user);
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }

    console.log('📄 File details:', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const email = req.user.email;
    console.log('📧 User email:', email);
    
    // ✅ SIMPLIFIED URL GENERATION FOR DEBUGGING
    const baseUrl = process.env.API_URL 
      ? process.env.API_URL.replace(/\/$/, '')
      : `http://localhost:${process.env.PORT || 3000}`;
    
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    console.log('🔗 Generated URL:', imageUrl);
    console.log('🔗 API_URL from env:', process.env.API_URL);
    
    // ✅ CHECK DATABASE CONNECTION
    console.log('🔌 Testing database connection...');
    const testQuery = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testQuery.rows[0]);
    
    // ✅ UPDATE DATABASE
    console.log('💾 Updating database for email:', email);
    const result = await pool.query(
      `UPDATE users
       SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
       WHERE email = $2
       RETURNING email, first_name, last_name, profile_image`,
      [imageUrl, email]
    );

    console.log('📊 Update result:', {
      rowCount: result.rowCount,
      rows: result.rows
    });

    if (!result.rowCount) {
      console.log('❌ User not found in database');
      return res.status(404).json({
        status: 1,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    console.log('✅ Update successful');
    return res.json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('🔥 ERROR in updateProfileImage:', err.message);
    console.error('📋 Stack trace:', err.stack);
    
    // Log specific error details
    if (err.code) console.error('🔢 Error code:', err.code);
    if (err.detail) console.error('📝 Error detail:', err.detail);
    
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  }
};