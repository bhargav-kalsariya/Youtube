const express = require('express');
const dotenv = require('dotenv');
const configProcess = require('./configs/databaseConfig');

const app = express();
dotenv.config();
configProcess();

app.get('/', (req, res) => {

    console.log('working fine');

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log('listening on port' + PORT);

})