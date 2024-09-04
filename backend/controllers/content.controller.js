import Content from '../models/content.model.js';

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
        res.json(contents);
    } catch (error) {
        console.error('Error fetching newsfeed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

///add like function 
export const likePost = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;
  
    try {
      const post = await Content.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id !== userId); // Unlike if already liked
      } else {
        post.likes.push(userId); // Add like
      }
  
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };