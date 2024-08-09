const { populate } = require("dotenv");
const User = require("../Models/User");
const { mapVideoDetails } = require("../Utilities/Functions");
const { ERROR, SUCCESS } = require("../Utilities/ResponseWrapper");
const cloudinary = require('cloudinary').v2;

const myProfileController = async (req, res) => {

    const curUserId = req._id;
    const curUser = await User.findById(curUserId)
        .populate('subscriptions')
        .populate({
            path: 'likedVideos',
            populate: [
                {
                    path: 'comments',
                    populate: {
                        path: 'owner'
                    }
                },
                {
                    path: 'owner'
                }
            ]
        })

    const fullvideos = curUser.likedVideos;
    const mappedLikedvideos = fullvideos.map(video => mapVideoDetails(video, curUserId));

    const userWithoutLikedVideos = curUser.toObject();
    delete userWithoutLikedVideos.likedVideos;

    return res.send(SUCCESS(200, { ...userWithoutLikedVideos, mappedLikedvideos }));

}

const userProfileController = async (req, res) => {

    try {

        const { userId } = req.body;
        const user = await User.findById(userId).populate({
            path: 'videos',
            populate: [
                {
                    path: 'comments',
                    populate: {
                        path: 'owner'
                    }
                },
                {
                    path: 'owner'
                }
            ]
        });
        console.log({ user });
        if (!user) {
            return res.send(SUCCESS(404, 'User not found'));
        }

        const fullvideos = user.videos;
        const mappedvideos = fullvideos.map(video => mapVideoDetails(video, userId));

        const userWithoutVideos = user.toObject();
        delete userWithoutVideos.videos;

        return res.send(SUCCESS(200, { ...userWithoutVideos, mappedvideos }));


    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

};

const updateProfileController = async (req, res) => {

    const { ChannleName, Bio, ProfilePicture } = req.body;

    try {

        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        if (!curUser) {
            return res.send(ERROR(404, "user not found"));
        }
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

const subscribe_unsubscribeController = async (req, res) => {

    try {

        const { userId } = req.body;
        const curUserId = req._id;
        const user = await User.findById(userId);
        const curUser = await User.findById(curUserId);

        if (!user) {
            return res.send(ERROR(404, 'user not found'));
        }

        if (curUser.subscriptions.includes(userId)) {
            const subscriptionsIndex = curUser.subscriptions.indexOf(userId);
            curUser.subscriptions.splice(subscriptionsIndex, 1);

            const subscribersIndex = user.subscribers.indexOf(curUserId);
            user.subscribers.splice(subscribersIndex, 1);
        }
        else {
            curUser.subscriptions.push(userId);
            user.subscribers.push(curUserId);
        }

        await user.save();
        await curUser.save();

        return res.send(SUCCESS(200, 'subscription status updated'));

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

};

module.exports = { myProfileController, updateProfileController, userProfileController, subscribe_unsubscribeController }