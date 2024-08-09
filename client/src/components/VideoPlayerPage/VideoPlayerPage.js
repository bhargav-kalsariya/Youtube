import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './VideoPlayerPage.scss';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { IoArrowBackSharp } from 'react-icons/io5';
import { dislikeThisVideo, likeThisVideo, subscribe_unsubscribe } from '../../redux/slices/feedSlice';
import { addCommentToThisVideo } from '../../redux/slices/videoSlice';

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
    const [isSubscribed, setIsSubscribed] = useState(currentVideo?.owner?.isSubscribed);
    const [subscribersCount, setSubscribersCount] = useState(currentVideo?.owner?.subscribers);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {

        setIsLiked(currentVideo?.isLiked);
        setIsDisliked(currentVideo?.isDisliked);
        setLikesCount(currentVideo?.likesCount);
        setIsSubscribed(currentVideo?.owner?.isSubscribed);
        setSubscribersCount(currentVideo?.owner?.subscribers);
        setNewComment('');

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

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    async function handleCommentClick() {

        dispatch(addCommentToThisVideo({ videoId: currentVideo?._id, newComment }));
        setNewComment('');

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
                                <img src={currentVideo?.owner?.avatar.url} alt="Channel Avatar" className="channel-avatar" onClick={() => navigate(`/profile/${currentVideo?.owner?._id}`)} />
                                <div className="channel-details">
                                    <h2 className="channel-name">{currentVideo?.owner?.channleName}</h2>
                                    <p className="subscriber-count">{subscribersCount} subscribers</p>
                                </div>
                                {!currentVideo?.owner?.isMyVideo &&
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
                        <div className="video-meta-wrapper">
                            <div className="video-meta">
                                <span className="video-views">{currentVideo?.viewsCount} views</span>
                                <span className="video-time">{currentVideo?.timeAgo}</span>
                                <div className="video-description">
                                    <p>
                                        {showFullDescription
                                            ? currentVideo?.description
                                            : `${currentVideo?.description?.substring(0, 40)}...`}
                                        <span className="show-more" onClick={handleToggleDescription}>
                                            {showFullDescription ? ' Show less' : ' Show more'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="comments-section">
                            <h2>{currentVideo?.comments?.length} Comments</h2>
                            <div className="comment-form">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                />
                                <button type="submit" onClick={handleCommentClick}>Comment</button>
                            </div>
                            {currentVideo?.comments && (
                                <div className="comments-list">
                                    {currentVideo.comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <img src={comment?.owner?.avatar?.url} alt={`${comment.owner.channleName}'s avatar`} className="comment-avatar" />
                                            <div className="comment-details">
                                                <div className="comment-header">
                                                    <strong>{comment.owner.channleName}</strong>
                                                    <span className="comment-time">{comment.timeAgo}</span>
                                                </div>
                                                <p className="comment-text">{comment.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VideoPlayerPage;

