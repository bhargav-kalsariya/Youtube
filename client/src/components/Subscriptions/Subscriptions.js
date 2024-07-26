import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions } from '../../redux/slices/userSlice'; // Adjust the import path as needed
import './Subscriptions.scss';
import { FaBell } from 'react-icons/fa';

function Subscriptions() {
    const dispatch = useDispatch();
    const myProfile = useSelector((state) => state.userReducer.myProfile);

    console.log({ myProfile });

    return (
        // <div className="subscriptions-page">
        //     <h1 className="page-title">Subscriptions</h1>
        //     <div className="subscriptions-list">
        //         {subscriptions?.map((subscription) => (
        //             <div key={subscription.id} className="subscription-item">
        //                 <img
        //                     src={subscription.profilePictureURL || dummyImg}
        //                     alt={subscription.channelName}
        //                     className="channel-avatar"
        //                 />
        //                 <div className="channel-info">
        //                     <h2 className="channel-name">{subscription.channelName}</h2>
        //                     <button className="notification-btn">
        //                         <FaBell /> Notifications
        //                     </button>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        "hi"
    );
}

export default Subscriptions;
