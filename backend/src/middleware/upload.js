// backend/src/middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    'uploads/products',
    'uploads/avatars', 
    'uploads/categories',
    'uploads/reviews'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirs();

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Local storage configuration
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${subfolder}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  });
};

// Transform file object to match Cloudinary response format
const transformFileResponse = (file) => {
  if (!file) return null;
  
  return {
    filename: file.filename,
    path: `/uploads/${file.destination.split('/').pop()}/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype,
    // Cloudinary-like properties for compatibility
    public_id: file.filename.split('.')[0],
    url: `/uploads/${file.destination.split('/').pop()}/${file.filename}`
  };
};

// Middleware to transform file responses
const transformFiles = (req, res, next) => {
  if (req.file) {
    req.file = transformFileResponse(req.file);
  }
  if (req.files && Array.isArray(req.files)) {
    req.files = req.files.map(transformFileResponse);
  }
  next();
};

// Upload configurations
export const upload = {
  // Product images (multiple files)
  productImages: [
    multer({
      storage: createStorage('products'),
      fileFilter: imageFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 5 // Maximum 5 images per product
      }
    }).array('images', 5),
    transformFiles
  ],

  // Single product image
  productImage: [
    multer({
      storage: createStorage('products'),
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 }
    }).single('image'),
    transformFiles
  ],

  // User avatar
  avatar: [
    multer({
      storage: createStorage('avatars'),
      fileFilter: imageFilter,
      limits: { fileSize: 2 * 1024 * 1024 } // 2MB
    }).single('avatar'),
    transformFiles
  ],

  // Category image
  categoryImage: [
    multer({
      storage: createStorage('categories'),
      fileFilter: imageFilter,
      limits: { fileSize: 3 * 1024 * 1024 } // 3MB
    }).single('image'),
    transformFiles
  ],

  // Review images
  reviewImages: [
    multer({
      storage: createStorage('reviews'),
      fileFilter: imageFilter,
      limits: {
        fileSize: 3 * 1024 * 1024, // 3MB per file
        files: 3 // Maximum 3 images per review
      }
    }).array('images', 3),
    transformFiles
  ]
};

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }

  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPG, JPEG, PNG, WEBP) are allowed.'
    });
  }

  next(error);
};