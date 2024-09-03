import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    caption: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

export default Content;
