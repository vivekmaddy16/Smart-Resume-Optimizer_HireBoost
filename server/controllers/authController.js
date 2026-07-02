const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { sendOtpEmail } = require('../services/emailService');

const getJWTSecret = () => process.env.JWT_SECRET || 'hireboost_jwt_secret_key_12345';

// Local shared in-memory database to fallback on when MongoDB Atlas is disconnected
const inMemoryUsers = new Map();
exports.inMemoryUsers = inMemoryUsers;

const isDatabaseConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userObj;

    if (isDatabaseConnected()) {
      // Mongoose/MongoDB Atlas query
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      userObj = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      await userObj.save();
    } else {
      // In-memory fallback
      console.log('⚠️ Database not connected. Signup operating in in-memory mode.');
      if (inMemoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      userObj = {
        _id: new mongoose.Types.ObjectId(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        freeAnalysisUsed: false,
        subscriptionActive: false,
        createdAt: new Date(),
      };

      inMemoryUsers.set(normalizedEmail, userObj);
    }

    // Generate JWT Token
    const token = jwt.sign({ _id: userObj._id.toString() }, getJWTSecret(), { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      user: {
        name: userObj.name,
        email: userObj.email,
        freeAnalysisUsed: userObj.freeAnalysisUsed,
        subscriptionActive: userObj.subscriptionActive,
        createdAt: userObj.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userObj;

    if (isDatabaseConnected()) {
      userObj = await User.findOne({ email: normalizedEmail });
    } else {
      console.log('⚠️ Database not connected. Login operating in in-memory mode.');
      userObj = inMemoryUsers.get(normalizedEmail);
    }

    if (!userObj) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, userObj.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ _id: userObj._id.toString() }, getJWTSecret(), { expiresIn: '7d' });

    res.json({
      success: true,
      user: {
        name: userObj.name,
        email: userObj.email,
        freeAnalysisUsed: userObj.freeAnalysisUsed,
        subscriptionActive: userObj.subscriptionActive,
        createdAt: userObj.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

// Forgot Password OTP Generator
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please enter your email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userObj;

    if (isDatabaseConnected()) {
      userObj = await User.findOne({ email: normalizedEmail });
    } else {
      console.log('⚠️ Database not connected. Forgot Password operating in in-memory mode.');
      userObj = inMemoryUsers.get(normalizedEmail);
    }

    if (!userObj) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (isDatabaseConnected()) {
      userObj.otp = otp;
      userObj.otpExpiry = otpExpiry;
      await userObj.save();
    } else {
      userObj.otp = otp;
      userObj.otpExpiry = otpExpiry;
      inMemoryUsers.set(normalizedEmail, userObj);
    }

    // Trigger real email asynchronously (with terminal fallback)
    sendOtpEmail(userObj.email, otp).catch((error) => {
      console.error('Asynchronous OTP email sending failed:', error);
    });

    res.json({
      success: true,
      message: 'OTP verification code has been dispatched to your email address.',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ error: 'Internal server error during password reset request' });
  }
};

// Verify OTP Controller
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userObj;

    if (isDatabaseConnected()) {
      userObj = await User.findOne({ email: normalizedEmail });
    } else {
      console.log('⚠️ Database not connected. Verify OTP operating in in-memory mode.');
      userObj = inMemoryUsers.get(normalizedEmail);
    }

    if (!userObj) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    if (!userObj.otp || userObj.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check and try again.' });
    }

    if (new Date() > new Date(userObj.otpExpiry)) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    res.json({
      success: true,
      message: 'OTP verification code verified successfully.',
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Internal server error during OTP verification' });
  }
};

// Reset Password with OTP verification
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userObj;

    if (isDatabaseConnected()) {
      userObj = await User.findOne({ email: normalizedEmail });
    } else {
      console.log('⚠️ Database not connected. Reset Password operating in in-memory mode.');
      userObj = inMemoryUsers.get(normalizedEmail);
    }

    if (!userObj) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    if (!userObj.otp || userObj.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP code. Password reset failed.' });
    }

    if (new Date() > new Date(userObj.otpExpiry)) {
      return res.status(400).json({ error: 'OTP has expired. Password reset failed.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (isDatabaseConnected()) {
      userObj.password = hashedPassword;
      userObj.otp = undefined;
      userObj.otpExpiry = undefined;
      await userObj.save();
    } else {
      userObj.password = hashedPassword;
      userObj.otp = undefined;
      userObj.otpExpiry = undefined;
      inMemoryUsers.set(normalizedEmail, userObj);
    }

    res.json({
      success: true,
      message: 'Your password has been successfully updated.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ error: 'Internal server error during password reset' });
  }
};

// Update Profile flags (trial/subscription)
exports.updateProfile = async (req, res) => {
  try {
    const { freeAnalysisUsed, subscriptionActive } = req.body;
    const user = req.user; // Retrieved by auth middleware

    if (freeAnalysisUsed !== undefined) {
      user.freeAnalysisUsed = freeAnalysisUsed;
    }

    if (subscriptionActive !== undefined) {
      user.subscriptionActive = subscriptionActive;
      if (subscriptionActive) {
        user.subscribedAt = new Date();
      }
    }

    if (isDatabaseConnected()) {
      await user.save();
    } else {
      inMemoryUsers.set(user.email, user);
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        freeAnalysisUsed: user.freeAnalysisUsed,
        subscriptionActive: user.subscriptionActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Internal server error while updating user details' });
  }
};
