const express = require('express');
const dotenv = require('dotenv');
const configProcess = require('./configs/databaseConfig');
const BaseRouter = require('./Routers/BaseRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));
configProcess();

app.use('/', BaseRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT);