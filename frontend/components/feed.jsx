import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment } from 'react-icons/fa';
import '../src/assets/css/feed.css';

// Function to format the date into a "time ago" format
const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const interval = Math.floor(seconds / 31536000); // Seconds in a year

    if (interval > 1) return `${interval} years ago`;
    if (Math.floor(seconds / 2592000) > 1) return `${Math.floor(seconds / 2592000)} months ago`;
    if (Math.floor(seconds / 86400) > 1) return `${Math.floor(seconds / 86400)} days ago`;
    if (Math.floor(seconds / 3600) > 1) return `${Math.floor(seconds / 3600)} hours ago`;
    if (Math.floor(seconds / 60) > 1) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

const Feed = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/content/newsfeed', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const sortedContents = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setContents(sortedContents);
                const liked = new Set(sortedContents.filter(post => post.isLiked).map(post => post._id));
                setLikedPosts(liked);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
                setError('Failed to fetch content');
                setLoading(false);
            }
        };

        fetchContents();
    }, []);

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/content/like/${postId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.status === 200) {
                const updatedLikesCount = response.data.likes;
                setContents(prevContents =>
                    prevContents.map(content =>
                        content._id === postId ? { ...content, likesCount: updatedLikesCount } : content
                    )
                );
                setLikedPosts(prev => {
                    const newSet = new Set(prev);
                    newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
                    return newSet;
                });
            } else {
                console.error('Error liking post:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error liking post:', error.response?.data || error.message);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/content/comments/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComments(prev => ({ ...prev, [postId]: response.data }));
        } catch (error) {
            console.error('Error fetching comments:', error.response?.data || error.message);
        }
    };

    const handleCommentClick = async (post) => {
        setSelectedPost(post);
        await fetchComments(post._id);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !selectedPost) return;
        try {
            await axios.post(`http://localhost:8000/api/content/comment/${selectedPost._id}`, { text: newComment }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewComment('');
            await fetchComments(selectedPost._id);
        } catch (error) {
            console.error('Error posting comment:', error.response?.data || error.message);
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
                    const user = content.userDetails || {};
                    const profilePic = user.profilePic || 'default-profile-pic.jpg';
                    const userName = user.name || 'Unknown User';

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
                                    <span className="feed-item-post-date">{timeAgo(content.createdAt)}</span>
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
                            </div>
                            <div className="feed-item-actions">
                                <FaHeart
                                    onClick={() => handleLike(content._id)}
                                    style={{ color: likedPosts.has(content._id) ? 'red' : 'black', cursor: 'pointer' }}
                                />
                                <FaComment
                                    onClick={() => handleCommentClick(content)}
                                    className="feed-item-comment-icon"
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className="feed-item-divider"></div>
                        </div>
                    );
                })
            )}

            {selectedPost && (
                <div className="feed-modal">
                    <div className="feed-modal-content">
                        <div className="feed-modal-body">
                            <div className="feed-modal-image">
                                {selectedPost.fileName.endsWith('.mp4') ? (
                                    <video
                                        src={`http://localhost:8000/usersUpload/${selectedPost.fileName}`}
                                        controls
                                        className="feed-modal-image"
                                    />
                                ) : (
                                    <img
                                        src={`http://localhost:8000/usersUpload/${selectedPost.fileName}`}
                                        alt={selectedPost.caption}
                                        className="feed-modal-image"
                                    />
                                )}
                            </div>
                            <div className="feed-modal-info">
                                <div className="feed-modal-user-info">
                                    <img
                                        src={`http://localhost:8000/profilepic/${selectedPost.userDetails?.profilePic || 'default-profile-pic.jpg'}`}
                                        alt="Profile"
                                        className="feed-modal-profile-pic"
                                    />
                                    <div className="feed-modal-user-details">
                                        <span className="feed-modal-user-name">{selectedPost.userDetails?.name || 'Unknown User'}</span>
                                        <span className="feed-modal-user-nickname">@{selectedPost.userDetails?.nickName || 'unknown_nickname'}</span>
                                        <span className="feed-modal-upload-time">
                                            {timeAgo(selectedPost.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="feed-modal-separator"></div>
                                <p className="feed-modal-caption">{selectedPost.caption}</p>
                                <div className="feed-modal-comments-section">

                    <div className="feed-modal-comments">
                        {comments[selectedPost._id]?.map((comment, index) => (
                            <div key={index} className="feed-modal-comment">
                                <img
                                    src={`http://localhost:8000/profilepic/${comment.author.profilePic || 'default-profile-pic.jpg'}`}
                                    alt="Profile"
                                    className="feed-modal-comment-profile-pic"
                                />
                                <div className="feed-modal-comment-content">
                                    <div className="feed-modal-comment-header">
                                        <strong>{comment.author.name || 'Unknown User'}</strong> <br />
                                        <span style={{color:'gray', fontSize: '0.5rem'}} className="feed-modal-comment-timestamp">{timeAgo(comment.createdAt)}</span>
                                    </div>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className="feed-modal-add-comment">
                        <textarea
                            className="feed-modal-comment-input"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button onClick={handleCommentSubmit}>Post</button>
                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="feed-modal-close" onClick={handleCloseModal}>×</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feed;
