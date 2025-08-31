const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: function(v) {
        return Number.isInteger(v) || (v % 0.5 === 0);
      },
      message: 'Rating must be a whole number or half number (e.g., 1, 1.5, 2, etc.)'
    }
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minLength: [10, 'Review must be at least 10 characters long'],
    maxLength: [1000, 'Review cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt field before saving
ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index to ensure one review per user per movie
ReviewSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);