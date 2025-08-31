import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating, 
  onRatingChange = null, 
  readonly = false, 
  size = 'md',
  showValue = false 
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const isInteractive = !readonly && onRatingChange;
  
  const sizeClasses = {
    sm: 'star-sm',
    md: 'star-md',
    lg: 'star-lg'
  };

  const handleStarClick = (starRating) => {
    if (isInteractive) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (isInteractive) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoveredRating(0);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = isInteractive ? (hoveredRating || rating) : rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(displayRating);
      const isHalfFilled = i === Math.ceil(displayRating) && displayRating % 1 !== 0;
      
      let starClass = 'star';
      if (isFilled) {
        starClass += ' star-filled';
      } else if (isHalfFilled) {
        starClass += ' star-half';
      } else {
        starClass += ' star-empty';
      }
      
      if (isInteractive) {
        starClass += ' star-interactive';
      }
      
      if (sizeClasses[size]) {
        starClass += ' ' + sizeClasses[size];
      }

      stars.push(
        <span
          key={i}
          className={starClass}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleMouseLeave}
          role={isInteractive ? 'button' : 'presentation'}
          aria-label={isInteractive ? `Rate ${i} star${i !== 1 ? 's' : ''}` : ''}
          tabIndex={isInteractive ? 0 : -1}
        >
          {isFilled ? '★' : isHalfFilled ? '☆' : '☆'}
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {renderStars()}
      </div>
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;