import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaFire, FaRegFileVideo, FaHistory, FaThumbsUp, FaCog } from 'react-icons/fa';
import './SideBar.scss';

const SideBar = () => {
    return (
        <div className="sidebar">
            <NavLink to="/" exact activeClassName="active">
                <FaHome />
                <span>Home</span>
            </NavLink>
            <NavLink to="/trending" activeClassName="active">
                <FaFire />
                <span>Trending</span>
            </NavLink>
            <NavLink to="/subscriptions" activeClassName="active">
                <FaRegFileVideo />
                <span>Subscriptions</span>
            </NavLink>
            <NavLink to="/library" activeClassName="active">
                <FaHistory />
                <span>Library</span>
            </NavLink>
            <NavLink to="/liked-videos" activeClassName="active">
                <FaThumbsUp />
                <span>Liked Videos</span>
            </NavLink>
            <NavLink to="/settings" activeClassName="active">
                <FaCog />
                <span>Settings</span>
            </NavLink>
        </div>
    );
};

export default SideBar;
