import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile } from '../../redux/slices/userSlice';
import dummyImg from '../../assets/user.png'
import './UpdateProfile.scss'
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function UpdateProfile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfile = useSelector((state) => state.userReducer.myProfile);

    console.log({ myProfile });

    const [channleName, setChannleName] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    useEffect(() => {
        setChannleName(myProfile.data.channleName);
        setProfilePictureURL(myProfile.data.profilePictureURL);
        setBio(myProfile.data.bio);
    }, [myProfile])

    function handleImageChange(e) {

        const file = e.target.files[0];
        const fileReader = new FileReader();

        if (file) {
            fileReader.readAsDataURL(file);
        } else {
            setProfilePictureURL(null);
            return;
        }
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setProfilePictureURL(fileReader.result)
            }
        }

    }

    async function handleSubmit() {

    }

    return (
        <div className='UpdateProfile'>
            <div className="back-to-home" onClick={() => navigate('/')}>
                <FaHome size={24} />
                <span>Back to Home</span>
            </div>
            <div className="container">
                <div className="left-side">
                    <div className="input-user-img">
                        <label htmlFor="userImg" className='lableImg'>
                            <img src={profilePictureURL ? profilePictureURL : dummyImg} alt='Profile' />
                        </label>
                        <input className='inputImg' type="file" accept='image/*' id="userImg" onChange={handleImageChange} />
                    </div>
                </div>
                <div className="right-side">
                    <form onSubmit={handleSubmit}>
                        <input value={channleName} type="text" placeholder='Your Name' onChange={(e) => setChannleName(e.target.value)} />
                        <input value={bio} type="text" placeholder='Your Bio' onChange={(e) => setBio(e.target.value)} />
                        <input type="submit" className='btn-primary' value="Update Profile" />
                    </form>
                    <input type="submit" className='btn-primary delete-account' value='Delete Account' />
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
