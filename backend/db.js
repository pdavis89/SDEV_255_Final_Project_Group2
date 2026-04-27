const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI ||
  'mongodb+srv://sdev255:Password255@sdev255.ww7g3zt.mongodb.net/?appName=Sdev255';

async function connectDB() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
