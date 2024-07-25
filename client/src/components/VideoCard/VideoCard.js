import React, { useRef, useState, useEffect } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './VideoCard.scss';
import dummyImg from '../../assets/user.png';

const VideoCard = ({ video }) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playTimeout, setPlayTimeout] = useState(null);
    const [pauseTimeout, setPauseTimeout] = useState(null);
    const [isMuted, setIsMuted] = useState(true);

    const handleMouseEnter = () => {
        clearTimeout(pauseTimeout);
        const timeout = setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.muted = isMuted;
                videoRef.current.play();
            }
        }, 100); // Adjust the delay as needed
        setPlayTimeout(timeout);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        clearTimeout(playTimeout);
        const timeout = setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Optional: Reset video to the beginning
            }
        }, 100); // Adjust the delay as needed
        setPauseTimeout(timeout);
        setIsHovered(false);
    };

    const skipTo = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
            videoRef.current.play(); // Ensure the video starts playing after skipping
        }
    };

    const toggleMute = () => {
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
            }
            if (isHovered) {
                requestAnimationFrame(updateProgress);
            }
        };

        if (isHovered) {
            requestAnimationFrame(updateProgress);
        }


    }, [isHovered, playTimeout, pauseTimeout]);

    return (
        <div
            className="video-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="video-container">
                <video ref={videoRef} width="100%" height="auto">
                    <source src={video.video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {isHovered && (
                    <>
                        <div className="controls">
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
            <div className="video-info">
                <div className="owner-avatar">
                    <img src={video.owner.avatar.url ? video.owner.avatar.url : dummyImg} alt='avatar' />
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
