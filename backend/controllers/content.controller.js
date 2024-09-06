import Content from '../models/content.model.js';

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


// handle like post 
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

        // Clean up any null values in likes
        post.likes = post.likes.filter(id => id); // Remove null or undefined IDs

        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Unlike: remove userId from likes
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like: add userId to likes
            post.likes.push(userId);
        }

        await post.save();

        // Send back the updated number of likes
        res.status(200).json({ message: 'Post liked/unliked successfully', likes: post.likes.length });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
