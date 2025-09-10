const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  completedModules: [{
    moduleName: String,
    completedAt: Date,
    score: Number
  }],
  totalModules: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
progressSchema.index({ studentId: 1, classroomId: 1 });

// Calculate progress percentage before saving
progressSchema.pre('save', function(next) {
  if (this.totalModules > 0) {
    this.progressPercentage = (this.completedModules.length / this.totalModules) * 100;
  }
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);