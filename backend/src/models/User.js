const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  classroomIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Remove the pre-save hook since we're hashing in the controller
// userSchema.pre('save', async function(next) { ... });

module.exports = mongoose.model('User', userSchema);