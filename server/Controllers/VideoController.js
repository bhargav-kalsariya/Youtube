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

        return res.send(SUCCESS(201, 'video created successfully'));

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

        // Only increment views and add to viewedBy if not already present
        if (!video.viewedBy.includes(curUserId)) {
            video.views += 1;
            video.viewedBy.push(curUserId);
        }

        // Remove the video from history if it exists
        curUser.watchHistory = curUser.watchHistory.filter(
            entry => entry.video.toString() !== videoId
        );

        // Add to the front
        curUser.watchHistory.unshift({
            video: videoId,
            watchedAt: new Date()
        });

        // Keep only last 100 videos in history
        if (curUser.watchHistory.length > 100) {
            curUser.watchHistory = curUser.watchHistory.slice(0, 100);
        }

        await video.save();
        await curUser.save();
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

        // Populate and return updated video
        await video.populate([
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

        const mappedVideo = mapVideoDetails(video, curUserId);
        return res.send(SUCCESS(200, mappedVideo));

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

        // Populate and return updated video
        await video.populate([
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

        const mappedVideo = mapVideoDetails(video, curUserId);
        return res.send(SUCCESS(200, mappedVideo));

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

        if (!video || !curUser) {
            return res.send(ERROR(404, 'Video or user not found'));
        }

        // Validate comment is not empty or just whitespace
        if (!newComment || !newComment.trim()) {
            return res.send(ERROR(400, 'Comment cannot be empty'));
        }

        // Limit comment length (optional)
        if (newComment.trim().length > 1000) {
            return res.send(ERROR(400, 'Comment is too long (max 1000 characters)'));
        }

        try {

            video.comments.push({
                owner: curUserId,
                comment: newComment.trim(), // Trim whitespace
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

const searchVideosController = async (req, res) => {
    try {
        const { query, sortBy = 'relevance', duration, date } = req.query;
        const curUserId = req._id;

        if (!query) {
            return res.send(ERROR(400, 'Search query is required'));
        }

        // Build search filter
        let searchFilter = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        // Add duration filter (commented out since Video model doesn't have duration field)
        // if (duration) {
        //     switch (duration) {
        //         case 'short':
        //             searchFilter.duration = { $lte: 240 }; // 4 minutes
        //             break;
        //         case 'medium':
        //             searchFilter.duration = { $gt: 240, $lte: 1200 }; // 4-20 minutes
        //             break;
        //         case 'long':
        //             searchFilter.duration = { $gt: 1200 }; // 20+ minutes
        //             break;
        //     }
        // }

        // Add date filter
        if (date) {
            const now = new Date();
            switch (date) {
                case 'hour':
                    searchFilter.createdAt = { $gte: new Date(now.getTime() - 60 * 60 * 1000) };
                    break;
                case 'today':
                    searchFilter.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
                    break;
                case 'week':
                    searchFilter.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
                    break;
                case 'month':
                    searchFilter.createdAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
                    break;
                case 'year':
                    searchFilter.createdAt = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
                    break;
            }
        }

        // Build sort options
        let sortOptions = {};
        switch (sortBy) {
            case 'date':
                sortOptions.createdAt = -1;
                break;
            case 'views':
                sortOptions.views = -1;
                break;
            case 'rating':
                // For rating, we'll sort by date as a fallback since likes array sorting is complex
                sortOptions.createdAt = -1;
                break;
            default: // relevance - sort by date (most recent first)
                sortOptions.createdAt = -1;
                break;
        }

        const videos = await Video.find(searchFilter)
            .populate([
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
            .sort(sortOptions)
            .limit(50);

        const mappedVideoDetails = videos.map(video => mapVideoDetails(video, curUserId));

        return res.send(SUCCESS(200, mappedVideoDetails));

    } catch (error) {
        console.error('Error in searchVideosController:', error);
        return res.send(ERROR(500, error.message));
    }
};

const getVideoByIdController = async (req, res) => {
    try {
        const { videoId } = req.params;
        const curUserId = req._id;

        const video = await Video.findById(videoId).populate([
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

        if (!video) {
            return res.send(ERROR(404, 'Video not found'));
        }

        const mappedVideo = mapVideoDetails(video, curUserId);
        return res.send(SUCCESS(200, mappedVideo));

    } catch (error) {
        console.error('Error in getVideoByIdController:', error);
        return res.send(ERROR(500, error.message));
    }
};

const deleteVideoController = async (req, res) => {
    try {
        const { videoId } = req.params;
        const curUserId = req._id;

        const video = await Video.findById(videoId);
        const curUser = await User.findById(curUserId);

        if (!video) {
            return res.send(ERROR(404, 'Video not found'));
        }

        if (video.owner.toString() !== curUserId) {
            return res.send(ERROR(403, 'You can only delete your own videos'));
        }

        // Delete from Cloudinary
        if (video.video.publicId) {
            await cloudinary.uploader.destroy(video.video.publicId, { resource_type: 'video' });
        }

        // Remove video from user's videos array
        curUser.videos.pull(videoId);
        await curUser.save();

        // Delete video from database
        await Video.findByIdAndDelete(videoId);

        return res.send(SUCCESS(200, 'Video deleted successfully'));

    } catch (error) {
        console.error('Error in deleteVideoController:', error);
        return res.send(ERROR(500, error.message));
    }
};

const updateVideoController = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;
        const curUserId = req._id;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.send(ERROR(404, 'Video not found'));
        }

        if (video.owner.toString() !== curUserId) {
            return res.send(ERROR(403, 'You can only update your own videos'));
        }

        if (title) video.title = title;
        if (description) video.description = description;

        await video.save();

        const updatedVideo = await Video.findById(videoId).populate([
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

        const mappedVideo = mapVideoDetails(updatedVideo, curUserId);
        return res.send(SUCCESS(200, mappedVideo));

    } catch (error) {
        console.error('Error in updateVideoController:', error);
        return res.send(ERROR(500, error.message));
    }
};

const getTrendingVideosController = async (req, res) => {
    try {
        const curUserId = req._id;
        const { limit = 20 } = req.query;

        // Get videos from last 7 days with high engagement
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const videos = await Video.find({
            createdAt: { $gte: oneWeekAgo }
        })
            .populate([
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
            .sort({ views: -1 }) // Only sort by scalar field
            .limit(parseInt(limit));

        // Now sort by likesCount, comments.length, then viewsCount in JS
        const mappedVideoDetails = videos
            .map(video => mapVideoDetails(video, curUserId))
            .sort((a, b) => {
                if (b.likesCount !== a.likesCount) return b.likesCount - a.likesCount;
                if (b.comments.length !== a.comments.length) return b.comments.length - a.comments.length;
                return b.viewsCount - a.viewsCount;
            });

        return res.send(SUCCESS(200, mappedVideoDetails));

    } catch (error) {
        console.error('Error in getTrendingVideosController:', error);
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
    searchVideosController,
    getVideoByIdController,
    deleteVideoController,
    updateVideoController,
    getTrendingVideosController,
};
