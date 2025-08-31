import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Movie from '../components/Movie';

const MovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Adventure', 'Animation', 'Crime'];
  const years = Array.from({length: 30}, (_, i) => new Date().getFullYear() - i);
  const ratings = [4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch movies function with useCallback to prevent infinite re-renders
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        pageNumber: currentPage,
        ...(debouncedSearchTerm && { keyword: debouncedSearchTerm }),
        ...(selectedGenre && { genre: selectedGenre }),
        ...(selectedYear && { year: selectedYear }),
        ...(selectedRating && { rating: selectedRating })
      });

      const { data } = await axios.get(`/api/movies?${params}`);
      setMovies(data.movies || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalMovies(data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Could not fetch movies. Please try again later.');
      setMovies([]);
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedGenre, selectedYear, selectedRating]);

  // Fetch movies when debounced search term or filters change
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Reset to first page when search or filters change (but not currentPage itself)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedGenre, selectedYear, selectedRating]); // eslint-disable-line react-hooks/exhaustive-deps



  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // This prevents the form from submitting and reloading the page
    // The search is handled by the debounced search effect
  };



  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </li>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <li key={1} className="page-item">
          <button className="page-link" onClick={() => setCurrentPage(1)}>
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      pages.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }

    // Next button
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </li>
    );

    return (
      <div className="pagination-wrapper">
        <ul className="pagination">
          {pages}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading movies...</div>
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
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-video me-3"></i>
          Movie Collection
        </h1>
        <p className="page-subtitle">
          Discover and explore our extensive collection of movies. 
          Use the filters below to find exactly what you're looking for.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <div className="position-relative">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm !== debouncedSearchTerm && (
              <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">
              <i className="fas fa-tags me-2"></i>
              Genre
            </label>
            <select
              className="form-select"
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
              }}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <i className="fas fa-calendar me-2"></i>
              Release Year
            </label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
              }}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <i className="fas fa-star me-2"></i>
              Minimum Rating
            </label>
            <select
              className="form-select"
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
              }}
            >
              <option value="">Any Rating</option>
              {ratings.map(rating => (
                <option key={rating} value={rating}>{rating}+ Stars</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">&nbsp;</label>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearFilters}
            >
              <i className="fas fa-times me-2"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">
          {movies.length > 0 ? (
            `Showing ${movies.length} movie${movies.length !== 1 ? 's' : ''} on page ${currentPage} of ${totalPages} (${totalMovies} total)`
          ) : (
            'No movies found'
          )}
        </h5>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie._id}>
                <Movie movie={movie} />
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-search fa-4x text-muted mb-4"></i>
          <h3>No movies found</h3>
          <p className="text-muted mb-4">
            {searchTerm || selectedGenre || selectedYear || selectedRating ? (
              'No movies match your current filters. Try adjusting your search criteria.'
            ) : (
              'No movies are available at the moment. Please check back later.'
            )}
          </p>
          {(searchTerm || selectedGenre || selectedYear || selectedRating) && (
            <button 
              className="btn btn-primary"
              onClick={clearFilters}
            >
              <i className="fas fa-times me-2"></i>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieListPage;
