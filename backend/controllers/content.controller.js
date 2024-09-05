// content.controller.js
import Content from '../models/content.model.js';
import User from '../models/user.model.js';

// Upload user content
export const uploadContent = async (req, res) => {
    const { caption } = req.body;
    const fileName = req.file ? req.file.filename : null;
    const userId = req.user.id; // Ensure user is authenticated

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

// Get newsfeed with like status
export const getNewsfeed = async (req, res) => {
    const userId = req.user.id; // Logged-in user ID

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

        // Add isLiked field to each content
        const contentsWithLikeStatus = contents.map(content => {
            const isLiked = content.likes.includes(userId);
            return {
                ...content,
                isLiked
            };
        });

        res.json(contentsWithLikeStatus);
    } catch (error) {
        console.error('Error fetching newsfeed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Handle like/unlike functionality
export const likePost = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const post = await Content.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id !== userId); // Unlike post
        } else {
            post.likes.push(userId); // Like post
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add comment
export const addComment = async (req, res) => {
    const { postId, text } = req.body;
    const userId = req.user.id;

    try {
        const post = await Content.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not Found' });

        post.comments.push({
            author: userId,
            text
        });

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch comments
export const getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Content.findById(postId).populate('comments.author', 'name');
        if (!post) return res.status(400).json({ message: 'Post not Found' });

        res.json(post.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Bookmark a post
export const bookmarkPost = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const post = await Content.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the post is already bookmarked
        const isBookmarked = post.bookmarkedBy.includes(userId);

        if (isBookmarked) {
            // Remove bookmark
            post.bookmarkedBy = post.bookmarkedBy.filter(id => id !== userId);
        } else {
            // Add bookmark
            post.bookmarkedBy.push(userId);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error bookmarking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unbookmark a post
export const unbookmarkPost = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const post = await Content.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.bookmarkedBy = post.bookmarkedBy.filter(id => id !== userId);
        await post.save();

        res.json({ message: 'Post unbookmarked successfully' });
    } catch (error) {
        console.error('Error unbookmarking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get saved posts
export const getSavedPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const savedPosts = await Content.find({ bookmarkedBy: userId });
        res.status(200).json(savedPosts);
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
