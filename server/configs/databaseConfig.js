const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ERROR } = require('../Utilities/ResponseWrapper');

dotenv.config();
const configUrl = process.env.CONFIG_URL;
console.log('🚀  : ', configUrl);
const configProcess = async () => {

    try {

        const res = await mongoose.connect(configUrl);
        if (!res) throw new Error('Failed to connect to database');
        console.log(res.connection.host)

    } catch (error) {

        console.log('🚀  : ', error);

    }

}

module.exports = configProcess