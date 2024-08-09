import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './VideoCard.scss';
import dummyImg from '../../assets/user.png';
import { axiosClient } from '../../utilities/axiosClient';
import { useDispatch } from 'react-redux';
import { getAllVideos } from '../../redux/slices/feedSlice';
import { setCurrentVideo } from '../../redux/slices/videoSlice';

const VideoCard = ({ video }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const animationFrameId = useRef(null);
    const videoId = video._id;
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isViewUpdated, setIsViewUpdated] = useState(false);

    async function handleVideoClick() {

        dispatch(setCurrentVideo(video));
        navigate('/videoPlayerPage');
        const response = await axiosClient.post('/video/addView', { videoId });
        if (response.data.result) {
            return setIsViewUpdated(true);
        }
        return response.data.result;

    }

    useEffect(() => {
        dispatch(getAllVideos());
    }, [dispatch, isViewUpdated]);

    const debounce = useCallback((func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }, []);

    const handlePlay = debounce(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            videoRef.current.play().catch((error) => console.log('Play error:', error));
        }
    }, 100);

    const handlePause = debounce(() => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, 100);

    const handleMouseEnter = () => {
        setIsHovered(true);
        handlePlay();
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        handlePause();
    };

    const skipTo = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
            videoRef.current.play().catch((error) => console.log('Play error:', error));
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation()
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    useEffect(() => {
        const updateProgress = () => {
            if (videoRef.current) {
                const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                setProgress(percentage);
                animationFrameId.current = requestAnimationFrame(updateProgress);
            }
        };

        if (isHovered) {
            animationFrameId.current = requestAnimationFrame(updateProgress);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isHovered]);

    return (
        <div
            className="video-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="video-container"
                onClick={handleVideoClick}
            >
                <video ref={videoRef} width="100%" height="auto">
                    <source src={video?.video?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {isHovered && (
                    <>
                        <div className="controls" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => skipTo(10)}>+10s</button>
                            <button onClick={() => skipTo(30)}>+30s</button>
                            <button onClick={() => skipTo(60)}>+1m</button>
                        </div>
                        <div className="timeline">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                        <button className="mute-button" onClick={toggleMute}>
                            {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                        </button>
                    </>
                )}
            </div>
            <div className="video-information">
                <div className="owner-avatar" onClick={() => navigate(`/profile/${video.owner._id}`)}>
                    <img src={video.owner.avatar.url ? video.owner.avatar.url : dummyImg} alt='avatar' />
                </div>
                <div className="video-details">
                    <h3 className="title">{video.title}</h3>
                    <p className="owner-name">{video.owner.channelName}</p>
                    <p className="views-time">{video.viewsCount} views • {video.timeAgo}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
