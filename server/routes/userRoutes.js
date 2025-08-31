const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id/watchlist').get(protect, getUserWatchlist).post(protect, addMovieToWatchlist);
router.route('/:id/watchlist/:movieId').delete(protect, removeMovieFromWatchlist);

module.exports = router;
