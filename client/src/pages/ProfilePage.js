import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${userInfo._id}`, config);
      setUser(data);
      setFormData({
        username: data.username,
        email: data.email
      });
      setLoading(false);
    } catch (err) {
      setError('Could not fetch user profile');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/users/${userInfo._id}`, formData, config);
      setUser(data);
      setEditing(false);
      
      // Update localStorage with new user info
      const updatedUserInfo = { ...userInfo, username: data.username, email: data.email };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading profile...</div>
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
          <div className="error-title">Error Loading Profile</div>
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
          <i className="fas fa-user me-3"></i>
          My Profile
        </h1>
        <p className="page-subtitle">
          Manage your account information and preferences
        </p>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-user-circle fa-5x text-primary"></i>
              </div>
              <h4>{user.username}</h4>
              <p className="text-muted">{user.email}</p>
              <p className="text-muted">
                <i className="fas fa-calendar me-2"></i>
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </p>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => setEditing(!editing)}
                >
                  <i className="fas fa-edit me-2"></i>
                  {editing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <Link to="/watchlist" className="btn btn-outline-primary">
                  <i className="fas fa-bookmark me-2"></i>
                  View Watchlist
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {editing ? (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-edit me-2"></i>
                  Edit Profile
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Account Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Username</h6>
                    <p className="h5">{user.username}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Email</h6>
                    <p className="h5">{user.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Member Since</h6>
                    <p className="h5">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Watchlist Items</h6>
                    <p className="h5">{user.watchlist ? user.watchlist.length : 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Activity Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-light rounded">
                    <i className="fas fa-bookmark fa-2x text-primary mb-2"></i>
                    <h4 className="mb-1">{user.watchlist ? user.watchlist.length : 0}</h4>
                    <p className="text-muted mb-0">Movies in Watchlist</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-light rounded">
                    <i className="fas fa-star fa-2x text-warning mb-2"></i>
                    <h4 className="mb-1">--</h4>
                    <p className="text-muted mb-0">Reviews Written</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-light rounded">
                    <i className="fas fa-calendar fa-2x text-success mb-2"></i>
                    <h4 className="mb-1">{Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24))}</h4>
                    <p className="text-muted mb-0">Days as Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
