const router = require('express').Router();
const AuthRouter = require('../Routers/AuthRouter');
const UserRouter = require('../Routers/UserRouter');

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);

module.exports = router;