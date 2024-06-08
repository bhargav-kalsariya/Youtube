const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const configUrl = process.env.CONFIG_URL;

const configProcess = async () => {

    try {

        await mongoose.connect(configUrl);

    } catch (error) {

        process.exit(1);

    }

}

module.exports = configProcess