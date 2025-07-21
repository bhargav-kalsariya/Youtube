const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const VideoController = require('../Controllers/VideoController');

router.post('/create', IsAuth, VideoController.createVideoController);
router.get('/getAll', IsAuth, VideoController.getAllVideocontroller);
router.get('/search', IsAuth, VideoController.searchVideosController);
router.get('/trending', IsAuth, VideoController.getTrendingVideosController);
router.get('/:videoId', IsAuth, VideoController.getVideoByIdController);
router.post('/addView', IsAuth, VideoController.addViewController);
router.post('/like', IsAuth, VideoController.videoLikeController);
router.post('/dislike', IsAuth, VideoController.videoDislikeController);
router.post('/addComment', IsAuth, VideoController.addCommentController);
router.put('/:videoId', IsAuth, VideoController.updateVideoController);
router.delete('/:videoId', IsAuth, VideoController.deleteVideoController);

module.exports = router;