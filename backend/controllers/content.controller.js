// content.controller.js
import Content from '../models/content.model.js';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';


// upload contents
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


// get users content
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


// displays content in newsfeed
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
                isBookmarked,
                likesCount: content.likes.length
            };
        });

        res.json(contentsWithStatus);
    } catch (error) {
        console.error('Error fetching newsfeed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// function for like post
export const likePost = async (req, res) => {
    const userId = req.user._id; // Assuming user ID is in req.user._id
    const { postId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const post = await Content.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ensure no duplicate likes
        post.likes = post.likes.filter(id => id); // Remove any potential invalid IDs
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Remove like
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            // Add like
            post.likes.push(userId);
            // Create notification for the post owner
            const postOwner = await User.findById(post.userId);
            if (postOwner) {
                await Notification.create({
                    userId: postOwner._id,
                    type: 'like',
                    postId,
                    message: `${req.user.name} liked your post`,
                    interactingUserId: userId // Save the ID of the user who liked the post
                });
            }
        }

        await post.save();
        res.status(200).json({ message: 'Post liked/unliked successfully', likesCount: post.likes.length });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// function for commenting in post
export const postComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user ID is in req.user._id

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const post = await Content.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add the comment
        post.comments.push({
            author: userId,
            text,
            timestamp: new Date()
        });

        // Create notification for the post owner
        const postOwner = await User.findById(post.userId);
        if (postOwner) {
            await Notification.create({
                userId: postOwner._id,
                type: 'comment',
                postId,
                message: `${req.user.name} on your post`,
                interactingUserId: userId // Save the ID of the user who commented
            });
        }

        await post.save();
        res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// getting comments
export const getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Content.findById(postId).populate({
            path: 'comments.author',
            select: 'name profilePic'
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// bookmarked posts
export const bookmarkPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.toggleBookmark(postId);
  
      res.status(200).json({ message: 'Bookmark toggled successfully' });
    } catch (error) {
      console.error('Error bookmarking post:', error);
      res.status(500).json({ message: 'Server error' });
    }
};


// displays bookmarked
export const getBookmarkedPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookmarkedPosts = await Content.aggregate([
            {
                $match: { _id: { $in: user.bookmarkedPosts } }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        res.json(bookmarkedPosts);
    } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// remove bookmark function
export const removeBookmark = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.bookmarkedPosts = user.bookmarkedPosts.filter(id => id.toString() !== postId);
        await user.save();

        res.status(200).json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get users who liked a post
export const getLikes = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Content.findById(postId).populate({
            path: 'likes',
            model: 'User',
            select: 'name nickName profilePic'
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post.likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


/// for notification 
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ timestamp: -1 });

        // Fetch user details of the users who created these notifications
        const interactingUserIds = [...new Set(notifications.map(n => n.interactingUserId))];
        const users = await User.find({ _id: { $in: interactingUserIds } }).select('profilePic name');

        // Create a map of userId to user details
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
        }, {});

        // Attach user details to notifications
        const notificationsWithUserDetails = notifications.map(notification => ({
            ...notification._doc,
            interactingUserDetails: userMap[notification.interactingUserId]  // Add user details to each notification
        }));

        res.json(notificationsWithUserDetails);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};