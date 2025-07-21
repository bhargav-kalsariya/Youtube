import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile, updateProfile } from '../../redux/slices/userSlice';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import dummyImg from '../../assets/user.png';
import './UpdateProfile.scss';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCamera, FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';
import { useMyProfile } from '../../hooks/useMyProfile';

function UpdateProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSidebarOpen } = useSidebar();
    const myProfile = useMyProfile();
    const [ChannleName, setChannleName] = useState('');
    const [ProfilePicture, setProfilePicture] = useState('');
    const [Bio, setBio] = useState('');
    useEffect(() => { dispatch(getMyProfile()); }, [dispatch]);
    useEffect(() => {
        setChannleName(myProfile?.data?.channleName || '');
        setProfilePicture(myProfile?.data?.profilePictureURL?.url);
        setBio(myProfile?.data?.bio || '');
    }, [myProfile]);
    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        if (file) { fileReader.readAsDataURL(file); } else { setProfilePicture(null); return; }
        fileReader.onload = () => { if (fileReader.readyState === fileReader.DONE) { setProfilePicture(fileReader.result); } };
    }
    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(updateProfile({ ChannleName, ProfilePicture, Bio }));
    }
    return (
        <>
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="update-profile-bg"></div>
                <div className="update-profile-card">
                    <button className="back-to-home-btn-modern" onClick={() => navigate('/')}> <FaHome /> </button>
                    <div className="avatar-upload-wrapper">
                        <label htmlFor="userImg" className='avatar-label'>
                            <img src={ProfilePicture ? ProfilePicture : dummyImg} alt='Profile' className="profile-avatar-modern" />
                            <div className="avatar-upload-overlay">
                                <FaCamera />
                            </div>
                        </label>
                        <input className='inputImg' type="file" accept='image/*' id="userImg" onChange={handleImageChange} />
                    </div>
                    <div className="update-profile-fields">
                        <form className="update-profile-form" onSubmit={handleSubmit}>
                            <label htmlFor="profile-name" className="input-label-modern">Name</label>
                            <input id="profile-name" value={ChannleName} type="text" placeholder='Your Name' onChange={(e) => setChannleName(e.target.value)} />
                            <label htmlFor="profile-bio" className="input-label-modern">Bio</label>
                            <textarea id="profile-bio" value={Bio} placeholder='Your Bio' onChange={(e) => setBio(e.target.value)} />
                            <div className="update-profile-btns">
                                <button type="submit" className='btn-update-modern'><FaUserEdit /> Update Profile</button>
                                <button type="button" className='btn-delete-modern'><FaTrashAlt /> Delete Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UpdateProfile;
