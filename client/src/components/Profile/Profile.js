import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../redux/slices/userSlice';
import './Profile.scss';
import dummyImg from '../../assets/user.png';
import { FaHome } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useSelector((state) => state.userReducer.myProfile);

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleUpdateProfile = () => {
        navigate('/updateProfile');
    };

    return (
        <div className="profile-page">
            <button className="back-to-home-btn" onClick={handleBackToHome}>
                <FaHome /> Back to Home
            </button>
            <button className="update-profile-btn" onClick={handleUpdateProfile}>
                <AiOutlineEdit /> Update Profile
            </button>
            <header className="profile-header">
                <div className="cover-photo"></div>
                <div className="profile-info-container">
                    <img
                        src={myProfile?.data ? myProfile?.data?.profilePictureURL?.url : dummyImg}
                        alt="User Avatar" className="user-avatar" />
                    <div className="profile-details">
                        <h1 className="profile-name">{myProfile?.data?.channleName}</h1>
                        <p className="profile-subscribers">{myProfile?.data?.subscribers.length} subscribers</p>
                        <div className="profile-actions">
                            <button className="subscribe-btn">Subscribe</button>
                            <button className="join-btn">Join</button>
                        </div>
                        <div className="profile-links">
                            <a href={myProfile?.data?.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>
            </header>
            <section className="profile-statistics">
                <div className="statistic">
                    <span className="statistic-value">{myProfile?.data?.videos.length} </span>
                    <span className="statistic-label">Videos</span>
                </div>
                <div className="statistic">
                    <span className="statistic-value">{myProfile?.data?.viewsCount}</span>
                    <span className="statistic-label">Views</span>
                </div>
                <div className="statistic">
                    <span className="statistic-value">{myProfile?.likesCount}</span>
                    <span className="statistic-label">Likes</span>
                </div>
            </section>
        </div>
    );
}

export default Profile;
