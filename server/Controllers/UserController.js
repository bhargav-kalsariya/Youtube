const User = require("../Models/User");
const { ERROR, SUCCESS } = require("../Utilities/ResponseWrapper");
const cloudinary = require('cloudinary').v2;

const userProfileController = async (req, res) => {

    const curUserId = req._id;
    const curUser = await User.findById(curUserId);

    return res.send(SUCCESS(200, curUser));

}

const updateProfileController = async (req, res) => {

    const { ChannleName, Bio, ProfilePicture } = req.body;

    try {

        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        if (!curUser) {
            return res.send(ERROR(404, "user not found"));
        }

        console.log({ curUser });

        if (ChannleName) {
            curUser.channleName = ChannleName
        }
        if (Bio) {
            curUser.bio = Bio
        }
        if (ProfilePicture) {

            let cloudImage = await cloudinary.uploader.upload(ProfilePicture, {
                folder: 'ytVideos'
            });
            curUser.profilePictureURL = {
                publicId: cloudImage.public_id,
                url: cloudImage.secure_url
            }

        }

        await curUser.save();
        return res.send(SUCCESS(200, curUser));

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

}

module.exports = { userProfileController, updateProfileController }