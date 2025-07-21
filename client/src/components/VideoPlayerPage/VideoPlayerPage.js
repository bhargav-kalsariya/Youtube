import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from 'react-icons/ai';
import { addCommentToThisVideo, deleteVideo, setCurrentVideo } from '../../redux/slices/videoSlice';
import { likeThisVideo, dislikeThisVideo, subscribe_unsubscribe, getAllVideos, getVideoById } from '../../redux/slices/feedSlice';
import VideoCard from '../VideoCard/VideoCard';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import './VideoPlayerPage.scss';
import { useSidebar } from '../../context/SidebarContext';

const VideoPlayerPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { videoId } = useParams();
    const currentVideoFromVideoSlice = useSelector((state) => state.videoReducer.currentVideo);
    const { videos, currentVideo: currentVideoFromFeedSlice } = useSelector((state) => state.feedReducer);
    const myProfile = useSelector((state) => state.userReducer.myProfile);

    // Use feed slice current video if available, otherwise use video slice current video
    const currentVideo = currentVideoFromFeedSlice || currentVideoFromVideoSlice;
    const { isSidebarOpen } = useSidebar();

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [commentError, setCommentError] = useState('');

    // Get recommended videos (excluding current video)
    const recommendedVideos = videos.filter(video => video._id !== currentVideo?._id).slice(0, 10);

    useEffect(() => {
        if (currentVideo && myProfile?.data?._id) {
            const currentUserId = myProfile.data._id;

            // Check if current user has liked/disliked the video
            setIsLiked(currentVideo.isLiked || false);
            setIsDisliked(currentVideo.isDisliked || false);

            // Check if current user is subscribed to the video owner
            setIsSubscribed(currentVideo.owner?.isSubscribed || false);

            // Set counts
            setLikesCount(currentVideo.likesCount || 0);
            setSubscribersCount(currentVideo.owner?.subscribers || 0);
        }
    }, [currentVideo, myProfile]);

    useEffect(() => {
        // Load all videos for recommendations
        dispatch(getAllVideos());
    }, [dispatch]);

    // Fetch video data when component loads with video ID from URL
    useEffect(() => {
        if (videoId) {
            dispatch(getVideoById(videoId));
        }
    }, [videoId, dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    function handleLikeClick() {

        if (isLiked) {
            setIsLiked(false);
            setLikesCount(likesCount - 1);
        }
        else {
            if (isDisliked) {
                setIsDisliked(false);
                setLikesCount(likesCount + 1);
            } else {
                setLikesCount(likesCount + 1);
            }
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
        // Validate that comment is not empty or just whitespace
        if (!newComment || !newComment.trim()) {
            setCommentError('Comment cannot be empty.');
            return; // Don't submit empty comments
        }

        dispatch(addCommentToThisVideo({ videoId: currentVideo?._id, newComment: newComment.trim() }));
        setNewComment('');
        setCommentError(''); // Clear error on successful submission
    }

    // Handle Enter key press for comment submission
    const handleCommentKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentClick();
        }
    };

    async function handleDeleteVideo() {
        try {
            await dispatch(deleteVideo(currentVideo._id)).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Failed to delete video:', error);
        }
    }

    if (!currentVideo) {
        return (
            <div className="video-player-page">
                <div className="loading">Loading video...</div>
            </div>
        );
    }

    return (
        <div className="video-player-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="video-container">
                    <div className="video-main-section">
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
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-info">
                                <h1>{currentVideo?.title}</h1>
                                <div className="channel-info">
                                    <div className="left-part">
                                        <img src={currentVideo?.owner?.avatar?.url} alt="Channel Avatar" className="channel-avatar" onClick={() => navigate(`/profile/${currentVideo?.owner?._id}`)} />
                                        <div className="channel-details">
                                            <h2 className="channel-name">{currentVideo?.owner?.channleName}</h2>
                                            <p className="subscriber-count">{subscribersCount} subscribers</p>
                                        </div>
                                        {!currentVideo?.owner?.isMyVideo ? (
                                            <button className="subscribe-button" onClick={handleSubscribeClick}>
                                                {!isSubscribed ? 'Subscribe' : 'UnSubscribe'}
                                            </button>
                                        ) : (
                                            <button className="delete-button" onClick={() => setShowDeleteConfirm(true)}>
                                                Delete Video
                                            </button>
                                        )}
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
                                            onChange={(e) => {
                                                setNewComment(e.target.value);
                                                if (commentError) {
                                                    setCommentError(''); // Clear error when user starts typing
                                                }
                                            }}
                                            placeholder="Add a comment..."
                                            onKeyPress={handleCommentKeyPress}
                                        />
                                        {commentError && <p className="comment-error">{commentError}</p>}
                                        <button
                                            type="submit"
                                            onClick={handleCommentClick}
                                            disabled={!newComment || !newComment.trim()}
                                        >
                                            Comment
                                        </button>
                                    </div>
                                    {currentVideo?.comments && (
                                        <div className="comments-list">
                                            {currentVideo.comments.map((comment, index) => (

                                                <div key={index} className="comment">
                                                    <img src={comment?.owner?.avatar?.url} alt={`${comment.owner.channleName}'s avatar`} className="comment-avatar" onClick={() => navigate(`/profile/${comment?.owner?._id}`)} />
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

                    <div className="recommended-videos">
                        <h3>Recommended Videos</h3>
                        <div className="recommended-videos-list">
                            {recommendedVideos.map(video => (
                                <div key={video._id} className="recommended-video-card" onClick={() => {
                                    dispatch(setCurrentVideo(video));
                                    navigate(`/videoPlayerPage/${video._id}`);
                                }}>
                                    <div className="video-thumbnail">
                                        <video
                                            width="100%"
                                            height="auto"
                                            muted
                                            preload="metadata"
                                        >
                                            <source src={video?.video?.url} type="video/mp4" />
                                        </video>
                                    </div>
                                    <div className="video-info-compact">
                                        <div className="channel-avatar-small">
                                            <img
                                                src={video.owner?.avatar?.url || '/default-avatar.png'}
                                                alt={video.owner?.channleName}
                                            />
                                        </div>
                                        <div className="video-details-compact">
                                            <h4 className="video-title">{video.title}</h4>
                                            <p className="channel-name-small">{video.owner?.channleName}</p>
                                            <p className="video-stats">{video.viewsCount} views • {video.timeAgo}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="delete-confirm-modal">
                    <div className="modal-content">
                        <h3>Delete Video?</h3>
                        <p>This action cannot be undone. The video will be permanently deleted.</p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={handleDeleteVideo}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayerPage;

