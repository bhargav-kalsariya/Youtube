import React, { useState, useEffect, useRef } from 'react';
import { RiVideoAddLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import './Header.scss';
import { CiSearch } from "react-icons/ci";
import { FaBars, FaHistory, FaUser, FaCog, FaSignOutAlt, FaMicrophone } from "react-icons/fa";
import userImg from '../../assets/user.png';
import { useSelector, useDispatch } from 'react-redux';
import { searchVideos, clearSearchResults } from '../../redux/slices/feedSlice';
import { useSidebar } from '../../context/SidebarContext';
import { axiosClient } from '../../utilities/axiosClient';
import { ACCESS_TOKEN_KEY, removeItem } from '../../utilities/localStorage';
import { useMyProfile } from '../../hooks/useMyProfile';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useMyProfile();
    const { toggleSidebar } = useSidebar();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const { searchResults, loading } = useSelector((state) => state.feedReducer);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    // Sample search suggestions (in a real app, these would come from API)
    const sampleSuggestions = [
        'React tutorials',
        'JavaScript tips',
        'Web development',
        'Programming basics',
        'CSS tutorials',
        'Node.js guide',
        'Python programming',
        'Machine learning',
        'Data science',
        'Mobile development'
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            dispatch(searchVideos({ query: searchQuery.trim() }));
            setShowSearchResults(true);
            setSearchSuggestions([]);
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (!value.trim()) {
            dispatch(clearSearchResults());
            setShowSearchResults(false);
            setSearchSuggestions([]);
        } else {
            // Filter suggestions based on input
            const filtered = sampleSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setSearchSuggestions(filtered.slice(0, 5));
        }
    };

    const handleSearchInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSearchSuggestions([]);
        dispatch(searchVideos({ query: suggestion }));
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    };

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            setIsListening(true);

            recognition.onstart = () => {
                console.log('Voice recognition started');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                setIsListening(false);

                // Auto-search after voice input
                dispatch(searchVideos({ query: transcript }));
                navigate(`/search?q=${encodeURIComponent(transcript)}`);
            };

            recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            alert('Voice recognition is not supported in this browser.');
        }
    };

    const handleLogout = async () => {
        try {
            await axiosClient.post('/auth/logout');
            removeItem(ACCESS_TOKEN_KEY);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Close search suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchSuggestions([]);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Clear search results when navigating away
        const handleRouteChange = () => {
            setShowSearchResults(false);
            setSearchQuery('');
            dispatch(clearSearchResults());
            setSearchSuggestions([]);
        };

        return () => {
            handleRouteChange();
        };
    }, [dispatch]);

    return (
        <header className='header-wrapper'>
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <div className="logo" onClick={() => navigate('/')}>MyTube</div>
            </div>

            <div className="search-container" ref={searchRef}>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyPress={handleSearchInputKeyPress}
                    />
                    <button type="submit" disabled={loading}>
                        <CiSearch />
                    </button>
                </form>

                <button
                    className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                    onClick={handleVoiceSearch}
                    title="Voice search"
                >
                    <FaMicrophone />
                </button>

                {searchSuggestions.length > 0 && (
                    <div className="search-suggestions">
                        {searchSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <CiSearch />
                                <span>{suggestion}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="user-actions">
                <div className="create-videos-icon" onClick={() => navigate('/create-video')}>
                    <RiVideoAddLine />
                </div>

                <div className="user-menu" ref={userMenuRef}>
                    <div
                        className="user-avatar"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <img
                            src={myProfile?.data?.profilePictureURL?.url ? myProfile.data.profilePictureURL.url : userImg}
                            alt="User Avatar"
                        />
                    </div>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    if (myProfile && myProfile.data && myProfile.data._id) {
                                        navigate(`/profile/${myProfile.data._id}`);
                                        setShowUserMenu(false);
                                    }
                                }}
                            >
                                <FaUser />
                                <span>Your Channel</span>
                            </div>
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/history');
                                    setShowUserMenu(false);
                                }}
                            >
                                <FaHistory />
                                <span>Watch History</span>
                            </div>
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/settings');
                                    setShowUserMenu(false);
                                }}
                            >
                                <FaCog />
                                <span>Settings</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <div
                                className="dropdown-item"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt />
                                <span>Sign Out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
