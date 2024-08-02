import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoCard from '../VideoCard/VideoCard';
import './VideoGrid.scss';
import { getAllVideos } from '../../redux/slices/feedSlice';

const VideoGrid = () => {

    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.feedReducer);

    useEffect(() => {
        dispatch(getAllVideos());
    }, [dispatch, videos.views]);

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
