import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-film me-2"></i>
            CineReview
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={isActiveLink('/')} to="/">
                  <i className="fas fa-home me-1"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActiveLink('/movies')} to="/movies">
                  <i className="fas fa-video me-1"></i>
                  Movies
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              {userInfo ? (
                <>
                  <li className="nav-item">
                    <Link className={isActiveLink('/watchlist')} to="/watchlist">
                      <i className="fas fa-bookmark me-1"></i>
                      Watchlist
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-user me-1"></i>
                      {userInfo.username}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <i className="fas fa-user-circle me-2"></i>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={logoutHandler}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={isActiveLink('/login')} to="/login">
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActiveLink('/register')} to="/register">
                      <i className="fas fa-user-plus me-1"></i>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
