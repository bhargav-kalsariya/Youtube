import React, { useState } from 'react'
import './CreateVideo.scss';
import { BsCardImage } from 'react-icons/bs'

function CreateVideo() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        if (file) {
            fileReader.readAsDataURL(file);
        } else {
            setVideoPreview(null);
            return;
        }

        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setVideoFile(file);
                setVideoPreview(fileReader.result);
            }
        };
    }

    async function handlePostSubmit() {

        // try {

        //     const response = await axiosClient.post('/posts/', {
        //         title,
        //         postImg
        //     })
        //     console.log('create post', response);
        //     disPatch(getUserProfile({
        //         userId: myProfile?._id
        //     }))

        // } catch (error) {

        //     return Promise.reject(error);

        // } finally {

        //     setTitle('');
        //     setPostImg('');

        // }

    }

    return (
        <div className='createVideo'>
            <div className="video-information">
                <div className="right-part">
                    <input value={title} type="text" className='title' placeholder=' title ' onChange={(e) => setTitle(e.target.value)} />
                    <input value={description} type="text" className='description' placeholder=' description ' onChange={(e) => setDescription(e.target.value)} />

                    {videoPreview && (
                        <div className="video-preview">
                            <video width="400" controls>
                                <source src={videoPreview} type={videoFile.type} />
                            </video>
                        </div>
                    )}

                    <div className="bottom-part">
                        <div className="input-post-img">
                            <label htmlFor="userImg" className='lableImg'>
                                <BsCardImage />
                            </label>
                            <input className='inputImg' type="file" accept='image/*' id="userImg" onChange={handleImageChange} />
                        </div>
                        <div className="post-btn btn-primary" onClick={handlePostSubmit}>Post</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateVideo