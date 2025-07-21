import React, { useEffect } from 'react';
import VideoGrid from '../../components/VideoGrid/VideoGrid';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import './Home.scss';
import { getAllVideos } from '../../redux/slices/feedSlice';
import { getMyProfile } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useSidebar } from '../../context/SidebarContext';

function Home() {

    const dispatch = useDispatch();
    const { isSidebarOpen } = useSidebar();

    useEffect(() => {
        dispatch(getAllVideos());
        dispatch(getMyProfile());
    }, [dispatch])

    return (
        <div className="app-container">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <VideoGrid />
            </div>
        </div>
    );
}

export default Home;
