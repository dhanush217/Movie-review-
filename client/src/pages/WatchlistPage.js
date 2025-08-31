import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Movie from '../components/Movie';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${userInfo._id}/watchlist`, config);
      setWatchlist(data);
      setLoading(false);
    } catch (err) {
      setError('Could not fetch watchlist');
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(`/api/users/${userInfo._id}/watchlist/${movieId}`, config);
      setWatchlist(watchlist.filter(movie => movie._id !== movieId));
    } catch (err) {
      alert('Error removing movie from watchlist');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your watchlist...</div>
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
          <div className="error-title">Error Loading Watchlist</div>
          <div className="error-message">{error}</div>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-bookmark me-3"></i>
          My Watchlist
        </h1>
        <p className="page-subtitle">
          Movies you want to watch later. Keep track of films that caught your interest.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="text-muted mb-0">
            {watchlist.length > 0 ? (
              `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} in your watchlist`
            ) : (
              'Your watchlist is empty'
            )}
          </h5>
        </div>
        <div>
          <Link to="/movies" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Discover Movies
          </Link>
        </div>
      </div>

      {watchlist.length > 0 ? (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <div key={movie._id} className="position-relative">
              <Movie movie={movie} />
              <button
                className="btn btn-danger btn-sm position-absolute"
                style={{
                  top: '10px',
                  left: '10px',
                  zIndex: 10,
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => removeFromWatchlist(movie._id)}
                title="Remove from watchlist"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-bookmark fa-4x text-muted mb-4"></i>
          <h3>Your watchlist is empty</h3>
          <p className="text-muted mb-4">
            Start building your watchlist by adding movies you want to watch. 
            Browse our collection and bookmark films that interest you.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/movies" className="btn btn-primary">
              <i className="fas fa-search me-2"></i>
              Browse Movies
            </Link>
            <Link to="/" className="btn btn-outline-primary">
              <i className="fas fa-home me-2"></i>
              Go Home
            </Link>
          </div>
        </div>
      )}

      {watchlist.length > 0 && (
        <div className="text-center mt-5">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-lightbulb me-2 text-warning"></i>
                Tip
              </h5>
              <p className="card-text text-muted mb-0">
                You have {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} in your watchlist. 
                Click on any movie to read reviews and details, or start watching!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
