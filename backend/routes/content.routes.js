import express from 'express';
import path from 'path';
import { upload } from '../middleware/userscontent.upload.js';
import { uploadContent, getNewsfeed, likePost } from '../controllers/content.controller.js';
import Content from '../models/content.model.js';
import User from '../models/user.model.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const newContent = new Content({
            userId: req.user.id,
            caption,
            fileName: file.filename,
            filePath: path.join('usersUpload', file.filename)
        });

        await newContent.save();
        res.status(201).json({ message: 'Content uploaded successfully' });
    } catch (error) {
        console.error('Error uploading content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/newsfeed', authenticate, getNewsfeed);
router.post('/like', authenticate, likePost);


export default router;
