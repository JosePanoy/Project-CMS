import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import '../src/assets/css/feed.css';

const Feed = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const [contentsResponse, likesResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/content/newsfeed', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    axios.get('http://localhost:8000/api/user/liked-posts', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                ]);

                const fetchedContents = contentsResponse.data;
                const likedPostsData = likesResponse.data;

                setContents(fetchedContents);
                setLikedPosts(likedPostsData.reduce((acc, postId) => {
                    acc[postId] = true;
                    return acc;
                }, {}));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch content');
                setLoading(false);
            }
        };

        fetchContents();
    }, []);

    const handleLikeClick = async (contentId) => {
        try {
            const isLiked = likedPosts[contentId];
            const response = await axios.post(
                'http://localhost:8000/api/content/like',
                { postId: contentId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setContents(contents.map(content => 
                content._id === contentId ? { ...content, ...response.data } : content
            ));

            setLikedPosts(prev => ({
                ...prev,
                [contentId]: !isLiked
            }));
        } catch (error) {
            console.error('Error liking post:', error);
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

                    const isLiked = likedPosts[content._id];

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
                                    />
                                    <FaComment
                                        className="feed-item-icon feed-item-comment-icon"
                                        onClick={() => setSelectedContent(content)}
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
                                        className={`feed-modal-icon feed-modal-heart-icon ${likedPosts[selectedContent._id] ? 'liked' : ''}`} 
                                        onClick={() => handleLikeClick(selectedContent._id)} 
                                    />
                                    <FaComment className="feed-modal-icon feed-modal-comment-icon" />
                                </div>
                                <span className="feed-modal-upload-time">
                                    {new Date(selectedContent.createdAt).toLocaleString('en-US', { month: 'short' })} {new Date(selectedContent.createdAt).getDate()}, {new Date(selectedContent.createdAt).getFullYear()} {new Date(selectedContent.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                                <div className="feed-modal-comments-section">
                                    <input type="text" placeholder="Add a comment..." className="feed-modal-comment-input" />
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
