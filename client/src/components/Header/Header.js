import React from 'react';
import './Header.scss';
import { useSelector } from 'react-redux';

function Header() {

    const myProfile = useSelector(state => state.userReducer?.myProfile);

    console.log({ myProfile });

    return (
        <header>
            <div className="logo">MyTube</div>
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button>Search</button>
            </div>
            <div className="user-profile">
                <img src="user-avatar.png" alt="User Avatar" />
            </div>
        </header>
    );
}

export default Header;
