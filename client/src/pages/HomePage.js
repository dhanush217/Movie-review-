import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Movie from '../components/Movie';

const HomePage = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch all movies and separate featured and trending
        const { data } = await axios.get('/api/movies?pageSize=20');
        const movies = data.movies || [];
        
        // Sort by rating for featured movies (top 4)
        const featured = movies
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 4);
        
        // Sort by release year for trending movies (top 4 recent)
        const trending = movies
          .sort((a, b) => b.releaseYear - a.releaseYear)
          .slice(0, 4);
        
        setFeaturedMovies(featured);
        setTrendingMovies(trending);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch movies');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderMovieGrid = (movies) => (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div key={movie._id}>
          <Movie movie={movie} />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="error-title">Oops! Something went wrong</div>
        <div className="error-message">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            <i className="fas fa-film me-3"></i>
            Welcome to CineReview
          </h1>
          <p className="hero-subtitle">
            Discover, review, and rate your favorite movies. 
            Join our community of film enthusiasts and never miss a great movie again.
          </p>
          <div className="d-flex gap-3 justify-content-center mt-4">
            <Link to="/movies" className="btn btn-primary btn-lg">
              <i className="fas fa-video me-2"></i>
              Explore Movies
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-user-plus me-2"></i>
              Join Community
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Featured Movies Section */}
        <section className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-star me-2"></i>
              Featured Movies
            </h2>
            <p className="section-subtitle">
              Highly rated movies that our community loves. 
              These films have received outstanding reviews and ratings.
            </p>
          </div>
          
          {featuredMovies.length > 0 ? (
            <>
              {renderMovieGrid(featuredMovies)}
              <div className="text-center mt-4">
                <Link to="/movies" className="btn btn-outline-primary">
                  <i className="fas fa-arrow-right me-2"></i>
                  View All Movies
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-film fa-3x text-muted mb-3"></i>
              <h4>No featured movies available</h4>
              <p className="text-muted">Check back later for featured content!</p>
            </div>
          )}
        </section>

        {/* Trending Movies Section */}
        <section className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-fire me-2"></i>
              Trending Now
            </h2>
            <p className="section-subtitle">
              The latest and most popular movies that everyone is talking about. 
              Stay up to date with current cinema trends.
            </p>
          </div>
          
          {trendingMovies.length > 0 ? (
            <>
              {renderMovieGrid(trendingMovies)}
              <div className="text-center mt-4">
                <Link to="/movies" className="btn btn-outline-primary">
                  <i className="fas fa-arrow-right me-2"></i>
                  Discover More
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
              <h4>No trending movies available</h4>
              <p className="text-muted">Check back later for trending content!</p>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-5 mb-5" style={{background: 'var(--background-light)', borderRadius: 'var(--border-radius)'}}>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="fas fa-search fa-3x text-primary mb-3"></i>
                <h4>Discover</h4>
                <p className="text-muted">
                  Explore thousands of movies across all genres and find your next favorite film.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="fas fa-star fa-3x text-warning mb-3"></i>
                <h4>Review</h4>
                <p className="text-muted">
                  Share your thoughts and rate movies to help others discover great cinema.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4">
                <i className="fas fa-users fa-3x text-success mb-3"></i>
                <h4>Connect</h4>
                <p className="text-muted">
                  Join a community of movie lovers and see what others are watching.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
