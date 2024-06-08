const express = require('express');
const dotenv = require('dotenv');
const configProcess = require('./configs/databaseConfig');
const BaseRouter = require('./Routers/BaseRouter');

const app = express();
dotenv.config();
configProcess();

app.use('/', BaseRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log('listening on port' + PORT);

})