import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoGrid from '../../components/VideoGrid/VideoGrid';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import { getWatchHistory, clearWatchHistory } from '../../redux/slices/userSlice';
import { FaHistory, FaTrash, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './WatchHistory.scss';
import { useSidebar } from '../../context/SidebarContext';
import VideoCard from '../../components/VideoCard/VideoCard';

function WatchHistory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { watchHistory, loading } = useSelector((state) => state.userReducer);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const { isSidebarOpen } = useSidebar();

    useEffect(() => {
        dispatch(getWatchHistory(100));
    }, [dispatch]);

    const handleClearHistory = async () => {
        try {
            await dispatch(clearWatchHistory()).unwrap();
            setShowClearConfirm(false);
        } catch (error) {
            console.error('Failed to clear watch history:', error);
        }
    };

    return (
        <div className="watch-history-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="history-content">
                    <div className="history-header">
                        <div className="history-icon">
                            <FaHistory />
                        </div>
                        <div className="history-info">
                            <h1>Watch History</h1>
                            <p>{watchHistory.length} videos watched</p>
                        </div>
                        <div className="history-actions">
                            <button
                                className="clear-history-btn"
                                onClick={() => setShowClearConfirm(true)}
                                disabled={watchHistory.length === 0}
                            >
                                <FaTrash /> Clear History
                            </button>
                            <button
                                className="back-home-btn"
                                onClick={() => navigate('/')}
                            >
                                <FaHome /> Back to Home
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <p>Loading watch history...</p>
                        </div>
                    ) : watchHistory.length > 0 ? (
                        <div className="history-videos">
                            {watchHistory.map((entry) => (
                                <VideoCard key={entry.video?._id || entry._id} video={entry.video?._id ? entry.video : entry} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-history">
                            <div className="no-history-icon">
                                <FaHistory />
                            </div>
                            <h2>No watch history</h2>
                            <p>Videos you watch will appear here</p>
                            <button
                                className="start-watching-btn"
                                onClick={() => navigate('/')}
                            >
                                Start Watching
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showClearConfirm && (
                <div className="clear-confirm-modal">
                    <div className="modal-content">
                        <h3>Clear Watch History?</h3>
                        <p>This will permanently delete your watch history. This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={handleClearHistory}
                            >
                                Clear History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WatchHistory; 