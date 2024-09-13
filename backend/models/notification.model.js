// notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    postId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    interactingUserId: { type: String, required: true },
    isRead: { type: Boolean, default: false }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
