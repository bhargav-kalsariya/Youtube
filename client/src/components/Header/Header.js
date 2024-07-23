import React from 'react';
import { RiVideoAddLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import './Header.scss';
import { CiSearch } from "react-icons/ci";
import userImg from '../../assets/user.png';
import { useSelector } from 'react-redux';

function Header() {
    const navigate = useNavigate();
    const myProfile = useSelector((state) => state.userReducer.myProfile);

    console.log({ myProfile });

    return (
        <header className='header-wrapper'>
            <div className="logo">MyTube</div>
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button>
                    <CiSearch />
                </button>
            </div>
            <div className="user-actions">
                <div className="create-videos-icon" onClick={() => navigate('/create-video')}>
                    <RiVideoAddLine />
                </div>
                <div className="user-avatar" onClick={() => navigate(`/profile/${myProfile?.data._id}`)}>
                    <img
                        src={myProfile?.data?.profilePictureURL?.url ? myProfile?.data?.profilePictureURL?.url : userImg}
                        alt="User Avatar" />
                </div>
            </div>
        </header>
    );
}

export default Header;
