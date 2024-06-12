const bcrypt = require('bcrypt');
const { ERROR, SUCCESS } = require('../Utilities/ResponseWrapper');
const User = require('../Models/User');
const { GenerateAccessToken, GenerateRefreshToken } = require('../Utilities/Functions');

const SignupController = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !password || !email) {

        return res.send(ERROR(404, "All are required fields"));

    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {

        return res.send(ERROR(403, "User already exists"));

    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username,
        email,
        password: encryptedPassword
    })

    return res.send(SUCCESS(201, 'you have successfully signed up'));

}

const LoginController = async (req, res) => {

    const { email, password } = req.body;

    if (!password || !email) {

        return res.send(ERROR(404, "All are required fields"));

    }

    try {

        const user = await User.findOne({ email }).select('+password');

        if (!user) {

            return res.send(ERROR(404, 'user not found with this email'));

        }

        const stringPassword = password.toString();
        const verifiedUser = await bcrypt.compare(stringPassword, user.password);

        if (!verifiedUser) {

            return res.send(ERROR(403, 'password mismatch'));

        }

        const accessToken = GenerateAccessToken({ _id: user._id });
        const refreshToken = GenerateRefreshToken({ _id: user._id });

        res.cookie('jwt', refreshToken, {
            secure: true,
            httpOnly: true
        });

        return res.send(SUCCESS(200, { accessToken }));

    } catch (error) {

        return res.send(ERROR(500, 'internal error' + error.message));

    }

}

module.exports = { LoginController, SignupController };