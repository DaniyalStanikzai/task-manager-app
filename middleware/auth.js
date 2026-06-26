const jwt = require('jsonwebtoken');
const { User } = require('../models');

// For EJS web routes — redirects to login if not authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please log in to access that page.');
  res.redirect('/auth/login');
};

// For API routes — validates JWT from Authorization header
const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Access token required.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    if (!req.user) return res.status(401).json({ error: 'User not found.' });
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { isAuthenticated, verifyJWT };
