// upload.js - Multer configuration for file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine upload directory based on environment
const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads'
  : 'src/uploads';

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory: ${uploadDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    
    // Safe user prefix extraction
    const userPrefix = req.user?.email 
      ? req.user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-') 
      : 'user';
    
    cb(null, `profile-${userPrefix}-${uniqueSuffix}${extension}`);
  }
});

// File filter - only allow JPEG and PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    // ✅ FIX: Add error properties for better handling
    const error = new Error('Format Image tidak sesuai. Hanya JPEG dan PNG yang diperbolehkan.');
    error.statusCode = 400;
    error.clientMessage = 'Format Image tidak sesuai';
    cb(error, false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file
  }
});

// ✅ CRITICAL FIX: Create error-handling wrapper
const uploadWithErrorHandling = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle file filter errors (PDF, etc.)
      if (err.message.includes('Format Image tidak sesuai')) {
        return res.status(400).json({
          status: 102,
          message: err.clientMessage || err.message,
          data: null
        });
      }
      
      // Handle file size errors
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 102,
          message: 'File terlalu besar. Maksimum 5MB',
          data: null
        });
      }
      
      // Handle other Multer errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          status: 102,
          message: `Upload error: ${err.message}`,
          data: null
        });
      }
      
      // Unknown errors
      console.error('Upload middleware error:', err);
      return res.status(500).json({
        status: 1,
        message: 'Internal Server Error',
        data: null
      });
    }
    
    // No error, continue to controller
    next();
  });
};

// ✅ Export the error-handling version instead of raw multer
module.exports = uploadWithErrorHandling;