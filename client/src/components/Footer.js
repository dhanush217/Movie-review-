import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h5>
              <i className="fas fa-film me-2"></i>
              CineReview
            </h5>
            <p>
              Your ultimate destination for movie reviews, ratings, and 
              recommendations. Discover your next favorite film.
            </p>
          </div>
          <div className="footer-section">
            <h5>Quick Links</h5>
            <div className="d-flex flex-column">
              <a href="/" className="mb-2">
                <i className="fas fa-home me-2"></i>
                Home
              </a>
              <a href="/movies" className="mb-2">
                <i className="fas fa-video me-2"></i>
                Movies
              </a>
              <a href="/watchlist" className="mb-2">
                <i className="fas fa-bookmark me-2"></i>
                Watchlist
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h5>Support</h5>
            <div className="d-flex flex-column">
              <a href="#" className="mb-2">
                <i className="fas fa-question-circle me-2"></i>
                Help Center
              </a>
              <a href="#" className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                Contact Us
              </a>
              <a href="#" className="mb-2">
                <i className="fas fa-shield-alt me-2"></i>
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h5>Connect</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none">
                <i className="fab fa-youtube fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CineReview. All rights reserved. Made with ❤️ for movie lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
