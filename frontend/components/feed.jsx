import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import '../src/assets/css/feed.css';

const Feed = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/content/newsfeed', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setContents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching newsfeed:', error);
                setError('Failed to fetch content');
                setLoading(false);
            }
        };

        fetchContents();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleCommentClick = (content) => {
        setSelectedContent(content);
    };

    const closeModal = () => {
        setSelectedContent(null);
    };
    

    return (
        <div className="feed">
            {contents.length === 0 ? (
                <p>No content available</p>
            ) : (
                contents.map(content => {
                    const isVideo = content.fileName.endsWith('.mp4');
                    const date = new Date(content.createdAt);
                    const formattedDate = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

                    const user = content.userDetails || {};
                    const profilePic = user.profilePic || 'default-profile-pic.jpg';
                    const userName = user.name || 'Unknown User';

                    return (
                        <div key={content._id} className="feed-item">
                            <div className="user-info">
                                <img
                                    src={`http://localhost:8000/profilepic/${profilePic}`}
                                    alt="Profile"
                                    className="user-profile-pic"
                                />
                                <div className="user-details">
                                    <span className="user-name">{userName}</span>
                                    <span className="post-date">{formattedDate}</span>
                                </div>
                            </div>
                            <div className="content-body">
                                {content.caption && <p className="caption">{content.caption}</p>}
                                {isVideo ? (
                                    <video
                                        src={`http://localhost:8000/usersUpload/${content.fileName}`}
                                        controls
                                        className="content-media"
                                    />
                                ) : (
                                    <img
                                        src={`http://localhost:8000/usersUpload/${content.fileName}`}
                                        alt={content.caption}
                                        className="content-image"
                                    />
                                )}
                                <div className="icons">
                                    <FaHeart className="icon heart-icon" />
                                    <FaComment
                                        className="icon comment-icon"
                                        onClick={() => handleCommentClick(content)}
                                    />
                                    <FaBookmark className="icon save-icon" />
                                </div>
                            </div>
                            <div className="divider"></div>
                        </div>
                    );
                })
            )}
            {selectedContent && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="modal-body">
                            <img
                                src={`http://localhost:8000/usersUpload/${selectedContent.fileName}`}
                                alt={selectedContent.caption}
                                className="modal-image"
                            />
                            <div className="modal-right">
                                <div className="modal-header">
                                    <img
                                        src={
                                            selectedContent.userDetails.profilePic
                                            ? `http://localhost:8000/profilepic/${selectedContent.userDetails.profilePic}`
                                            : 'http://localhost:8000/profilepic/default-profile-pic.jpg'
                                        }
                                        alt="Profile"
                                        className="modal-profile-pic"
                                    />
                                    <div className="modal-user-info">
                                        <span className="modal-user-name">{selectedContent.userDetails.name}</span>
                                        <span className="modal-user-nickname">@{selectedContent.userDetails.nickName}</span>
                                    </div>
                                </div>
                                <div className="separator"></div>
                                <p className="modal-caption">{selectedContent.caption}</p>
                                <div className="modal-icons">
                                    <FaHeart className="icon heart-icon" />
                                    <FaComment className="icon comment-icon" />
                                </div>
                                <span className="upload-time">
                                    {new Date(selectedContent.createdAt).toLocaleString('en-US', { month: 'short' })} {new Date(selectedContent.createdAt).getDate()}, {new Date(selectedContent.createdAt).getFullYear()} {new Date(selectedContent.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                                <div className="comments-section">
                                    <input type="text" placeholder="Add a comment..." className="comment-input" />
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
