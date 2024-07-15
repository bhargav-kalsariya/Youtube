import React, { useEffect, useState } from 'react';
import './Header.scss';
import { axiosClient } from '../../utilities/axiosClient';

function Header() {

    const [myProfile, setMyProfile] = useState({});

    async function getMyProfile() {

        const myProfile = await axiosClient.get('/user/profile');
        setMyProfile(myProfile);

    }

    console.log({ myProfile });

    useEffect(() => {
        getMyProfile();
    }, []);


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
