const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const VideoController = require('../Controllers/VideoController');

router.post('/create', IsAuth, VideoController.createVideoController);

module.exports = router;