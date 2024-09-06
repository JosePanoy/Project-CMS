import Content from '../models/content.model.js';
import User from '../models/user.model.js';

// Upload user content
export const uploadContent = async (req, res) => {
    const { caption } = req.body;
    const fileName = req.file ? req.file.filename : null;
    const userId = req.user.id;

    if (!caption || !fileName) {
        return res.status(400).json({ message: 'Caption and file are required' });
    }

    try {
        const newContent = new Content({
            userId,
            caption,
            fileName
        });

        await newContent.save();
        res.status(201).json({ message: 'Content uploaded successfully' });
    } catch (error) {
        console.error('Error uploading content:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user-specific content
export const getUserContent = async (req, res) => {
    const userId = req.user.id;

    try {
        const contents = await Content.find({ userId });
        res.json(contents);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get newsfeed
export const getNewsfeed = async (req, res) => {
    const userId = req.user.id;

    try {
        const contents = await Content.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }
            }
        ]);

        const contentsWithStatus = contents.map(content => {
            const isLiked = Array.isArray(content.likes) && content.likes.includes(userId);
            const isBookmarked = Array.isArray(content.bookmarkedBy) && content.bookmarkedBy.includes(userId);
            return {
                ...content,
                isLiked,
                isBookmarked
            };
        });

        res.json(contentsWithStatus);
    } catch (error) {
        console.error('Error fetching newsfeed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
