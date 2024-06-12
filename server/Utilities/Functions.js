const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const GenerateAccessToken = (IdToCreateToken) => {

    const AccessToken = jwt.sign(IdToCreateToken, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: '1d'
    });
    return AccessToken;

}

const GenerateRefreshToken = (IdToCreateToken) => {

    const RefreshToken = jwt.sign(IdToCreateToken, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: '1y'
    });
    return RefreshToken;

}

module.exports = { GenerateAccessToken, GenerateRefreshToken };