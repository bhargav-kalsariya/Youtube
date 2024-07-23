import React from 'react';
import './VideoCard.scss';
import dummyImg from '../../assets/user.png';

const VideoCard = ({ video }) => {
    return (
        <div className="video-card">
            <div className="video-container">
                <video width="100%" height="auto" controls>
                    <source src={video.video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="video-info">
                <div className="owner-avatar">
                    <img src={video.owner.avatar.url ? video.owner.avatar.url : dummyImg} alt='avatar' />
                </div>
                <div className="video-details">
                    <h3 className="title">{video.title}</h3>
                    <p className="owner-name">{video.owner.channleName}</p>
                    <p className="views-time">{video.viewsCount} views • {video.timeAgo}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
