import React from 'react';
import { Link } from 'react-router-dom';

const Movie = ({ movie }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt star"></i>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star star empty"></i>);
    }
    
    return stars;
  };

  return (
    <div className="movie-card card h-100">
      <div className="card-img-wrapper">
        <Link to={`/movies/${movie._id}`}>
          <img 
            src={movie.posterURL} 
            className="card-img-top" 
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/f8f9fa/6c757d?text=No+Image';
            }}
          />
        </Link>
        
        {/* Rating overlay */}
        <div className="rating-overlay">
          <i className="fas fa-star me-1"></i>
          {movie.averageRating.toFixed(1)}
        </div>
        
        {/* Genre tags */}
        <div className="genre-tags">
          {movie.genre.slice(0, 2).map((g, index) => (
            <span key={index} className="genre-tag">
              {g}
            </span>
          ))}
        </div>
      </div>
      
      <div className="card-body">
        <Link 
          to={`/movies/${movie._id}`} 
          className="text-decoration-none"
        >
          <h5 className="card-title">{movie.title}</h5>
        </Link>
        
        <p className="card-text">
          <strong>Director:</strong> {movie.director}
        </p>
        
        <div className="movie-meta">
          <div className="star-rating">
            {renderStars(movie.averageRating)}
          </div>
          <span className="movie-year">{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default Movie;
