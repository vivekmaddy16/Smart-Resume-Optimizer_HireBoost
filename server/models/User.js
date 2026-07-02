const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  freeAnalysisUsed: {
    type: Boolean,
    default: false,
  },
  subscriptionActive: {
    type: Boolean,
    default: false,
  },
  subscribedAt: {
    type: Date,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
