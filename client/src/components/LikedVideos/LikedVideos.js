import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../VideoCard/VideoCard';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import { getMyProfile } from '../../redux/slices/userSlice';
import { FaHeart } from 'react-icons/fa';
import './LikedVideos.scss';
import { useSidebar } from '../../context/SidebarContext';
import { useMyProfile } from '../../hooks/useMyProfile';

function LikedVideos() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSidebarOpen } = useSidebar();

    const myProfile = useMyProfile();
    const likedVideos = myProfile?.data?.mappedLikedvideos;

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    if (!myProfile) return <div>Loading...</div>;

    return (
        <div className="liked-videos-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="liked-content">
                    <div className="liked-header">
                        <div className="liked-icon">
                            <FaHeart />
                        </div>
                        <h1>Liked Videos</h1>
                        <p>{likedVideos?.length || 0} videos liked</p>
                    </div>

                    {likedVideos && likedVideos.length > 0 ? (
                        <div className="liked-videos-grid">
                            {likedVideos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-liked-videos">
                            <div className="no-liked-icon">
                                <FaHeart />
                            </div>
                            <h2>No liked videos</h2>
                            <p>Videos you like will appear here</p>
                            <button
                                className="start-watching-btn"
                                onClick={() => navigate('/')}
                            >
                                Start Watching
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LikedVideos;
