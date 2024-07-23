import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile, updateProfile } from '../../redux/slices/userSlice';
import dummyImg from '../../assets/user.png'
import './UpdateProfile.scss'
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function UpdateProfile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfile = useSelector((state) => state.userReducer.myProfile);

    console.log({ myProfile });

    const [ChannleName, setChannleName] = useState('');
    const [ProfilePicture, setProfilePicture] = useState('');
    const [Bio, setBio] = useState('');

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch]);

    useEffect(() => {
        setChannleName(myProfile?.data?.channleName || '');
        setProfilePicture(myProfile?.data?.profilePictureURL?.url);
        setBio(myProfile?.data?.bio || '');
    }, [myProfile])

    function handleImageChange(e) {

        const file = e.target.files[0];
        const fileReader = new FileReader();

        if (file) {
            fileReader.readAsDataURL(file);
        } else {
            setProfilePicture(null);
            return;
        }
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setProfilePicture(fileReader.result)
            }
        }

    }

    async function handleSubmit(e) {
        e.preventDefault();

        dispatch(updateProfile(
            {
                ChannleName,
                ProfilePicture,
                Bio
            }
        ));
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
                            <img src={ProfilePicture ? ProfilePicture : dummyImg} alt='Profile' />
                        </label>
                        <input className='inputImg' type="file" accept='image/*' id="userImg" onChange={handleImageChange} />
                    </div>
                </div>
                <div className="right-side">
                    <form onSubmit={handleSubmit}>
                        <input value={ChannleName} type="text" placeholder='Your Name' onChange={(e) => setChannleName(e.target.value)} />
                        <input value={Bio} type="text" placeholder='Your Bio' onChange={(e) => setBio(e.target.value)} />
                        <input type="submit" className='btn-primary' value="Update Profile" />
                    </form>
                    <input type="submit" className='btn-primary delete-account' value='Delete Account' />
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
