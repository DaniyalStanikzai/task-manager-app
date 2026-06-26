const router = require('express').Router();
const { verifyJWT } = require('../../middleware/auth');
const authController = require('../../controllers/authController');

router.post('/register', authController.apiRegister);
router.post('/login', authController.apiLogin);
router.get('/me', verifyJWT, authController.apiMe);

module.exports = router;
