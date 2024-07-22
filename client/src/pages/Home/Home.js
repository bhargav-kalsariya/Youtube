import React from 'react';
import VideoGrid from '../../components/VideoGrid/VideoGrid';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';

import './Home.scss';

function Home() {
    return (
        <div className="home">
            <Header />
            <div className="content">
                <SideBar />
                <VideoGrid />
            </div>
        </div>
    );
}

export default Home;
