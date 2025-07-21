import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import { FaCog, FaUser, FaBell, FaShieldAlt, FaPalette, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utilities/axiosClient';
import { ACCESS_TOKEN_KEY, removeItem } from '../../utilities/localStorage';
import './Settings.scss';
import { useSidebar } from '../../context/SidebarContext';

function Settings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useSelector((state) => state.userReducer.myProfile);
    const { isSidebarOpen } = useSidebar();

    const [activeTab, setActiveTab] = useState('account');
    const [settings, setSettings] = useState({
        notifications: true,
        autoplay: true,
        darkMode: true,
        language: 'English'
    });

    const handleSettingChange = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
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

    const renderAccountSettings = () => (
        <div className="settings-section">
            <h3>Account Information</h3>
            <div className="setting-item">
                <label>Channel Name</label>
                <span>{myProfile?.data?.channleName}</span>
            </div>
            <div className="setting-item">
                <label>Email</label>
                <span>{myProfile?.data?.email}</span>
            </div>
            <div className="setting-item">
                <label>Bio</label>
                <span>{myProfile?.data?.bio || 'No bio added'}</span>
            </div>
            <button
                className="edit-profile-btn"
                onClick={() => navigate('/updateProfile')}
            >
                Edit Profile
            </button>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="settings-section">
            <h3>Notifications</h3>
            <div className="setting-item">
                <label>Email Notifications</label>
                <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
            </div>
            <div className="setting-item">
                <label>Push Notifications</label>
                <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
            </div>
        </div>
    );

    const renderPlaybackSettings = () => (
        <div className="settings-section">
            <h3>Playback</h3>
            <div className="setting-item">
                <label>Autoplay Videos</label>
                <input
                    type="checkbox"
                    checked={settings.autoplay}
                    onChange={(e) => handleSettingChange('autoplay', e.target.checked)}
                />
            </div>
            <div className="setting-item">
                <label>Language</label>
                <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                </select>
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="settings-section">
            <h3>Appearance</h3>
            <div className="setting-item">
                <label>Dark Mode</label>
                <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                />
            </div>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="settings-section">
            <h3>Privacy & Security</h3>
            <div className="setting-item">
                <label>Public Profile</label>
                <input
                    type="checkbox"
                    defaultChecked
                />
            </div>
            <div className="setting-item">
                <label>Show Watch History</label>
                <input
                    type="checkbox"
                    defaultChecked
                />
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'account':
                return renderAccountSettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'playback':
                return renderPlaybackSettings();
            case 'appearance':
                return renderAppearanceSettings();
            case 'privacy':
                return renderPrivacySettings();
            default:
                return renderAccountSettings();
        }
    };

    return (
        <div className="settings-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="settings-content">
                    <div className="settings-header">
                        <div className="settings-icon">
                            <FaCog />
                        </div>
                        <h1>Settings</h1>
                    </div>

                    <div className="settings-container">
                        <div className="settings-sidebar">
                            <div
                                className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('account')}
                            >
                                <FaUser />
                                <span>Account</span>
                            </div>
                            <div
                                className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <FaBell />
                                <span>Notifications</span>
                            </div>
                            <div
                                className={`sidebar-item ${activeTab === 'playback' ? 'active' : ''}`}
                                onClick={() => setActiveTab('playback')}
                            >
                                <FaCog />
                                <span>Playback</span>
                            </div>
                            <div
                                className={`sidebar-item ${activeTab === 'appearance' ? 'active' : ''}`}
                                onClick={() => setActiveTab('appearance')}
                            >
                                <FaPalette />
                                <span>Appearance</span>
                            </div>
                            <div
                                className={`sidebar-item ${activeTab === 'privacy' ? 'active' : ''}`}
                                onClick={() => setActiveTab('privacy')}
                            >
                                <FaShieldAlt />
                                <span>Privacy</span>
                            </div>
                        </div>

                        <div className="settings-main">
                            {renderTabContent()}
                        </div>
                    </div>

                    <div className="logout-section">
                        <button className="logout-btn" onClick={handleLogout}>
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings; 