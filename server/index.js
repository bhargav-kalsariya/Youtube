const express = require('express');
const dotenv = require('dotenv');
const configProcess = require('./configs/databaseConfig');
const BaseRouter = require('./Routers/BaseRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
dotenv.config();

const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
configProcess();

app.use('/', BaseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
