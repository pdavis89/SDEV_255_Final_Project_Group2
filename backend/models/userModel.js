const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['professor', 'student'],
      default: 'student',
      required: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
  },
  {
    timestamps: true,
  }
);

// checks a plain password against the saved password hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
