const router = require('express').Router();
const AuthController = require('../Controllers/AuthController');

router.post('/signup', AuthController.SignupController);
router.post('/login', AuthController.LoginController);
router.get('/refresh', AuthController.RefreshController);

module.exports = router;