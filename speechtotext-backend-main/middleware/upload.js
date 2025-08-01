const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Updated file filter
const fileFilter = (req, file, cb) => {
  const filetypes = /wav|mp3|m4a|ogg|webm|flac|aac/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetypes = [
    'audio/wav', 'audio/mp3', 'audio/mpeg',
    'audio/x-m4a', 'audio/webm', 'audio/ogg',
    'audio/flac', 'audio/aac'
  ];
  const mimetype = mimetypes.includes(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

module.exports = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter
});
