const cloudinary = require('cloudinary').v2;
const { ERROR, SUCCESS } = require('../Utilities/ResponseWrapper');
const Video = require('../Models/Video');
const User = require('../Models/User');

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
        console.error('Error uploading video:', error);
        return res.status(500).send(ERROR(500, error.message));
    }
};

module.exports = { createVideoController };
