const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { inMemoryUsers } = require('../controllers/authController');

const isDatabaseConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(412).json({ error: 'Precondition Failed: Authorization token required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET || 'hireboost_jwt_secret_key_12345';
    
    const decoded = jwt.verify(token, secret);
    let user;

    if (isDatabaseConnected()) {
      user = await User.findOne({ _id: decoded._id });
    } else {
      user = Array.from(inMemoryUsers.values()).find(u => u._id.toString() === decoded._id);
    }

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
