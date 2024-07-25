const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const UserController = require('../Controllers/UserController');

router.get('/profile', IsAuth, UserController.myProfileController);
router.post('/updateProfile', IsAuth, UserController.updateProfileController);
router.post('/othersProfile', IsAuth, UserController.userProfileController);

module.exports = router;