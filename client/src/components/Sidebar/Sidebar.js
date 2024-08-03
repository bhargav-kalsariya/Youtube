import React from 'react';
import { FaHome, FaFire, FaRegFileVideo, FaHistory, FaThumbsUp, FaCog } from 'react-icons/fa';
import './SideBar.scss';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div onClick={() => navigate('/')} className="nav-item">
                <FaHome />
                <span>Home</span>
            </div>
            <div onClick={() => navigate('/trending')} className="nav-item">
                <FaFire />
                <span>Trending</span>
            </div>
            <div onClick={() => navigate('/subscription')} className="nav-item">
                <FaRegFileVideo />
                <span>Subscriptions</span>
            </div>
            <div onClick={() => navigate('/library')} className="nav-item">
                <FaHistory />
                <span>Library</span>
            </div>
            <div onClick={() => navigate('/liked')} className="nav-item">
                <FaThumbsUp />
                <span>Liked Videos</span>
            </div>
            <div onClick={() => navigate('/settings')} className="nav-item">
                <FaCog />
                <span>Settings</span>
            </div>
        </div>
    );
};

export default SideBar;
