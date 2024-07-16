import React from 'react';
import './Header.scss';
import { useSelector } from 'react-redux';

function Header() {

    const myProfile = useSelector(state => state.userReducer?.myProfile);
    const img = 'https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0'
    console.log({ myProfile });

    return (
        <header className='header-wrapper'>
            <div className="logo">MyTube</div>
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button>S</button>
            </div>
            <div className="user-profile">
                <img src={img} alt="User Avatar" />
            </div>
        </header>
    );
}

export default Header;
