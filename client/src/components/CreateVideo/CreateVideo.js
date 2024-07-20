import React, { useState } from 'react'
import './CreateVideo.scss';
import { BsCardImage } from 'react-icons/bs'
import { axiosClient } from '../../utilities/axiosClient';

function CreateVideo() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [postVideo, setPostVideo] = useState(null);
    const [video, setVideo] = useState(null);

    function handleVideoChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        if (file) {
            fileReader.readAsDataURL(file);
        } else {
            setPostVideo(null);
            return;
        }

        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setVideo(file);
                setPostVideo(fileReader.result);
            }
        };
    }

    async function handleVideoSubmit() {

        try {

            const response = await axiosClient.post('/video/create', {
                title,
                description,
                postVideo
            })
            console.log('create video', { response });

        } catch (error) {

            return Promise.reject(error);

        } finally {

            setTitle('');
            setDescription('');
            setPostVideo(null);
            setVideo(null);

        }

    }

    return (
        <div className='createVideo'>
            <div className="video-information">
                <div className="right-part">
                    <input value={title} type="text" className='title' placeholder=' title ' onChange={(e) => setTitle(e.target.value)} />
                    <input value={description} type="text" className='description' placeholder=' description ' onChange={(e) => setDescription(e.target.value)} />

                    {postVideo && (
                        <div className="video-preview">
                            <video width="400" controls>
                                <source src={postVideo} source={video.type} />
                            </video>
                        </div>
                    )}

                    <div className="bottom-part">
                        <div className="input-post-img">
                            <label htmlFor="userImg" className='lableImg'>
                                <BsCardImage />
                            </label>
                            <input className='inputImg' type="file" accept='image/*' id="userImg" onChange={handleVideoChange} />
                        </div>
                        <div className="post-btn btn-primary" onClick={handleVideoSubmit}>Post</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateVideo