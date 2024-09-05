// Feed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import '../src/assets/css/feed.css';

const Feed = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const userId = localStorage.getItem('userId');

    // Fetch contents and liked posts
    const fetchContents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/content/newsfeed', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const fetchedContents = response.data;
            setContents(fetchedContents);

            // Initialize likedPosts state
            const userLikes = fetchedContents.reduce((likes, content) => {
                if (content.isLiked) {
                    likes.push(content._id);
                }
                return likes;
            }, []);

            setLikedPosts(userLikes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch content');
            setLoading(false);
        }
    };

    // Fetch comments for a post
    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/content/comments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const comments = response.data;

            // Fetch user details for each comment
            const commentsWithUserDetails = await Promise.all(comments.map(async comment => {
                const userResponse = await axios.get(`http://localhost:8000/api/users/${comment.author}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                return { ...comment, authorName: userResponse.data.name };
            }));

            setComments(prevComments => ({ ...prevComments, [postId]: commentsWithUserDetails }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Handle like/unlike functionality
    const handleLikeClick = async (contentId) => {
        try {
            const isLiked = likedPosts.includes(contentId);

            await axios.post(
                'http://localhost:8000/api/content/like',
                { postId: contentId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Update the likedPosts state based on the current like status
            setLikedPosts(prevLikedPosts => {
                if (isLiked) {
                    return prevLikedPosts.filter(id => id !== contentId);
                } else {
                    return [...prevLikedPosts, contentId];
                }
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Handle new comment
    const handleCommentSubmit = async (postId) => {
        try {
            await axios.post(
                'http://localhost:8000/api/content/comment',
                { postId, text: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNewComment('');
            fetchComments(postId);  // Refresh comments
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Fetch contents on component mount
    useEffect(() => {
        fetchContents();
    }, []);



    // convert time to sec,hr,date
    const getTimeDifference = (timestamp) => {
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - commentTime) / 1000);
      
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
      
        if (days > 0) {
          return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
          return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
          return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
        } else {
          return 'Just now';
        }
      };

    if (loading) return <div className="feed-loading">Loading...</div>;
    if (error) return <div className="feed-error">{error}</div>;

    return (
        <div className="feed-container">
            {contents.length === 0 ? (
                <p className="feed-no-content">No content available</p>
            ) : (
                contents.map(content => {
                    const isVideo = content.fileName.endsWith('.mp4');
                    const date = new Date(content.createdAt);
                    const formattedDate = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

                    const user = content.userDetails || {};
                    const profilePic = user.profilePic || 'default-profile-pic.jpg';
                    const userName = user.name || 'Unknown User';

                    const isLiked = likedPosts.includes(content._id);

                    return (
                        <div key={content._id} className="feed-item-container">
                            <div className="feed-item-user-info">
                                <img
                                    src={`http://localhost:8000/profilepic/${profilePic}`}
                                    alt="Profile"
                                    className="feed-item-user-profile-pic"
                                />
                                <div className="feed-item-user-details">
                                    <span className="feed-item-user-name">{userName}</span>
                                    <span className="feed-item-post-date">{formattedDate}</span>
                                </div>
                            </div>
                            <div className="feed-item-content-body">
                                {content.caption && <p className="feed-item-caption">{content.caption}</p>}
                                {isVideo ? (
                                    <video
                                        src={`http://localhost:8000/usersUpload/${content.fileName}`}
                                        controls
                                        className="feed-item-content-media"
                                    />
                                ) : (
                                    <img
                                        src={`http://localhost:8000/usersUpload/${content.fileName}`}
                                        alt={content.caption}
                                        className="feed-item-content-image"
                                    />
                                )}
                                <div className="feed-item-icons">
                                    <FaHeart
                                        className={`feed-item-icon feed-item-heart-icon ${isLiked ? 'liked' : ''}`}
                                        onClick={() => handleLikeClick(content._id)}
                                        style={{ color: isLiked ? 'red' : 'black', cursor: 'pointer' }}
                                    />
                                    <FaComment
                                        className="feed-item-icon feed-item-comment-icon"
                                        onClick={() => {
                                            setSelectedContent(content);
                                            fetchComments(content._id);
                                        }}
                                    />
                                    <FaBookmark className="feed-item-icon feed-item-save-icon" />
                                </div>
                            </div>
                            <div className="feed-item-divider"></div>
                        </div>
                    );
                })
            )}
            {selectedContent && (
                <div className="feed-modal">
                    <div className="feed-modal-content">
                        <span className="feed-modal-close" onClick={() => setSelectedContent(null)}>&times;</span>
                        <div className="feed-modal-body">
                            <img
                                src={`http://localhost:8000/usersUpload/${selectedContent.fileName}`}
                                alt={selectedContent.caption}
                                className="feed-modal-image"
                            />
                            <div className="feed-modal-right">
                                <div className="feed-modal-header">
                                    <img
                                        src={
                                            selectedContent.userDetails.profilePic
                                                ? `http://localhost:8000/profilepic/${selectedContent.userDetails.profilePic}`
                                                : 'http://localhost:8000/profilepic/default-profile-pic.jpg'
                                        }
                                        alt="Profile"
                                        className="feed-modal-profile-pic"
                                    />
                                    <div className="feed-modal-user-info">
                                        <span className="feed-modal-user-name">{selectedContent.userDetails.name}</span>
                                        <span className="feed-modal-user-nickname">@{selectedContent.userDetails.nickName}</span>
                                    </div>
                                </div>
                                <div className="feed-modal-separator"></div>
                                <p className="feed-modal-caption">{selectedContent.caption}</p>
                                <div className="feed-modal-icons">
                                    <FaHeart
                                        className={`feed-modal-icon feed-modal-heart-icon ${likedPosts.includes(selectedContent._id) ? 'liked' : ''}`}
                                        onClick={() => handleLikeClick(selectedContent._id)}
                                        style={{ color: likedPosts.includes(selectedContent._id) ? 'red' : 'black', cursor: 'pointer' }}
                                    />
                                    <FaComment className="feed-modal-icon feed-modal-comment-icon" />
                                </div>
                                <span className="feed-modal-upload-time">
                                    {new Date(selectedContent.createdAt).toLocaleString()}
                                </span>
                                <div className="feed-modal-comments">
                                {comments[selectedContent._id] && comments[selectedContent._id].map(comment => (
                                    <div key={comment._id} className="feed-modal-comment">
                                        <span className="feed-modal-comment-author">{comment.authorName}</span>
                                        <span className="feed-modal-comment-text">{comment.text}</span>
                                        <span className="feed-modal-comment-timestamp">
                                        <p className="comment-timestamp">
                                            {getTimeDifference(comment.timestamp)}
                                        </p>
                                    </span>
                                    </div>
                                ))}
                                </div>
                                <div className="feed-modal-add-comment">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                    ></textarea>
                                    <button onClick={() => handleCommentSubmit(selectedContent._id)}>
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feed;
