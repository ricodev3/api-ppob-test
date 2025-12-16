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
      status: 1,
      message: 'Invalid input'
    });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      [email]
    );

    if (!result.rowCount) {
      return res.status(400).json({
        status: 1,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        status: 1,
        message: 'Wrong password'
      });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      status: 0,
      message: 'Login berhasil',
      data: { token }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 1,
      message: 'Internal Server Error'
    });
  }
};

