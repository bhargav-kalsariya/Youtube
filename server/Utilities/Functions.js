const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const timeAgo = require('time-ago');

dotenv.config();

const GenerateAccessToken = (IdToCreateToken) => {

    const AccessToken = jwt.sign(IdToCreateToken, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: '1d'
    });
    return AccessToken;

}

const GenerateRefreshToken = (IdToCreateToken) => {

    const RefreshToken = jwt.sign(IdToCreateToken, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: '1y'
    });
    return RefreshToken;

}

const mapVideoDetails = (video, userId) => {

    return {
        _id: video._id,
        title: video.title,
        description: video.description,
        video: video.video,
        owner: {
            _id: video.owner._id,
            channleName: video.owner.channleName,
            avatar: video.owner.profilePictureURL,
            subscribers: video.owner.subscribers.length,
            isSubscribed: video.owner.subscribers.includes(userId),
            isMyVideo: video.owner._id == userId
        },
        isLiked: video.likes.includes(userId),
        isDisliked: video.dislikes.includes(userId),
        likesCount: video.likes.length,
        dislikesCount: video.dislikes.length,
        viewsCount: video.views,
        timeAgo: timeAgo.ago(video.createdAt)
    }

};

module.exports = { GenerateAccessToken, GenerateRefreshToken, mapVideoDetails };