const IsAuth = require('../Middlewares/IsAuth');
const router = require('express').Router();
const VideoController = require('../Controllers/VideoController');

router.post('/create', IsAuth, VideoController.createVideoController);
router.get('/getAll', IsAuth, VideoController.getAllVideocontroller);

module.exports = router;