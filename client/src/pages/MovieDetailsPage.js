import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: '' });
  const [userExistingReview, setUserExistingReview] = useState(null);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchMovie();
    if (userInfo) {
      checkWatchlistStatus();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMovie = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching movie with ID:', id);
      
      // Validate movie ID format
      if (!id || id.length !== 24) {
        throw new Error('Invalid movie ID format');
      }
      
      const { data } = await axios.get(`http://localhost:5000/api/movies/${id}`);
      console.log('Movie data received:', data);
      
      if (!data) {
        throw new Error('No movie data received');
      }
      
      setMovie(data);
      setReviews(data.reviews || []);
      
      // Check if current user has already reviewed this movie
      if (userInfo && data.reviews) {
        const existingUserReview = data.reviews.find(review => 
          review.user && review.user._id === userInfo._id
        );
        setUserExistingReview(existingUserReview || null);
        console.log('User existing review:', existingUserReview);
      } else {
        setUserExistingReview(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movie:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      let errorMessage = 'Could not fetch movie details';
      
      if (err.response?.status === 404) {
        errorMessage = 'Movie not found';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/users/${userInfo._id}/watchlist`, config);
      setInWatchlist(data.some(item => item.movie._id === id));
    } catch (err) {
      console.error('Error checking watchlist status:', err);
    }
  };



  const toggleWatchlist = async () => {
    if (!userInfo) {
      alert('Please login to add to watchlist');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (inWatchlist) {
        await axios.delete(`http://localhost:5000/api/users/${userInfo._id}/watchlist/${id}`, config);
        setInWatchlist(false);
      } else {
        await axios.post(`http://localhost:5000/api/users/${userInfo._id}/watchlist`, { movieId: id }, config);
        setInWatchlist(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating watchlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log('=== REVIEW SUBMISSION START ===');
    console.log('User info:', userInfo);
    console.log('New review data:', newReview);
    console.log('Movie ID:', id);
    
    if (!userInfo) {
      alert('Please login to submit a review');
      return;
    }

    // Validate review text
    if (!newReview.reviewText.trim()) {
      alert('Please enter a review text');
      return;
    }

    if (newReview.reviewText.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return;
    }

    if (newReview.reviewText.trim().length > 1000) {
      alert('Review cannot exceed 1000 characters');
      return;
    }

    // Validate rating
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      alert('Please select a valid rating between 1 and 5');
      return;
    }

    setReviewLoading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      console.log('Sending request with config:', config);
      console.log('Request URL:', `http://localhost:5000/api/movies/${id}/reviews`);
      console.log('Request data:', newReview);
      
      const response = await axios.post(
        `http://localhost:5000/api/movies/${id}/reviews`, 
        newReview, 
        config
      );
      
      console.log('Review submission successful:', response.data);
      
      // Reset form
      setNewReview({ rating: 5, reviewText: '' });
      setShowReviewForm(false);
      
      // Refresh movie data to get updated reviews
      await fetchMovie();
      
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Review submission error:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Error submitting review';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    console.log('=== REVIEW UPDATE START ===');
    
    if (!userInfo) {
      alert('Please login to update your review');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/movies/${id}/reviews/${reviewId}`, 
        updatedData, 
        config
      );
      
      console.log('Review update successful:', response.data);
      
      // Refresh movie data
      await fetchMovie();
      
      alert('Review updated successfully!');
    } catch (err) {
      console.error('Review update error:', err);
      alert(err.response?.data?.message || 'Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    console.log('=== REVIEW DELETE START ===');
    
    if (!userInfo) {
      alert('Please login to delete your review');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const response = await axios.delete(
        `http://localhost:5000/api/movies/${id}/reviews/${reviewId}`, 
        config
      );
      
      console.log('Review delete successful:', response.data);
      
      // Refresh movie data
      await fetchMovie();
      
      alert('Review deleted successfully!');
    } catch (err) {
      console.error('Review delete error:', err);
      alert(err.response?.data?.message || 'Error deleting review');
    }
  };

  const toggleReviewForm = () => {
    if (userExistingReview) {
      // If user has existing review, populate form with existing data for editing
      setNewReview({
        rating: userExistingReview.rating,
        reviewText: userExistingReview.reviewText
      });
    } else {
      // Reset to default values for new review
      setNewReview({ rating: 5, reviewText: '' });
    }
    setShowReviewForm(!showReviewForm);
  };



  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="error-title">Oops! Something went wrong</div>
          <div className="error-message">{error}</div>
          <Link to="/movies" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-search"></i>
          </div>
          <div className="error-title">Movie Not Found</div>
          <div className="error-message">
            The movie you're looking for doesn't exist or has been removed.
          </div>
          <Link to="/movies" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="fas fa-home me-1"></i>
              Home
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/movies">
              <i className="fas fa-video me-1"></i>
              Movies
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {movie.title}
          </li>
        </ol>
      </nav>

      {/* Movie Details */}
      <div className="row mb-5">
        <div className="col-lg-4 mb-4">
          <div className="position-relative">
            <img 
              src={movie.posterURL} 
              alt={movie.title} 
              className="img-fluid rounded shadow-lg"
              style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600/f8f9fa/6c757d?text=No+Image';
              }}
            />
            <div className="position-absolute top-0 end-0 p-3">
              <div className="rating-overlay">
                <i className="fas fa-star me-1"></i>
                {movie.averageRating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="display-4 mb-0">{movie.title}</h1>
            {userInfo && (
              <button
                className={`btn ${inWatchlist ? 'btn-danger' : 'btn-outline-primary'}`}
                onClick={toggleWatchlist}
              >
                <i className={`fas ${inWatchlist ? 'fa-bookmark' : 'fa-bookmark'} me-2`}></i>
                {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            )}
          </div>
          
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                <StarRating 
                  rating={movie.averageRating} 
                  readonly={true} 
                  size="lg"
                  showValue={false}
                />
              </div>
              <span className="h5 mb-0 text-muted">
                {movie.averageRating.toFixed(1)} / 5
                {reviews.length > 0 && (
                  <span className="ms-2">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                )}
              </span>
            </div>
            
            <div className="row text-center mb-4">
              <div className="col-md-3 col-6 mb-2">
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <i className="fas fa-calendar text-primary mb-1"></i>
                    <div className="small text-muted">Release Year</div>
                    <div className="fw-bold">{movie.releaseYear}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <i className="fas fa-user text-success mb-1"></i>
                    <div className="small text-muted">Director</div>
                    <div className="fw-bold">{movie.director}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <i className="fas fa-tags text-warning mb-1"></i>
                    <div className="small text-muted">Genres</div>
                    <div className="fw-bold">{movie.genre.length}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <i className="fas fa-users text-info mb-1"></i>
                    <div className="small text-muted">Cast Members</div>
                    <div className="fw-bold">{movie.cast.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3>
              <i className="fas fa-align-left me-2 text-primary"></i>
              Synopsis
            </h3>
            <p className="lead">{movie.synopsis}</p>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5>
                <i className="fas fa-tags me-2 text-warning"></i>
                Genres
              </h5>
              <div className="d-flex flex-wrap gap-2">
                {movie.genre.map((g, index) => (
                  <span key={index} className="badge bg-primary fs-6 px-3 py-2">
                    {g}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <h5>
                <i className="fas fa-users me-2 text-info"></i>
                Cast
              </h5>
              <p>{movie.cast.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* Reviews Section */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-comments me-2 text-primary"></i>
              Reviews ({reviews.length})
            </h2>
            {userInfo && (
              <button
                className="btn btn-primary"
                onClick={toggleReviewForm}
              >
                <i className={`fas ${userExistingReview ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                {userExistingReview ? 'Edit Your Review' : 'Write Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-pen me-2"></i>
                  {userExistingReview ? 'Edit Your Review' : 'Write Your Review'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div className="d-flex align-items-center gap-3">
                      <StarRating 
                        rating={newReview.rating}
                        onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                        readonly={false}
                        size="lg"
                      />
                      <span className="text-muted fw-bold">
                        {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Review</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Share your thoughts about this movie... (minimum 10 characters)"
                      value={newReview.reviewText}
                      onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                      minLength="10"
                      maxLength="1000"
                      required
                    ></textarea>
                    <div className="form-text">
                      {newReview.reviewText.length}/1000 characters
                      {newReview.reviewText.length < 10 && (
                        <span className="text-danger"> (Minimum 10 characters required)</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={reviewLoading || newReview.reviewText.length < 10}
                    >
                      {reviewLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {userExistingReview ? 'Updating...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          <i className={`fas ${userExistingReview ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                          {userExistingReview ? 'Update Review' : 'Submit Review'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                    {userExistingReview && (
                      <button
                        type="button"
                        className="btn btn-outline-danger ms-auto"
                        onClick={() => handleDeleteReview(userExistingReview._id)}
                      >
                        <i className="fas fa-trash me-2"></i>
                        Delete Review
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="row">
              {reviews.map((review, index) => (
                <div key={review._id || index} className="col-12 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                 style={{ width: '50px', height: '50px' }}>
                              <i className="fas fa-user text-white"></i>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-1 fw-bold">
                              {review.user?.username || 'Anonymous User'}
                            </h6>
                            <div className="d-flex align-items-center gap-2">
                              <StarRating 
                                rating={review.rating}
                                readonly={true}
                                size="sm"
                              />
                              <small className="text-muted">
                                {review.rating}/5
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Unknown date'}
                          </small>
                          {userInfo && review.user?._id === userInfo._id && (
                            <div className="mt-1">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={toggleReviewForm}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteReview(review._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="mb-0 review-text">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-comments fa-4x text-muted mb-3"></i>
              <h4 className="text-muted">No reviews yet</h4>
              <p className="text-muted mb-4">
                Be the first to share your thoughts about this movie!
              </p>
              {userInfo ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={toggleReviewForm}
                >
                  <i className="fas fa-plus me-2"></i>
                  Write First Review
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary btn-lg">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login to Write Review
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
