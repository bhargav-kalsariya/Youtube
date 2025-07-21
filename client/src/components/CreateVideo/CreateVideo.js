import React, { useState, useRef } from 'react';
import './CreateVideo.scss';
import { BsCardImage } from 'react-icons/bs';
import { axiosClient } from '../../utilities/axiosClient';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

function CreateVideo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [postVideo, setPostVideo] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef();
    const [dragActive, setDragActive] = useState(false);
    const [showPreviewActions, setShowPreviewActions] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    function handleVideoChange(e) {
        const file = e.target.files[0];
        if (!file) {
            setPostVideo(null);
            setVideo(null);
            return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setVideo(file);
                setPostVideo(fileReader.result);
            }
        };
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleVideoChange({ target: { files: e.dataTransfer.files } });
        }
    }

    function handleRemoveVideo() {
        setVideo(null);
        setPostVideo(null);
        setShowOverlay(false);
    }

    function handleShowOverlay(e) {
        e.stopPropagation();
        setShowOverlay(true);
    }
    function handleHideOverlay(e) {
        e.stopPropagation();
        setShowOverlay(false);
    }

    async function handleVideoSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !postVideo) {
            setError('Please fill in all fields and select a video');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axiosClient.post('/video/create', {
                title,
                description,
                postVideo
            });
            setTitle('');
            setDescription('');
            setPostVideo(null);
            setVideo(null);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.result?.error || 'Failed to upload video. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='createVideo-container'>
            <div className="back-to-home" onClick={() => navigate('/')}> <FaArrowLeft /> <span>Back to Home</span> </div>
            <form className='createVideo-card' onSubmit={handleVideoSubmit}>
                <div className="video-preview-modern">
                    {video ? (
                        <div
                            className="video-preview-wrapper"
                            style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <video width="100%" controls style={{ borderRadius: '8px', background: '#000', maxHeight: '320px' }}>
                                <source src={postVideo} type={video.type} />
                            </video>
                            <div className="video-meta">
                                <span className="video-filename">{video.name}</span>
                                <span className="video-size">{(video.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button
                                type="button"
                                className="preview-remove-btn"
                                style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, background: 'rgba(30,30,30,0.85)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer', color: '#fff' }}
                                onClick={handleRemoveVideo}
                                aria-label="Remove selected video"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <div
                            className={`video-upload-area${dragActive ? ' drag-active' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            tabIndex={0}
                            role="button"
                            aria-label="Upload video"
                            style={{ marginTop: '0' }}
                        >
                            <FaCloudUploadAlt size={40} />
                            <p>{postVideo ? 'Change Video' : 'Drag & drop or click to upload video'}</p>
                            <input
                                ref={fileInputRef}
                                className='input-video-file'
                                type="file"
                                accept='video/*'
                                style={{ display: 'none' }}
                                onChange={handleVideoChange}
                            />
                        </div>
                    )}
                </div>
                <div className="video-form-fields">
                    <h2 className="createVideo-title">Upload a New Video</h2>
                    <label htmlFor="video-title" className="input-label">Title</label>
                    <input
                        id="video-title"
                        value={title}
                        type="text"
                        className='title-input'
                        placeholder='Enter video title'
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        required
                    />
                    <label htmlFor="video-description" className="input-label">Description</label>
                    <textarea
                        id="video-description"
                        value={description}
                        className='description-textarea'
                        placeholder='Enter video description'
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        maxLength={500}
                        required
                    />
                    {error && <div className="error-message-modern">{error}</div>}
                    <button
                        type="submit"
                        className={`upload-btn-modern${loading ? ' loading' : ''}`}
                        disabled={loading}
                        style={{ marginTop: '18px' }}
                    >
                        {loading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateVideo;