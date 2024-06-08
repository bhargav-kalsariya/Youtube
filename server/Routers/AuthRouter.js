const router = require('express').Router();
const AuthController = require('../Controllers/AuthController');

router.get('/login', AuthController.LoginController);

module.exports = router;