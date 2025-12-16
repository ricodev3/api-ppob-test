// middleware/upload.js - SIMPLIFIED FOR RAILWAY
const multer = require('multer');
const path = require('path');

// Simple storage without complex logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.NODE_ENV === 'production' 
      ? '/tmp/uploads'
      : 'src/uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, 'profile-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format Image tidak sesuai'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Simple error handling middleware
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, function(err) {
    if (err) {
      if (err.message === 'Format Image tidak sesuai') {
        return res.status(400).json({
          status: 102,
          message: 'Format Image tidak sesuai',
          data: null
        });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 102,
          message: 'File terlalu besar',
          data: null
        });
      }
      return res.status(500).json({
        status: 1,
        message: 'Upload error',
        data: null
      });
    }
    next();
  });
};

module.exports = handleUpload;