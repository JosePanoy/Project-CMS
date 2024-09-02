import Content from '../models/content.model.js';

export const uploadContent = async (req, res) => {
    const { caption } = req.body;
    const contentType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    const contentPath = req.file.filename;

    try {
        const newContent = new Content({
            user: req.user._id,
            contentPath, 
            contentType,
            caption
        });

        await newContent.save();
        res.status(201).json({ message: 'Content uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading content', error: error.message });
    }
};

export const uploadContentList = async (req, res) => {
    try {
        const contents = await Content.find().populate('user', 'name profilePic'); // Populate user details
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content', error });
    }
};