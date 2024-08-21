const jwt = require('jsonwebtoken');
const { ERROR } = require("../Utilities/ResponseWrapper");
const User = require('../Models/User');

module.exports = async (req, res, next) => {

    try {

        if (
            !req.headers ||
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer')
        ) {

            return res.send(ERROR(403, 'Header authorization required'));

        }

        const accessToken = req.headers.authorization.split(' ')[1];

        try {

            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
            const authUser = await User.findById(decoded._id);

            if (!authUser) {
                return res.send(ERROR(404, "User not found"));
            }

            req._id = decoded._id;
            next();

        } catch (error) {

            return res.send(ERROR(401, 'Invalid Access Token'));

        }

    } catch (error) {

        return res.send(ERROR(500, e.message));

    }

}