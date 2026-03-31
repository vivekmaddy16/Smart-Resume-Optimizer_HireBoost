const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit — app works without DB (in-memory mode)
    console.log('⚠️  Running without database. Resume history will not be saved.');
  }
};

module.exports = connectDB;
