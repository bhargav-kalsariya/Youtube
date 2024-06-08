const router = require('express').Router();
const AuthRouter = require('../Routers/AuthRouter');

router.use('/auth', AuthRouter);

module.exports = router;