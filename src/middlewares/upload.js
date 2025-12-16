// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic upload directory
const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads'
  : 'src/uploads';

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const userPrefix = req.user?.email ? req.user.email.split('@')[0] : 'user';
    cb(null, `profile-${userPrefix}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    // ✅ RETURN CUSTOM ERROR THAT CAN BE CAUGHT
    const error = new Error('Format Image tidak sesuai. Hanya JPEG dan PNG yang diperbolehkan.');
    error.status = 400;
    error.statusCode = 102;
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});

// ✅ CREATE ERROR-HANDLING MIDDLEWARE
const uploadWithErrorHandling = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle Multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 102,
            message: 'File terlalu besar. Maksimum 5MB',
            data: null
          });
        }
        return res.status(400).json({
          status: 102,
          message: 'Error upload file',
          data: null
        });
      }
      
      // Handle our custom file filter error
      if (err.message.includes('Format Image tidak sesuai')) {
        return res.status(400).json({
          status: 102,
          message: err.message,
          data: null
        });
      }
      
      // Unknown error
      console.error('Upload middleware error:', err);
      return res.status(500).json({
        status: 1,
        message: 'Internal Server Error',
        data: null
      });
    }
    
    // No error, continue
    next();
  });
};

module.exports = uploadWithErrorHandling;