import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './VideoCard.scss';
import dummyImg from '../../assets/user.png';
import { axiosClient } from '../../utilities/axiosClient';
import { useDispatch } from 'react-redux';
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
    const [isPlaying, setIsPlaying] = useState(false);

    async function handleVideoClick() {

        dispatch(setCurrentVideo(video));
        navigate(`/videoPlayerPage/${video._id}`);
        const response = await axiosClient.post('/video/addView', { videoId });
        if (response.data.result) {
            return setIsViewUpdated(true);
        }
        return response.data.result;

    }

    const debounce = useCallback((func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }, []);

    const handlePlay = debounce(async () => {
        if (videoRef.current && !isPlaying) {
            try {
                setIsPlaying(true);
                videoRef.current.muted = isMuted;
                await videoRef.current.play();
            } catch (error) {
                // Ignore play() interrupted errors
                if (error.name !== 'AbortError') {
                    console.error('Video play error:', error);
                }
                setIsPlaying(false);
            }
        }
    }, 100);

    const handlePause = debounce(() => {
        if (videoRef.current && isPlaying) {
            try {
                videoRef.current.pause();
                setIsPlaying(false);
            } catch (error) {
                console.error('Video pause error:', error);
            }
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

    const skipTo = async (seconds) => {
        if (videoRef.current) {
            try {
                videoRef.current.currentTime += seconds;
                if (isPlaying) {
                    await videoRef.current.play();
                }
            } catch (error) {
                console.error('Skip error:', error);
            }
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

    // Cleanup effect to pause video when component unmounts
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                try {
                    videoRef.current.pause();
                } catch (error) {
                    // Ignore cleanup errors
                }
            }
        };
    }, []);

    return (
        <div
            className="video-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="video-container"
                onClick={handleVideoClick}
            >
                <video
                    ref={videoRef}
                    width="100%"
                    height="auto"
                    onError={(e) => {
                        console.error('Video error:', e);
                    }}
                    onLoadStart={() => {
                        // Handle video loading start
                    }}
                    onCanPlay={() => {
                        // Video is ready to play
                    }}
                >
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
                <div className="owner-avatar" onClick={() => {
                    if (video.owner && video.owner._id) {
                        navigate(`/profile/${video.owner._id}`);
                    }
                }}>
                    <img src={video.owner.avatar?.url ? video.owner.avatar.url : dummyImg} alt='avatar' />
                </div>
                <div className="video-details">
                    <h3 className="title">{video.title}</h3>
                    <p className="owner-name">{video.owner.channleName}</p>
                    <p className="views-time">{video.viewsCount} views • {video.timeAgo}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
