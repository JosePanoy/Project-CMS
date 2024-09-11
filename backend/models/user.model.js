// user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  nickName: { type: String, required: true },
  addr: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  bookmarkedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
});

userSchema.methods.toggleBookmark = async function(postId) {
  const index = this.bookmarkedPosts.indexOf(postId);
  if (index === -1) {
    this.bookmarkedPosts.push(postId);
  } else {
    this.bookmarkedPosts.splice(index, 1);
  }
  await this.save();
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
