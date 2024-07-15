const User = require("../Models/User");
const { ERROR, SUCCESS } = require("../Utilities/ResponseWrapper");

const userProfileController = async (req, res) => {

    const curUserId = req._id;
    const curUser = await User.findById(curUserId);

    return res.send(SUCCESS(200, { curUser }));

}

module.exports = { userProfileController }