import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProfile } from '../../redux/slices/userSlice';
import './Profile.scss';
import dummyImg from '../../assets/user.png';
import { FaHome, FaInstagram, FaUserEdit, FaSignOutAlt, FaUserPlus, FaUserCheck, FaVideo, FaEye, FaHeart } from 'react-icons/fa';
import { getUserProfile } from '../../redux/slices/videoSlice';
import { subscribe_unsubscribe } from '../../redux/slices/feedSlice';
import VideoCard from '../VideoCard/VideoCard';
import { ACCESS_TOKEN_KEY, removeItem } from '../../utilities/localStorage';
import { axiosClient } from '../../utilities/axiosClient';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import { useSidebar } from '../../context/SidebarContext';
import { useMyProfile } from '../../hooks/useMyProfile';

function Profile() {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isSidebarOpen } = useSidebar();
    const myProfile = useMyProfile();
    const userProfile = useSelector((state) => state.videoReducer.userProfile);
    const feedData = useSelector((state) => state.feedReducer.feedData);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    let totalViews = 0;
    let totalLikes = 0;
    userProfile?.data?.mappedvideos.forEach((video) => {
        totalViews += video.viewsCount || 0;
        totalLikes += video.likesCount || 0;
    })
    useEffect(() => {
        dispatch(getUserProfile({ userId: params.userId }));
    }, [dispatch, myProfile, feedData, params.userId]);
    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch])
    useEffect(() => {
        if (myProfile?.data && userProfile?.data) {
            setIsSubscribed(userProfile.data.subscribers.includes(myProfile.data._id));
            setIsMyProfile(myProfile.data._id === params.userId);
        }
    }, [dispatch, myProfile, userProfile, feedData, params.userId]);
    function handleSubscribe() {
        dispatch(subscribe_unsubscribe({ userId: params.userId, }));
    }
    const handleBackToHome = () => { navigate('/'); };
    const handleUpdateProfile = () => { navigate('/updateProfile'); };
    async function handleLogoutProfile() {
        const response = await axiosClient.get('/auth/logout');
        if (response.data.status === 'success') {
            removeItem(ACCESS_TOKEN_KEY);
            navigate('/login');
        }
    }
    return (
        <>
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="profile-content" style={{ width: '100%' }}>
                    <div className="profile-page-modern">
                        <div className="profile-header-modern">
                            <div className="cover-photo-modern" />
                            <div className="profile-info-card">
                                <button className="back-to-home-btn-modern" onClick={handleBackToHome} title="Back to Home">
                                    <FaHome />
                                </button>
                                <div className="avatar-actions-row">
                                    <img
                                        src={userProfile?.data ? userProfile.data.profilePictureURL?.url : dummyImg}
                                        alt="User Avatar" className="user-avatar-modern" />
                                    <div className="profile-actions-group">
                                        {isMyProfile && <button className="update-profile-btn-modern" onClick={handleUpdateProfile} title="Edit Profile">
                                            <FaUserEdit />
                                        </button>}
                                        {isMyProfile && <button className="logout-btn-modern" onClick={handleLogoutProfile} title="Logout">
                                            <FaSignOutAlt />
                                        </button>}
                                        {!isMyProfile && <button className="subscribe-btn-modern" onClick={handleSubscribe} title={isSubscribed ? 'Unsubscribe' : 'Subscribe'}>
                                            {isSubscribed ? <FaUserCheck /> : <FaUserPlus />}
                                        </button>}
                                    </div>
                                </div>
                                <div className="profile-details-modern">
                                    <h1 className="profile-name-modern">{userProfile?.data?.channleName}</h1>
                                    <div className="profile-subscribers-modern">{userProfile?.data?.subscribers.length} subscribers</div>
                                    <div className="profile-socials">
                                        {userProfile?.data?.instagramUrl && (
                                            <a href={userProfile.data.instagramUrl} target="_blank" rel="noopener noreferrer" title="Instagram">
                                                <FaInstagram />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-stats-row">
                                    <div className="profile-stat-pill"><FaVideo /> <span>{userProfile?.data?.mappedvideos.length}</span> <span>Videos</span></div>
                                    <div className="profile-stat-pill"><FaEye /> <span>{totalViews}</span> <span>Views</span></div>
                                    <div className="profile-stat-pill"><FaHeart /> <span>{totalLikes}</span> <span>Likes</span></div>
                                </div>
                            </div>
                        </div>
                        <section className="profile-videos-modern">
                            <h2 className="section-title-modern">Videos</h2>
                            <div className="videos-list-modern">
                                {userProfile?.data?.mappedvideos.length === 0 && (
                                    <div className="no-videos-modern">No videos yet.</div>
                                )}
                                {userProfile?.data?.mappedvideos.map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
