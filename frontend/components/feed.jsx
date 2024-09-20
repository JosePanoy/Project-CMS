import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import heartIcon from '../src/assets/img/heart.png';
import commentIcon from '../src/assets/img/comment.png';
import saveIcon from '../src/assets/img/save.png';
import '../src/assets/css/feed.css';

const Feed = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesData, setLikesData] = useState([]);

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

        const fetchBookmarkedPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/content/bookmarked', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const bookmarked = new Set(response.data.map(post => post._id));
                setBookmarkedPosts(bookmarked);
            } catch (error) {
                console.error('Error fetching bookmarked posts:', error.response?.data || error.message);
            }
        };

        fetchContents();
        fetchBookmarkedPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/content/like/${postId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.status === 200) {
                const updatedLikesCount = response.data.likesCount;
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

    const timeAgo = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(date)) / 1000);
        const yearInterval = Math.floor(seconds / 31536000);
        if (yearInterval >= 1) return `${yearInterval}y`;
        const dayInterval = Math.floor(seconds / 86400);
        if (dayInterval > 7) {
            const weekInterval = Math.floor(dayInterval / 7);
            return `${weekInterval}w`;
        } else if (dayInterval > 0) {
            return `${dayInterval}d`;
        }
        const hourInterval = Math.floor(seconds / 3600);
        if (hourInterval >= 1) return `${hourInterval}h`;
        const minuteInterval = Math.floor(seconds / 60);
        if (minuteInterval >= 1) return `${minuteInterval}m`;
        return `${Math.floor(seconds)}s`;
    };

    const handleBookmark = async (postId) => {
        try {
            await axios.post(`http://localhost:8000/api/content/bookmark/${postId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBookmarkedPosts(prev => {
                const newSet = new Set(prev);
                newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
                return newSet;
            });
        } catch (error) {
            console.error('Error bookmarking post:', error.response?.data || error.message);
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

    const handleShowLikesModal = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/content/likes/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLikesData(response.data);
            setShowLikesModal(true);
        } catch (error) {
            console.error('Error fetching likes:', error.response?.data || error.message);
        }
    };

    const handleCloseLikesModal = () => {
        setShowLikesModal(false);
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
                    const userNickName = user.nickName || 'Unknown Nickname';

                    return (
                        <div key={content._id} className="feed-item-container">
                            <div className="feed-item-user-info">
                                <img
                                    src={`http://localhost:8000/profilepic/${profilePic}`}
                                    alt="Profile"
                                    className="feed-item-user-profile-pic"
                                />
                                <div className="feed-item-user-details">
                                    <span className="feed-item-user-name">
                                        {userName}
                                        <span style={{ margin: '0 0.3rem', color: 'gray', fontSize: '0.8rem' }}>•</span>
                                        <span style={{ fontSize: '0.7rem', color: 'gray' }}>{timeAgo(content.createdAt)}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="feed-item-content-body">
                                {isVideo ? (
                                    <video
                                        src={`http://localhost:8000/usersUpload/${content.fileName}`}
                                        controls
                                        autoPlay
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
                                <img
                                    src={heartIcon}
                                    alt="Like"
                                    onClick={() => handleLike(content._id)}
                                    className={`feed-item-icon ${likedPosts.has(content._id) ? 'liked' : ''}`}
                                />
                                <img
                                    src={commentIcon}
                                    alt="Comment"
                                    onClick={() => handleCommentClick(content)}
                                    className="feed-item-icon"
                                />
                                <img
                                    src={saveIcon}
                                    alt="Bookmark"
                                    onClick={() => handleBookmark(content._id)}
                                    className={`feed-item-icon ${bookmarkedPosts.has(content._id) ? 'bookmarked' : ''}`}
                                />
                            </div>

                            <div className="feed-item-likes-count" style={{ cursor: 'pointer' }} onClick={() => handleShowLikesModal(content._id)}>
                                {content.likesCount > 0 && (
                                    <>
                                        {content.likesCount} {content.likesCount === 1 ? 'like' : 'likes'}
                                    </>
                                )}
                                {content.caption && (
                                    <p className="feed-item-caption">
                                        @<span style={{ fontWeight: 600, cursor: 'pointer' }}>{userNickName}</span> {content.caption}
                                    </p>
                                )}
                            </div>
                            <div className="feed-item-divider"></div>
                        </div>
                    );
                })
            )}

            {showLikesModal && (
                <div className="feed-likes-modal">
                    <div className="feed-likes-modal-content">
                        <h2 className="feed-likes-modal-title">LIKES</h2>
                        <button className="feed-likes-modal-close" onClick={handleCloseLikesModal}>×</button>
                        <div className="feed-likes-list">
                            {likesData.map(user => (
                                <div key={user._id} className="feed-likes-item">
                                    <img
                                        src={`http://localhost:8000/profilepic/${user.profilePic || 'default-profile-pic.jpg'}`}
                                        alt={user.name}
                                        className="feed-likes-avatar"
                                    />
                                    <div className="feed-likes-info">
                                        <span className="feed-likes-name">{user.name}</span>
                                        <span className="feed-likes-nickname">@{user.nickName || 'unknown_nickname'}</span>
                                    </div>
                                    <button className="feed-likes-follow-button">Follow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
                                        autoPlay
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
                                        <span className="feed-modal-upload-time">@{selectedPost.userDetails?.nickName || 'unknown_nickname'} {timeAgo(selectedPost.createdAt)}</span>
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
                                                        <strong>{comment.author.name || 'Unknown User'}</strong>
                                                        <span style={{ color: 'gray', fontSize: '0.5rem' }} className="feed-modal-comment-timestamp">
                                                            {timeAgo(comment.timestamp)}
                                                        </span>
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
