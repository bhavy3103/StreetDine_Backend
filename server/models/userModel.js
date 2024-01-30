// models/userModel.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // other user properties
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  role: { type: String, required: true },
  avatar: { type: String, default: "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
