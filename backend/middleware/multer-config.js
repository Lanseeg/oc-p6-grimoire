// middleware/multer-config.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

// Middleware to handle image compression with Sharp
const uploadAndCompressImage = (req, res, next) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload image' });
      }
      if (!req.file) {
        return next();
      }
  
      const { path: tempPath, filename } = req.file;
      const compressedImagePath = `images/compressed-${filename}`;
  
      try {
        // Sharp for compressing images
        sharp.cache(false);
        await sharp(tempPath)
          .resize(800, 600)
          .jpeg({ quality: 80 })
          .toFile(compressedImagePath);
  
        console.log('Image compressed successfully');
  
        // Delete remaining file
        if (fs.existsSync(tempPath)) {
          fs.unlink(tempPath, (err) => {
            if (err) {
              console.error('Failed to delete original image:', err);
            } else {
              console.log('Original image deleted');
            }
          });
        }
        
  
        req.file.path = compressedImagePath;
        req.file.filename = `compressed-${filename}`;
        next();
      } catch (error) {
        console.error('Error during image processing with Sharp:', error);
        return res.status(500).json({ error: 'Failed to process image' });
      }
    });
  };

module.exports = uploadAndCompressImage;
