const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const VideoController = require('../Controllers/VideoController');

router.post('/create', IsAuth, VideoController.createVideoController);
router.get('/getAll', IsAuth, VideoController.getAllVideocontroller);
router.post('/addView', IsAuth, VideoController.addViewController);
router.post('/like', IsAuth, VideoController.videoLikeController);
router.post('/dislike', IsAuth, VideoController.videoDislikeController);

module.exports = router;