// models/content.model.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const contentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    caption: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: String }],
    comments: [commentSchema]  
});

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

export default Content;
