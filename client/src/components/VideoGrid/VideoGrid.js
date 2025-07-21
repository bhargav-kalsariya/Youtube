import React from 'react';
import { useSelector } from 'react-redux';
import VideoCard from '../VideoCard/VideoCard';
import './VideoGrid.scss';

const VideoGrid = ({ videos: propVideos }) => {
    const { videos: storeVideos } = useSelector((state) => state.feedReducer);

    // Use prop videos if provided, otherwise use store videos
    const videosToDisplay = propVideos || storeVideos;

    return (
        <div className="video-grid">
            {videosToDisplay && videosToDisplay.length > 0 ? (
                videosToDisplay.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))
            ) : (
                <p>No videos available</p>
            )}
        </div>
    );
};

export default VideoGrid;
