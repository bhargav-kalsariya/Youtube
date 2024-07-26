import React from 'react';
import { FaHome, FaFire, FaRegFileVideo, FaHistory, FaThumbsUp, FaCog } from 'react-icons/fa';
import './SideBar.scss';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {

    const naviagte = useNavigate();

    return (
        <div className="sidebar">
            <div exact activeClassName="active">
                <FaHome />
                <span>Home</span>
            </div>
            <div activeClassName="active">
                <FaFire />
                <span>Trending</span>
            </div>
            <div onClick={() => naviagte('/subscription')} activeClassName="active">
                <FaRegFileVideo />
                <span>Subscriptions</span>
            </div>
            <div activeClassName="active">
                <FaHistory />
                <span>Library</span>
            </div>
            <div activeClassName="active">
                <FaThumbsUp />
                <span>Liked Videos</span>
            </div>
            <div activeClassName="active">
                <FaCog />
                <span>Settings</span>
            </div>
        </div>
    );
};

export default SideBar;
