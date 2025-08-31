const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  addMovie,
  createMovieReview,
  updateMovieReview,
  deleteMovieReview,
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(protect, admin, addMovie);
router.route('/:id').get(getMovieById);
router.route('/:id/reviews').post(protect, createMovieReview);
router.route('/:id/reviews/:reviewId').put(protect, updateMovieReview).delete(protect, deleteMovieReview);

module.exports = router;
