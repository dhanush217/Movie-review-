const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const genre = req.query.genre ? { genre: req.query.genre } : {};
    const releaseYear = req.query.year ? { releaseYear: req.query.year } : {};
    const rating = req.query.rating ? { averageRating: { $gte: Number(req.query.rating) } } : {};

    const filter = { ...keyword, ...genre, ...releaseYear, ...rating };
    
    const count = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ 
      movies, 
      page, 
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error while fetching movies' });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    console.log('Fetching movie with ID:', req.params.id);
    
    // First check if movie exists
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      console.log('Movie not found');
      return res.status(404).json({ message: 'Movie not found' });
    }

    console.log('Movie found:', movie.title);
    console.log('Movie reviews array:', movie.reviews);
    
    // Ensure reviews array exists
    if (!movie.reviews) {
      movie.reviews = [];
      await movie.save();
      console.log('Initialized empty reviews array for movie');
    }

    // Populate reviews with error handling
    let populatedMovie;
    try {
      populatedMovie = await Movie.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'username profilePicture'
        },
        options: { sort: { createdAt: -1 } }
      });
    } catch (populateError) {
      console.error('Error populating reviews:', populateError);
      // If population fails, return movie without populated reviews
      populatedMovie = movie;
      populatedMovie.reviews = [];
    }

    console.log('Populated movie reviews count:', populatedMovie.reviews ? populatedMovie.reviews.length : 0);
    res.json(populatedMovie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error while fetching movie',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Add a new movie
// @route   POST /api/movies
// @access  Private/Admin
const addMovie = async (req, res) => {
  try {
    const { title, genre, releaseYear, director, cast, synopsis, posterURL } = req.body;

    if (!title || !genre || !releaseYear || !director || !cast || !synopsis || !posterURL) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const movieExists = await Movie.findOne({ title });
    if (movieExists) {
      return res.status(400).json({ message: 'Movie with this title already exists' });
    }

    const movie = new Movie({
      title,
      genre,
      releaseYear,
      director,
      cast,
      synopsis,
      posterURL,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ message: 'Server error while adding movie' });
  }
};

// @desc    Create new review
// @route   POST /api/movies/:id/reviews
// @access  Private
const createMovieReview = async (req, res) => {
  console.log('=== REVIEW SUBMISSION START ===');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  console.log('Request user:', req.user ? req.user._id : 'No user');
  
  const { rating, reviewText } = req.body;
  const movieId = req.params.id;

  try {
    // Validate authentication
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Not authorized, please login' });
    }
    
    const userId = req.user._id;

    // Validate required fields
    if (!rating || !reviewText) {
      console.log('Missing fields - rating:', rating, 'reviewText:', reviewText);
      return res.status(400).json({ 
        message: 'Rating and review text are required',
        missing: {
          rating: !rating,
          reviewText: !reviewText
        }
      });
    }

    // Validate rating range
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      console.log('Invalid rating:', rating);
      return res.status(400).json({ 
        message: 'Rating must be a number between 1 and 5',
        received: rating
      });
    }

    // Validate review text length
    const trimmedReview = reviewText.trim();
    if (trimmedReview.length < 10) {
      return res.status(400).json({ 
        message: 'Review must be at least 10 characters long',
        currentLength: trimmedReview.length
      });
    }
    
    if (trimmedReview.length > 1000) {
      return res.status(400).json({ 
        message: 'Review cannot exceed 1000 characters',
        currentLength: trimmedReview.length
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      console.log('Movie not found with ID:', movieId);
      return res.status(404).json({ message: 'Movie not found' });
    }

    console.log('Found movie:', movie.title);

    // Check for existing review from this user
    const existingReview = await Review.findOne({ user: userId, movie: movieId });
    if (existingReview) {
      console.log('User already reviewed this movie');
      return res.status(400).json({ 
        message: 'You have already reviewed this movie. You can update your existing review.',
        existingReview: {
          rating: existingReview.rating,
          reviewText: existingReview.reviewText,
          createdAt: existingReview.createdAt
        }
      });
    }

    console.log('Creating new review...');
    
    // Create the review
    const review = new Review({
      user: userId,
      movie: movieId,
      rating: numericRating,
      reviewText: trimmedReview,
    });

    const savedReview = await review.save();
    console.log('Review saved with ID:', savedReview._id);

    // Add review to movie's reviews array
    movie.reviews.push(savedReview._id);
    
    // Recalculate average rating and review count
    const allReviews = await Review.find({ movie: movieId });
    console.log('Total reviews for movie:', allReviews.length);
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      movie.averageRating = Number((totalRating / allReviews.length).toFixed(1));
      movie.reviewCount = allReviews.length;
      console.log('New average rating:', movie.averageRating);
      console.log('New review count:', movie.reviewCount);
    }

    await movie.save();
    console.log('Movie updated successfully');

    // Populate user information for the response
    await savedReview.populate('user', 'username profilePicture');

    console.log('=== REVIEW SUBMISSION SUCCESS ===');
    
    res.status(201).json({ 
      message: 'Review added successfully',
      review: savedReview,
      movieStats: {
        averageRating: movie.averageRating,
        reviewCount: movie.reviewCount
      }
    });
  } catch (error) {
    console.log('=== REVIEW SUBMISSION ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already reviewed this movie'
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update existing review
// @route   PUT /api/movies/:id/reviews/:reviewId
// @access  Private
const updateMovieReview = async (req, res) => {
  console.log('=== REVIEW UPDATE START ===');
  
  const { rating, reviewText } = req.body;
  const { id: movieId, reviewId } = req.params;

  try {
    // Validate authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please login' });
    }
    
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    // Validate input if provided
    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
      }
      review.rating = numericRating;
    }

    if (reviewText !== undefined) {
      const trimmedReview = reviewText.trim();
      if (trimmedReview.length < 10) {
        return res.status(400).json({ message: 'Review must be at least 10 characters long' });
      }
      if (trimmedReview.length > 1000) {
        return res.status(400).json({ message: 'Review cannot exceed 1000 characters' });
      }
      review.reviewText = trimmedReview;
    }

    const updatedReview = await review.save();

    // Recalculate movie's average rating
    const movie = await Movie.findById(movieId);
    const allReviews = await Review.find({ movie: movieId });
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      movie.averageRating = Number((totalRating / allReviews.length).toFixed(1));
      await movie.save();
    }

    await updatedReview.populate('user', 'username profilePicture');

    console.log('=== REVIEW UPDATE SUCCESS ===');
    
    res.json({ 
      message: 'Review updated successfully',
      review: updatedReview,
      movieStats: {
        averageRating: movie.averageRating,
        reviewCount: movie.reviewCount
      }
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Server error while updating review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/movies/:id/reviews/:reviewId
// @access  Private
const deleteMovieReview = async (req, res) => {
  console.log('=== REVIEW DELETE START ===');
  
  const { id: movieId, reviewId } = req.params;

  try {
    // Validate authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please login' });
    }
    
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    // Remove review
    await Review.findByIdAndDelete(reviewId);

    // Remove review from movie's reviews array and recalculate stats
    const movie = await Movie.findById(movieId);
    movie.reviews.pull(reviewId);
    
    const remainingReviews = await Review.find({ movie: movieId });
    
    if (remainingReviews.length > 0) {
      const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
      movie.averageRating = Number((totalRating / remainingReviews.length).toFixed(1));
    } else {
      movie.averageRating = 0;
    }
    
    movie.reviewCount = remainingReviews.length;
    await movie.save();

    console.log('=== REVIEW DELETE SUCCESS ===');
    
    res.json({ 
      message: 'Review deleted successfully',
      movieStats: {
        averageRating: movie.averageRating,
        reviewCount: movie.reviewCount
      }
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Server error while deleting review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  createMovieReview,
  updateMovieReview,
  deleteMovieReview,
};
