const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware - Headers:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Token present' : 'No token');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully, user ID:', decoded.id);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? req.user.username : 'User not found');

      if (!req.user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header or invalid format');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) { // Assuming an isAdmin field in User model for admin users
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
