import React, { useEffect } from 'react';
import VideoGrid from '../../components/VideoGrid/VideoGrid';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import './Home.scss';
import { getAllVideos } from '../../redux/slices/feedSlice';
import { getMyProfile } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

function Home() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllVideos());
        dispatch(getMyProfile());
    }, [dispatch])

    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <SideBar />
                <VideoGrid />
            </div>
        </div>
    );
}

export default Home;
