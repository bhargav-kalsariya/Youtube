const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const UserController = require('../Controllers/UserController');

router.get('/profile', IsAuth, UserController.myProfileController);
router.post('/updateProfile', IsAuth, UserController.updateProfileController);
router.post('/userProfile', IsAuth, UserController.userProfileController);
router.post('/othersProfile', IsAuth, UserController.othersProfileController);
router.post('/subscribe-unsubscribe', IsAuth, UserController.subscribe_unsubscribeController);
router.get('/watchHistory', IsAuth, UserController.getWatchHistoryController);
router.delete('/watchHistory', IsAuth, UserController.clearWatchHistoryController);

module.exports = router;