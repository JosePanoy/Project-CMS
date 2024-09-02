import express from 'express';
import { uploadContent, uploadContentList } from '../controllers/uploadContent.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/uploadContent.js'; // Use the correct middleware for content

const router = express.Router();

router.post('/upload', authenticate, upload.single('contentFile'), uploadContent);
router.get('/', uploadContentList); // Ensure this route correctly lists content

export default router;
