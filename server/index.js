const express = require('express');
const dotenv = require('dotenv');
const configProcess = require('./configs/databaseConfig');
const BaseRouter = require('./Routers/BaseRouter');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));
dotenv.config();
configProcess();

app.use('/', BaseRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log('listening on port' + PORT);

})