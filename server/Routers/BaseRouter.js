const router = require('express').Router();
const AuthRouter = require('../Routers/AuthRouter');
const UserRouter = require('../Routers/UserRouter');
const VideoRouter = require('../Routers/VideoRouter');

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/video', VideoRouter);

module.exports = router;