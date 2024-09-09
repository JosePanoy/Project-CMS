import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment } from 'react-icons/fa';
import '../src/assets/css/feed.css';

const Feed = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [selectedPost, setSelectedPost] = useState(null);

    const fetchContents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/content/newsfeed', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
    
            // Sort posts by creation date in descending order
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
    
    

    useEffect(() => {
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
                    if (prev.has(postId)) {
                        newSet.delete(postId);
                    } else {
                        newSet.add(postId);
                    }
                    return newSet;
                });
            } else {
                console.error('Error liking post:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error liking post:', error.response?.data || error.message);
        }
    };

    const handleCommentClick = (post) => {
        setSelectedPost(post);
    };
    
    const handleCloseModal = () => {
        setSelectedPost(null);
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
                    const formattedDate = date.toLocaleString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    });

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
                            </div>
                            <div className="feed-item-actions">
                                <FaHeart
                                    onClick={() => handleLike(content._id)}
                                    style={{ color: likedPosts.has(content._id) ? 'red' : 'black', cursor: 'pointer' }}
                                />
                                <FaComment
                                    onClick={() => handleCommentClick(content)}
                                    className="feed-item-comment-icon"
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
                            <div className="feed-modal-right">
                                <div className="feed-modal-header">
                                    <img
                                        src={`http://localhost:8000/profilepic/${selectedPost.userDetails?.profilePic || 'default-profile-pic.jpg'}`}
                                        alt="Profile"
                                        className="feed-modal-profile-pic"
                                    />
                                    <div className="feed-modal-user-info">
                                        <span className="feed-modal-user-name">{selectedPost.userDetails?.name || 'Unknown User'}</span>
                                        <span className="feed-modal-user-nickname">@{selectedPost.userDetails?.nickName || 'unknown_nickname'}</span>
                                        <span className="feed-modal-upload-time">
                                            {new Date(selectedPost.createdAt).toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="feed-modal-separator"></div>
                                <p className="feed-modal-caption">{selectedPost.caption}</p>
                                <div className="feed-modal-comments-section">
                                    <div className="feed-modal-comments">
                                        {/* Placeholder for comments */}
                                    </div>
                                    <div className="feed-modal-add-comment">
                                        <textarea className="feed-modal-comment-input" placeholder="Add a comment..."></textarea>
                                        <button>Post</button>
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
