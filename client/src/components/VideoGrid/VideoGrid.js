import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoCard from '../VideoCard/VideoCard';
import './VideoGrid.scss';
import { getAllVideos } from '../../redux/slices/videoSlice';

const VideoGrid = () => {
    const dispatch = useDispatch();
    const { videos, status, error } = useSelector((state) => state.videoReducer);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getAllVideos());
        }
    }, [status, dispatch]);

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
