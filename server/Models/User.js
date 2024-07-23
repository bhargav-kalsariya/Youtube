const mongoose = require('mongoose');

const user = mongoose.Schema({

    channleName: {
        type: String,
        required: true,
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
        publicId: String,
        url: String,
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