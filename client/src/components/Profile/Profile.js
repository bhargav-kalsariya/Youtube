import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../redux/slices/userSlice'; // Adjust the import path as needed
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

    console.log({ myProfile });

    return (
        <div className="profile-page">
            <div className="profile-header-buttons">
                <button className="back-to-home-btn" onClick={() => navigate('/')}>
                    <FaHome /> Back to Home
                </button>
                <button className="update-profile-btn" onClick={() => navigate(`/updateProfile`)}>
                    <AiOutlineEdit /> Update Profile
                </button>
            </div>
            <header className="profile-header">
                <div className="cover-photo"></div>
                <div className="user-info">
                    <img
                        src={myProfile?.data ? myProfile?.data?.profilePictureURL?.url : dummyImg}
                        alt="User Avatar" className="user-avatar" />
                    <div className="user-details">
                        <h1 className="user-name">{myProfile?.data?.channleName}</h1>
                        <p className="user-subscribers">{myProfile?.data?.subscribers.length} subscribers</p>
                    </div>
                </div>
            </header>
            <section className="user-statistics">
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
            {/* <section className="user-videos">
                <h2>Uploads</h2>
                <VideoGrid videos={myProfile.videos} />
            </section> */}
        </div>
    );
}

export default Profile;
