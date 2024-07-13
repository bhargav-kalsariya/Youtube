const router = require('express').Router();
const AuthController = require('../Controllers/AuthController');
const IsAuth = require('../Middlewares/IsAuth');

router.post('/signup', AuthController.SignupController);
router.post('/login', AuthController.LoginController);
router.get('refresh', AuthController.RefreshController);

module.exports = router;