import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './VideoPlayerPage.scss';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Import only the icons needed
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { IoArrowBackSharp } from 'react-icons/io5';

const VideoPlayerPage = () => {

    const navigate = useNavigate();
    const currentVideo = useSelector(state => state.videoReducer.currentVideo);
    console.log({ currentVideo });
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="video-player-page">
            <div className="main-content">
                <button className="back-button" onClick={handleBack}>
                    <IoArrowBackSharp size={24} />
                </button>
                <div className="video-card">
                    <video
                        width="100%"
                        height="auto"
                        controls
                        src={currentVideo?.video?.url}
                        title={currentVideo?.title}
                    >
                        Your browser does not support the video tag.
                    </video>
                    <div className="video-info">
                        <h1>{currentVideo?.title}</h1>
                        <div className="channel-info">
                            <div className="left-part">
                                <img src={currentVideo?.owner?.avatar.url} alt="Channel Avatar" className="channel-avatar" />
                                <div className="channel-details">
                                    <h2 className="channel-name">{currentVideo?.owner?.channleName}</h2>
                                    <p className="subscriber-count">{currentVideo?.owner?.subscribers} subscribers</p>
                                </div>
                                {!currentVideo?.owner.isMyVideo && <button className="subscribe-button">{!currentVideo?.owner?.isSubscribed ? 'Subscribe' : 'UnSubscribe'}</button>}
                            </div>
                            <div className="right-part">
                                <div className="video-actions">
                                    <button className="action-button">
                                        <div className="like-icon">
                                            <AiOutlineLike fontSize={24} />
                                        </div>
                                        <div className="like-count">
                                            {currentVideo.likesCount}
                                        </div>
                                    </button>
                                    <button className="action-button">
                                        <AiOutlineDislike fontSize={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="suggested-videos">
                    {/* Placeholder for suggested videos */}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;


{/* <div className="comments-section">
<h2>Comments</h2>
{comments.map((comment, index) => (
<div key={index} className="comment">
    <p><strong>{comment.author}</strong>: {comment.text}</p>
</div>
))}
</div> */}