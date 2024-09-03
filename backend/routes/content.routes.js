import express from 'express';
import mongoose from 'mongoose';
import { upload } from '../middleware/userscontent.upload.js';
import Content from '../models/content.model.js';
import User from '../models/user.model.js'; 
import path from 'path';
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


router.get('/all-content', authenticate, async (req, res) => {
    try {

        const contents = await Content.find().populate('userId', 'name profilePic').exec();
        res.json(contents);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
