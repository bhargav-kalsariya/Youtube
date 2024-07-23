import React from 'react';
import { useSelector } from 'react-redux';
import VideoCard from '../VideoCard/VideoCard';
import './VideoGrid.scss';

const VideoGrid = () => {
    const { videos, status, error } = useSelector((state) => state.videoReducer);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>{error}</div>;
    }

    return (
        <div className="video-grid">
            {videos && videos.length > 0 ? (
                videos.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))
            ) : (
                <p>No videos available</p>
            )}
        </div>
    );
};

export default VideoGrid;
