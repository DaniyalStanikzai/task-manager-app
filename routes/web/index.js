const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/auth');

router.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/projects');
  res.render('home', { title: 'Task Manager' });
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
