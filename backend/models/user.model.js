import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  nickName: { type: String, required: true },
  addr: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String }
});


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
