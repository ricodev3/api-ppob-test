const pool = require('../db');
const bcrypt = require('bcrypt');
const { validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  await body('email').isEmail().run(req);
  await body('password').isLength({ min: 8 }).run(req);

  //Check Validation Request Data
  const errors = validationResult(req);

  //Error handler for email format not correct
  if (errors.array().find(e => e.path === 'email')) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter email tidak sesuai format',
      data: null
    });
  }

  // Error handler for password not 8
  if (errors.array().find(e => e.path === 'password')) {
    return res.status(400).json({
      status: 103,
      message: 'Password minimal 8 karakter',
      data: null
    });
  }

  const { email, password, first_name, last_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert query to database for user data registered 
    await pool.query(
      `
      INSERT INTO users (email, password, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      `,
      [email, hashedPassword, first_name, last_name]
    );

    // Response Success 200
    return res.json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null
    });

  } catch (err) {

    // Error handler for email duplicate
    if (err.code === '23505') {
      return res.status(400).json({
        status: 104,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    // Internal server error 
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  }
};



exports.login = async (req, res) => {
  await body('email').isEmail().run(req);
  await body('password').isLength({ min: 8 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter email tidak sesuai format',
      data: null
    });
  }

  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const result = await pool.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      [email]
    );

    // 🔴 CRITICAL FIX: Check if user was found
    if (!result.rows.length) {
      return res.status(400).json({
        status: 103,  // Changed from 1 to match your requirements
        message: 'Username atau password salah',
        data: null
      });
    }

    const user = result.rows[0];

    // 2. DEBUG: Log what we found
    console.log('🔍 Login attempt for email:', email);
    console.log('🔍 User found:', { id: user.id, email: user.email });
    console.log('🔍 JWT_SECRET exists?', !!process.env.JWT_SECRET);
    
    // 3. Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(400).json({
        status: 103,
        message: 'Username atau password salah',
        data: null
      });
    }

    // 4. Create JWT token (with debugging)
    console.log('🔑 Creating JWT with payload:', {
      user_id: user.id,
      email: user.email
    });
    
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,  // Make sure this is set!
      { expiresIn: '12h' }
    );

    console.log('✅ Login successful for:', email);
    console.log('✅ Token created (first 50 chars):', token.substring(0, 50) + '...');

    return res.json({
      status: 0,
      message: 'Login Sukses',
      data: { 
        token: token,
        // Optional: add token info
        token_type: 'Bearer',
        expires_in: 43200,  // 12 hours in seconds
        user: {
          id: user.id,
          email: user.email
        }
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    console.error('❌ Error stack:', err.stack);
    
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error',
      data: null
    });
  }
};
