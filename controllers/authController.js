const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// --- Web controllers ---

exports.showRegister = (req, res) => res.render('auth/register', { title: 'Register' });

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/register');
    }
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      req.flash('error', 'Email already in use.');
      return res.redirect('/auth/register');
    }
    await User.create({ name, email, password });
    req.flash('success', 'Account created! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    req.flash('error', 'Registration failed.');
    res.redirect('/auth/register');
  }
};

exports.showLogin = (req, res) => res.render('auth/login', { title: 'Login' });

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully.');
    res.redirect('/auth/login');
  });
};

// --- API controllers ---

exports.apiRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, and password are required.' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already in use.' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.apiLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required.' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.apiMe = (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
};
