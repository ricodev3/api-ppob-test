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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const userPrefix = req.user?.email ? req.user.email.split('@')[0] : 'user';
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
    // This error will be caught by our error handler
    cb(new Error('Format Image tidak sesuai. Hanya JPEG dan PNG yang diperbolehkan.'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});


const handleFileUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle file type errors
      if (err.message.includes('Format Image tidak sesuai')) {
        return res.status(400).json({
          status: 102,
          message: 'Format Image tidak sesuai',
          data: null
        });
      }
      
      // Handle file size errors
      if (err.code === 'LIMIT_FILE_SIZE') {
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
          message: 'Error upload file',
          data: null
        });
      }
      
      // Unknown error
      console.error('Upload error:', err);
      return res.status(500).json({
        status: 1,
        message: 'Internal Server Error',
        data: null
      });
    }
    
    next();
  });
};

module.exports = handleFileUpload; 