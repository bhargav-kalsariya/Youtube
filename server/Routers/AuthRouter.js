const router = require('express').Router();
const AuthController = require('../Controllers/AuthController');

router.post('/signup', AuthController.SignupController);
router.get('/login', AuthController.LoginController);

module.exports = router;