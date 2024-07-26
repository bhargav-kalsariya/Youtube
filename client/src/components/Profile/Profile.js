import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProfile } from '../../redux/slices/userSlice';
import './Profile.scss';
import dummyImg from '../../assets/user.png';
import { FaHome } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { getUserProfile } from '../../redux/slices/videoSlice';
import { subscribe_unsubscribe } from '../../redux/slices/feedSlice';

function Profile() {

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useSelector((state) => state.userReducer.myProfile);
    const userProfile = useSelector((state) => state.videoReducer.userProfile);
    const feedData = useSelector((state) => state.feedReducer.feedData);

    const [isMyProfile, setMyProfile] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    console.log({ feedData });

    useEffect(() => {

        dispatch(getUserProfile({
            userId: params.userId,
        }));

        setIsSubscribed(feedData?.data?.subscribers?.includes(myProfile?.data?._id));
        setMyProfile(myProfile?.data._id === params.userId);

    }, [dispatch, myProfile, feedData, params.userId]);

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleUpdateProfile = () => {
        navigate('/updateProfile');
    };

    function handleSubscribe() {
        dispatch(subscribe_unsubscribe({
            userId: params.userId,
        }));
    }

    return (
        <div className="profile-page">
            <button className="back-to-home-btn" onClick={handleBackToHome}>
                <FaHome /> Back to Home
            </button>
            {isMyProfile && <button className="update-profile-btn" onClick={handleUpdateProfile}>
                <AiOutlineEdit /> Update Profile
            </button>}
            <header className="profile-header">
                <div className="cover-photo"></div>
                <div className="profile-info-container">
                    <img
                        src={userProfile?.data ? userProfile?.data?.profilePictureURL?.url : dummyImg}
                        alt="User Avatar" className="user-avatar" />
                    <div className="profile-details">
                        <h1 className="profile-name">{userProfile?.data?.channleName}</h1>
                        <p className="profile-subscribers">{userProfile?.data?.subscribers.length} subscribers</p>
                        {!isMyProfile && <div className="profile-actions">
                            <button className="subscribe-btn" onClick={handleSubscribe}>
                                {isSubscribed ? 'UnSubscribe' : 'Subscribe'}
                            </button>
                            <button className="join-btn">Join</button>
                        </div>}
                        <div className="profile-links">
                            <a href={userProfile?.data?.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>
            </header>
            <section className="profile-statistics">
                <div className="statistic">
                    <span className="statistic-value">{userProfile?.data?.videos.length} </span>
                    <span className="statistic-label">Videos</span>
                </div>
                <div className="statistic">
                    <span className="statistic-value">{userProfile?.data?.viewsCount}</span>
                    <span className="statistic-label">Views</span>
                </div>
                <div className="statistic">
                    <span className="statistic-value">{userProfile?.likesCount}</span>
                    <span className="statistic-label">Likes</span>
                </div>
            </section>
        </div>
    );
}

export default Profile;
