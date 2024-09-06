// content.model.js
import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    caption: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: String }], // Ensure this matches userId type
    comments: [{
        author: { type: String },
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    bookmarkedBy: [{ type: String }] // Ensure this matches userId type
});

export default mongoose.model('Content', contentSchema);
