const router = require('express').Router();

router.get('/home', (req, res) => {

    console.log('welcome home');

});

module.exports = router;