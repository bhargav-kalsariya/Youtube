const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const UserController = require('../Controllers/UserController');

router.get('/profile', IsAuth, UserController.userProfileController);
router.post('/updateProfile', IsAuth, UserController.updateProfileController);

module.exports = router;