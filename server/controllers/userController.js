const User = require('../models/User');
const Movie = require('../models/Movie');

// @desc    Get user profile and review history
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).populate('watchlist');

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      joinDate: user.joinDate,
      watchlist: user.watchlist,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      user.password = req.body.password; // Hashing handled by pre-save hook in User model
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      joinDate: updatedUser.joinDate,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user's watchlist
// @route   GET /api/users/:id/watchlist
// @access  Private
const getUserWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'watchlist',
      select: 'title posterURL genre averageRating releaseYear'
    });

    if (user) {
      res.json(user.watchlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Server error while fetching watchlist' });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/users/:id/watchlist
// @access  Private
const addMovieToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.params.id);
    const movie = await Movie.findById(movieId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    
    user.watchlist.push(movieId);
    await user.save();
    res.status(201).json({ message: 'Movie added to watchlist' });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Server error while adding to watchlist' });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/:id/watchlist/:movieId
// @access  Private
const removeMovieFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.params.id);

    if (user) {
      user.watchlist = user.watchlist.filter(
        (movie) => movie.toString() !== movieId.toString()
      );
      await user.save();
      res.json({ message: 'Movie removed from watchlist' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Server error while removing from watchlist' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
};
