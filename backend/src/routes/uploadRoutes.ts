import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinary';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

router.use(authenticate);

router.post('/media', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const userId = req.user!._id;
    const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    
    const result = await uploadToCloudinary(
      req.file.buffer,
      `socialhub/${userId}`,
      resourceType as 'image' | 'video'
    );

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        type: resourceType,
        duration: result.duration,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(400).json({ error: error.message || 'Upload failed' });
  }
});

router.post('/media/multiple', upload.array('files', 10), async (req: AuthRequest, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const userId = req.user!._id;
    const uploadPromises = req.files.map(async (file) => {
      const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      
      const result = await uploadToCloudinary(
        file.buffer,
        `socialhub/${userId}`,
        resourceType as 'image' | 'video'
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        type: resourceType,
        duration: result.duration,
      };
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: { files: results },
    });
  } catch (error: any) {
    console.error('Multiple upload error:', error);
    res.status(400).json({ error: error.message || 'Upload failed' });
  }
});

export default router;