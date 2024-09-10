import Content from '../models/content.model.js';
import User from '../models/user.model.js';

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
            const isLiked = content.likes.includes(userId);
            const isBookmarked = content.bookmarkedBy.includes(userId);
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

export const likePost = async (req, res) => {
    const userId = req.user._id; // Extract userId as a string
    const { postId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const post = await Content.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes = post.likes.filter(id => id); // Clean up null values

        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({ message: 'Post liked/unliked successfully', likes: post.likes.length });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const postComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const post = await Content.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            author: userId,
            text,
            timestamp: new Date()
        });

        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



export const getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Content.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userIds = post.comments.map(comment => comment.author);

        // Fetch user details
        const users = await User.find({ _id: { $in: userIds } }).select('name profilePic');
        const userMap = users.reduce((map, user) => {
            map[user._id] = user;
            return map;
        }, {});

        // Map comments to include user details
        const commentsWithUserDetails = post.comments.map(comment => ({
            ...comment,
            author: userMap[comment.author] || { name: 'Unknown User', profilePic: 'default-profile-pic.jpg' }
        }));

        res.json(commentsWithUserDetails);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
