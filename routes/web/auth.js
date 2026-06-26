const router = require('express').Router();
const passport = require('passport');
const authController = require('../../controllers/authController');

router.get('/register', authController.showRegister);
router.post('/register', authController.register);

router.get('/login', authController.showLogin);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/projects',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.post('/logout', authController.logout);

module.exports = router;
