import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoGrid from '../../components/VideoGrid/VideoGrid';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import { getTrendingVideos } from '../../redux/slices/feedSlice';
import { FaFire } from 'react-icons/fa';
import './Trending.scss';
import { useSidebar } from '../../context/SidebarContext';

function Trending() {
    const dispatch = useDispatch();
    const { trendingVideos, loading } = useSelector((state) => state.feedReducer);
    const { isSidebarOpen } = useSidebar();

    useEffect(() => {
        dispatch(getTrendingVideos(50));
    }, [dispatch]);

    return (
        <div className="trending-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="trending-content">
                    <div className="trending-header">
                        <div className="trending-icon">
                            <FaFire />
                        </div>
                        <h1>Trending Videos</h1>
                        <p>Most popular videos in the last 7 days</p>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <p>Loading trending videos...</p>
                        </div>
                    ) : trendingVideos.length > 0 ? (
                        <div className="trending-videos">
                            <VideoGrid videos={trendingVideos} />
                        </div>
                    ) : (
                        <div className="no-trending">
                            <div className="no-trending-icon">
                                <FaFire />
                            </div>
                            <h2>No trending videos</h2>
                            <p>Check back later for the latest trending content</p>
                            <button className="refresh-btn" onClick={() => dispatch(getTrendingVideos(50))}>
                                Refresh Trending
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Trending; 