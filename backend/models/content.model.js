import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ 
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        text: String 
    }]
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
