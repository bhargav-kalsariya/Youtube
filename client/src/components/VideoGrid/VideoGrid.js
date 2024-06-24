import React from 'react';
import VideoCard from '../VideoCard/VideoCard';
import './VideoGrid.scss';

function VideoGrid() {
    return (
        <section className="video-grid">
            <VideoCard title="Video Title 1" channel="Channel Name" views="1M views" date="1 day ago" thumbnail="thumbnail1.jpg" />
            <VideoCard title="Video Title 1" channel="Channel Name" views="1M views" date="1 day ago" thumbnail="thumbnail1.jpg" />
            <VideoCard title="Video Title 1" channel="Channel Name" views="1M views" date="1 day ago" thumbnail="thumbnail1.jpg" />
            <VideoCard title="Video Title 1" channel="Channel Name" views="1M views" date="1 day ago" thumbnail="thumbnail1.jpg" />
            <VideoCard title="Video Title 1" channel="Channel Name" views="1M views" date="1 day ago" thumbnail="thumbnail1.jpg" />

        </section>
    );
}

export default VideoGrid;
