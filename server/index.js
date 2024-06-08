const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use('/', (req, res) => {

    console.log('working fine');

});

const PORT = process.env.PORT || 3000;

app.listen(5009, () => {

    console.log('listening on port' + PORT);

})