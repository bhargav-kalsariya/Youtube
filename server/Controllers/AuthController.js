const bcrypt = require('bcrypt');
const { ERROR, SUCCESS } = require('../Utilities/ResponseWrapper');
const User = require('../Models/User');

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

    res.send(SUCCESS(201, 'you have successfully signed up'));

}

const LoginController = (req, res) => {

    console.log('working fine');

}

module.exports = { LoginController, SignupController };