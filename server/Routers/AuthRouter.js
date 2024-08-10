const router = require('express').Router();
const AuthController = require('../Controllers/AuthController');

router.post('/signup', AuthController.SignupController);
router.post('/login', AuthController.LoginController);
router.get('/refresh', AuthController.RefreshController);
router.get('/logout', AuthController.LogoutController);

module.exports = router;