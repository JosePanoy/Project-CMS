import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentPath: { type: String, required: true },
    contentType: { type: String, enum: ['image', 'video'], required: true },
    caption: { type: String }
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

export default Content;
