import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../VideoCard/VideoCard';
import { getMyProfile } from '../../redux/slices/userSlice';
import './LikedVideos.scss';

function LikedVideos() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const myProfile = useSelector(state => state.userReducer.myProfile);
    const likedVideos = myProfile?.data?.mappedLikedvideos;

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    return (
        <div className="liked-videos-page">
            <div className="back-to-home">
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
            <h2 className='title'>Liked Videos</h2>
            {likedVideos.length > 0 ? <div className="video-grid">
                {likedVideos?.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div> : <h3 className='warn-notice'>You haven't liked any video</h3>}
        </div>
    );
}

export default LikedVideos;
