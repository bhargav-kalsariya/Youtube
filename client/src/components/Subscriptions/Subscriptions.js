import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Subscriptions.scss';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../redux/slices/userSlice';
import { FaHome } from 'react-icons/fa';

function Subscriptions() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfile = useSelector((state) => state.userReducer.myProfile);
    const subscriptions = myProfile?.data?.subscriptions;

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="subscriptions-page">
            <button className="back-to-home-btn" onClick={handleBackToHome}>
                <FaHome /> Back to Home
            </button>
            <h1 className="page-title">Subscriptions</h1>
            <div className="subscriptions-list">
                {subscriptions?.map((subscription) => (
                    <div key={subscription._id} className="subscription-item"
                        onClick={() => navigate(`/profile/${subscription._id}`)}>
                        <img
                            src={subscription.profilePictureURL.url}
                            alt={subscription.channleName}
                            className="channel-avatar"
                        />
                        <div className="subscription-info">
                            <h3 className="channel-name">{subscription.channleName}</h3>
                            <p className="subscriber-count">{subscription.subscribers.length} Subscribers</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
