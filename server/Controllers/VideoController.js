const cloudinary = require('cloudinary').v2;
const { ERROR, SUCCESS } = require('../Utilities/ResponseWrapper');
const Video = require('../Models/Video');
const User = require('../Models/User');
const { mapVideoDetails } = require('../Utilities/Functions');

const createVideoController = async (req, res) => {

    try {

        const { title, description, postVideo } = req.body;
        const owner = req._id;
        const curUser = await User.findById(owner);

        if (!title || !description || !postVideo) {
            return res.status(400).send(ERROR(400, 'All fields are required'));
        }

        const cloudVideo = await cloudinary.uploader.upload(postVideo, {
            resource_type: "video",
            folder: 'ytVideos'
        });

        const createdVideo = await Video.create({
            owner,
            title,
            description,
            video: {
                publicId: cloudVideo.public_id,
                url: cloudVideo.secure_url
            }
        });

        curUser.videos.push(createdVideo._id);
        await curUser.save();

        return res.status(201).send(SUCCESS(201, createdVideo));

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }
};

const getAllVideocontroller = async (req, res) => {
    try {
        const curUserId = req._id;

        const videos = await Video.find().populate([
            {
                path: 'comments',
                populate: {
                    path: 'owner'
                }
            },
            {
                path: 'owner'
            }
        ]);

        const mappedVideoDetails = videos.map(video => mapVideoDetails(video, curUserId)).reverse();

        return res.send(SUCCESS(200, mappedVideoDetails));

    } catch (error) {
        console.error('Error in getAllVideocontroller:', error);
        return res.send(ERROR(500, error.message));
    }
};


const addViewController = async (req, res) => {

    try {

        const { videoId } = req.body;
        const curUserId = req._id;

        const video = await Video.findById(videoId);
        const curUser = await User.findById(curUserId);

        if (!video || !curUser) {
            return res.send(SUCCESS(404, 'video or user not found'));
        }

        if (video.viewedBy.includes(curUserId)) {
            return res.send(SUCCESS(200, 'already watched'));
        }

        video.views += 1;
        video.viewedBy.push(curUserId);

        await video.save();
        return res.send(SUCCESS(200, 'view added successfully'));

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

};

const videoLikeController = async (req, res) => {

    try {

        const { videoId } = req.body;
        const curUserId = req._id;

        const video = await Video.findById(videoId);
        const curUser = await User.findById(curUserId);

        if (!video || !curUser) {
            return res.send(SUCCESS(404, 'video or user not found'));
        }

        if (video.likes.includes(curUserId)) {

            video.likes.pull(curUserId);
            curUser.likedVideos.pull(videoId);

        } else {

            if (video.dislikes.includes(curUserId)) {
                video.dislikes.pull(curUserId);
            }
            video.likes.push(curUserId);
            curUser.likedVideos.push(videoId);

        }

        await video.save();
        await curUser.save();
        return res.send(SUCCESS(200, 'liked successfully'));

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

};

const videoDislikeController = async (req, res) => {

    try {

        const { videoId } = req.body;
        const curUserId = req._id;

        const video = await Video.findById(videoId);
        const curUser = await User.findById(curUserId);

        if (!video || !curUser) {
            return res.send(SUCCESS(404, 'video or user not found'));
        }

        if (video.dislikes.includes(curUserId)) {

            video.dislikes.pull(curUserId);

        } else {

            if (video.likes.includes(curUserId)) {
                video.likes.pull(curUserId);
                curUser.likedVideos.pull(videoId);
            }
            video.dislikes.push(curUserId);

        }

        await video.save();
        await curUser.save();
        return res.send(SUCCESS(200, 'disliked successfully'));

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

};

const addCommentController = async (req, res) => {

    try {

        const { videoId, newComment } = req.body;
        const curUserId = req._id;

        const video = await Video.findById(videoId);
        const curUser = await User.findById(curUserId);

        if (!video || !curUser || !newComment) {
            return res.send(SUCCESS(404, 'video or user or commentText not found'));
        }

        try {

            video.comments.push({
                owner: curUserId,
                comment: newComment,
            });

            const updatedVideo = await video.save();
            await updatedVideo.populate([
                {
                    path: 'comments',
                    populate: {
                        path: 'owner'
                    }
                },
                {
                    path: 'owner'
                }
            ])

            const mappedVideo = mapVideoDetails(updatedVideo, curUserId);
            return res.send(SUCCESS(201, mappedVideo));

        } catch (error) {

            return res.send(ERROR(500, error.message));

        }

    } catch (error) {

        return res.send(ERROR(500, error.message));

    }

};

module.exports = {
    createVideoController,
    getAllVideocontroller,
    addViewController,
    videoLikeController,
    videoDislikeController,
    addCommentController,
};
