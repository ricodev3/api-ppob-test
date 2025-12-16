// upload.js - Multer configuration for file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine upload directory based on environment
// Railway uses /tmp for ephemeral storage, local uses src/uploads
const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads'  // Railway's temporary storage
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
    cb(null, 'profile-' + req.user?.email?.split('@')[0] + '-' + uniqueSuffix + extension);
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
    cb(new Error('Format Image tidak sesuai. Hanya JPEG dan PNG yang diperbolehkan.'), false);
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

module.exports = upload;