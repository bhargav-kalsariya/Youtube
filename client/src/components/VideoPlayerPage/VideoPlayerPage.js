import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './VideoPlayerPage.scss';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { IoArrowBackSharp } from 'react-icons/io5';
import { dislikeThisVideo, likeThisVideo, subscribe_unsubscribe } from '../../redux/slices/feedSlice';

const VideoPlayerPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentVideo = useSelector(state => state.videoReducer.currentVideo);
    console.log({ currentVideo });

    const handleBack = () => {
        navigate(-1);
    };

    const [isLiked, setIsLiked] = useState(currentVideo?.isLiked);
    const [isDisliked, setIsDisliked] = useState(currentVideo?.isDisliked);
    const [likesCount, setLikesCount] = useState(currentVideo?.likesCount);
    const [isSubscribed, setIsSubscribed] = useState(currentVideo?.owner.isSubscribed);
    const [subscribersCount, setSubscribersCount] = useState(currentVideo?.owner?.subscribers);

    useEffect(() => {

        setIsLiked(currentVideo?.isLiked);
        setIsDisliked(currentVideo?.isDisliked);
        setLikesCount(currentVideo?.likesCount);
        setIsSubscribed(currentVideo?.owner?.isSubscribed);
        setSubscribersCount(currentVideo?.owner.subscribers);

    }, [currentVideo]);

    function handleLikeClick() {

        if (isLiked) {
            setLikesCount(likesCount - 1);
            setIsLiked(false);
        }
        else {
            if (isDisliked) {
                setIsDisliked(false);
                setLikesCount(likesCount + 1);
            }
            setLikesCount(likesCount + 1);
            setIsLiked(true);
        }
        dispatch(likeThisVideo({ videoId: currentVideo._id }));

    }

    function handleDislikeClick() {

        if (isDisliked) {
            setIsDisliked(false);
        }
        else {
            setIsDisliked(true);
            if (isLiked) {
                setIsLiked(false);
                setLikesCount(likesCount - 1);
            }
        }
        dispatch(dislikeThisVideo({ videoId: currentVideo._id }));

    }

    function handleSubscribeClick() {

        if (isSubscribed) {
            setIsSubscribed(false);
            setSubscribersCount(subscribersCount - 1);
        } else {
            setIsSubscribed(true);
            setSubscribersCount(subscribersCount + 1);
        }
        dispatch(subscribe_unsubscribe({ userId: currentVideo?.owner?._id }));

    }

    return (
        <div className="video-player-page">
            <div className="main-content">
                <button className="back-button" onClick={handleBack}>
                    <IoArrowBackSharp size={26} />
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
                                    <p className="subscriber-count">{subscribersCount} subscribers</p>
                                </div>
                                {!currentVideo?.owner.isMyVideo &&
                                    <button className="subscribe-button" onClick={handleSubscribeClick}>
                                        {!isSubscribed ? 'Subscribe' : 'UnSubscribe'}
                                    </button>}
                            </div>
                            <div className="right-part">
                                <div className="video-actions">
                                    <button className="action-button" onClick={handleLikeClick}>
                                        <div className="like-icon">
                                            {isLiked ? <AiFillLike color='white' fontSize={26} /> : <AiOutlineLike color='white' fontSize={26} />}
                                        </div>
                                        <div className="like-count">
                                            {likesCount}
                                        </div>
                                    </button>
                                    <button className="action-button" onClick={handleDislikeClick}>
                                        {isDisliked ? <AiFillDislike color='white' fontSize={26} /> : <AiOutlineDislike color='white' fontSize={26} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="suggested-videos">
                    {/* Placeholder for suggested videos */}
                    {/* <div className="comments-section">
            <h2>Comments</h2>
            {comments.map((comment, index) => (
            <div key={index} className="comment">
                <p><strong>{comment.author}</strong>: {comment.text}</p>
            </div>
            ))}
            </div> */}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;

