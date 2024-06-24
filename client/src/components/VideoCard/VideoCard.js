import React from 'react';
import './VideoCard.scss';

function VideoCard({ title, channel, views, date, thumbnail }) {
    return (
        <div className="video-card">
            <img src={thumbnail} alt="Video Thumbnail" />
            <div className="video-info">
                <h3>{title}</h3>
                <p>{channel}</p>
                <p>{views} • {date}</p>
            </div>
        </div>
    );
}

export default VideoCard;
