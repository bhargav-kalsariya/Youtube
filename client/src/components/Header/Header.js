import React from 'react';
import './Header.scss';
import { useSelector } from 'react-redux';
import { RiVideoAddLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'

function Header() {

    const navigate = useNavigate();

    return (
        <header className='header-wrapper'>
            <div className="logo">MyTube</div>
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button>S</button>
            </div>
            <div className="user-actions">
                <div className="create-videos-icon" onClick={() => navigate('/create-video')}>
                    <RiVideoAddLine />
                </div>
                <div className="user-avatar">
                    <img src='' alt="User Avatar" />
                </div>
            </div>
        </header>
    );
}

export default Header;
