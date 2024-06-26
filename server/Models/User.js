const mongoose = require('mongoose');

const user = mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    profilePictureURL: {
        type: String,
        default: ''
    },

    bio: {
        type: String,
        default: ''
    },

    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],

    likedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],

    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {

    timestamps: true,

});

module.exports = mongoose.model('User', user);