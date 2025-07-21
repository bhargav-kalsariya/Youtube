const { populate } = require("dotenv");
const User = require("../Models/User");
const { mapVideoDetails } = require("../Utilities/Functions");
const { ERROR, SUCCESS } = require("../Utilities/ResponseWrapper");
const cloudinary = require('cloudinary').v2;

const myProfileController = async (req, res) => {

    try {
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
            });

        if (!curUser) {
            return res.send(ERROR(404, 'User not found'));
        }

        const fullvideos = curUser.likedVideos;
        const mappedLikedvideos = fullvideos.map(video => mapVideoDetails(video, curUserId));

        const userWithoutLikedVideos = curUser.toObject();
        delete userWithoutLikedVideos.likedVideos;

        return res.send(SUCCESS(200, { ...userWithoutLikedVideos, mappedLikedvideos }));

    } catch (error) {
        console.error('Error in myProfileController:', error);
        return res.send(ERROR(500, error.message));
    }

}

const userProfileController = async (req, res) => {

    try {

        const { userId } = req.body;

        if (!userId) {
            return res.send(ERROR(400, 'User ID is required'));
        }

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

        if (!user) {
            return res.send(ERROR(404, 'User not found'));
        }

        const fullvideos = user.videos;
        const mappedvideos = fullvideos.map(video => mapVideoDetails(video, userId));

        const userWithoutVideos = user.toObject();
        delete userWithoutVideos.videos;

        return res.send(SUCCESS(200, { ...userWithoutVideos, mappedvideos }));

    } catch (error) {
        console.error('Error in userProfileController:', error);
        return res.send(ERROR(500, error.message));
    }

};

const othersProfileController = async (req, res) => {

    try {

        const { userId } = req.body;
        const curUserId = req._id;

        if (!userId) {
            return res.send(ERROR(400, 'User ID is required'));
        }

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

        if (!user) {
            return res.send(ERROR(404, 'User not found'));
        }

        const fullvideos = user.videos;
        const mappedvideos = fullvideos.map(video => mapVideoDetails(video, curUserId));

        const userWithoutVideos = user.toObject();
        delete userWithoutVideos.videos;

        return res.send(SUCCESS(200, { ...userWithoutVideos, mappedvideos }));

    } catch (error) {
        console.error('Error in othersProfileController:', error);
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
            curUser.channleName = ChannleName;
        }
        if (Bio) {
            curUser.bio = Bio;
        }
        if (ProfilePicture) {
            try {
                let cloudImage = await cloudinary.uploader.upload(ProfilePicture, {
                    folder: 'ytVideos'
                });
                curUser.profilePictureURL = {
                    publicId: cloudImage.public_id,
                    url: cloudImage.secure_url
                };
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.send(ERROR(500, 'Failed to upload profile picture'));
            }
        }

        await curUser.save();
        return res.send(SUCCESS(200, curUser));

    } catch (error) {
        console.error('Error in updateProfileController:', error);
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
            return res.send(ERROR(404, 'User not found'));
        }

        if (!curUser) {
            return res.send(ERROR(404, 'Current user not found'));
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
        console.error('Error in subscribe_unsubscribeController:', error);
        return res.send(ERROR(500, error.message));
    }

};

const getWatchHistoryController = async (req, res) => {
    try {
        const curUserId = req._id;
        const { limit = 50 } = req.query;

        const user = await User.findById(curUserId)
            .populate({
                path: 'watchHistory.video',
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

        if (!user) {
            return res.send(ERROR(404, 'User not found'));
        }

        // Filter out videos that might have been deleted
        const validHistory = user.watchHistory
            .filter(item => item.video)
            .slice(0, parseInt(limit));

        const mappedHistory = validHistory.map(item => ({
            ...mapVideoDetails(item.video, curUserId),
            watchedAt: item.watchedAt
        }));

        return res.send(SUCCESS(200, mappedHistory));

    } catch (error) {
        console.error('Error in getWatchHistoryController:', error);
        return res.send(ERROR(500, error.message));
    }
};

const clearWatchHistoryController = async (req, res) => {
    try {
        const curUserId = req._id;

        const user = await User.findById(curUserId);
        if (!user) {
            return res.send(ERROR(404, 'User not found'));
        }

        user.watchHistory = [];
        await user.save();

        return res.send(SUCCESS(200, 'Watch history cleared successfully'));

    } catch (error) {
        console.error('Error in clearWatchHistoryController:', error);
        return res.send(ERROR(500, error.message));
    }
};

module.exports = {
    myProfileController,
    updateProfileController,
    userProfileController,
    othersProfileController,
    subscribe_unsubscribeController,
    getWatchHistoryController,
    clearWatchHistoryController
}