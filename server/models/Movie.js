const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  cast: {
    type: [String],
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  posterURL: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  reviewCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Movie', MovieSchema);
