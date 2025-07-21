import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import './Subscriptions.scss';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../redux/slices/userSlice';
import { FaUsers, FaUser } from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';
import { useMyProfile } from '../../hooks/useMyProfile';

function Subscriptions() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfile = useMyProfile();
    const subscriptions = myProfile?.data?.subscriptions;
    const { isSidebarOpen } = useSidebar();

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    return (
        <div className="subscriptions-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="subscriptions-content">
                    <div className="subscriptions-header">
                        <div className="subscriptions-icon">
                            <FaUsers />
                        </div>
                        <h1>Subscriptions</h1>
                        <p>{subscriptions?.length || 0} channels subscribed</p>
                    </div>

                    {subscriptions && subscriptions.length > 0 ? (
                        <div className="subscriptions-list">
                            {subscriptions.map((subscription) => (
                                <div
                                    key={subscription._id}
                                    className="subscription-item"
                                    onClick={() => navigate(`/profile/${subscription._id}`)}
                                >
                                    <img
                                        src={subscription.profilePictureURL?.url || '/default-avatar.png'}
                                        alt={subscription.channleName}
                                        className="channel-avatar"
                                        onError={(e) => {
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                    <div className="subscription-info">
                                        <h3 className="channel-name">{subscription.channleName}</h3>
                                        <p className="subscriber-count">{subscription.subscribers?.length || 0} Subscribers</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-subscriptions">
                            <div className="no-subscriptions-icon">
                                <FaUser />
                            </div>
                            <h2>No subscriptions</h2>
                            <p>Channels you subscribe to will appear here</p>
                            <button
                                className="start-exploring-btn"
                                onClick={() => navigate('/')}
                            >
                                Start Exploring
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Subscriptions;
