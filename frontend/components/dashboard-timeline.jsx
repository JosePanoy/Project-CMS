import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/assets/css/dashboard-timeline.css';

const UserContent = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/content/all-content', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setContents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user content:', error);
                setError('Failed to fetch content');
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-content">
            {contents.length === 0 ? (
                <p>No content available</p>
            ) : (
                contents.map((content) => {
                    const isVideo = content.fileName && content.fileName.endsWith('.mp4');
                    const date = new Date(content.createdAt);
                    const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getHours() % 12 || 12}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
                    
                    return (
                        <div key={content._id} className="content-item">
                            <div className="user-info">
                                {content.userId && content.userId.profilePic ? (
                                    <img
                                        src={`http://localhost:8000/profilepic/${content.userId.profilePic}`}
                                        alt="Profile"
                                        className="user-profile-pic"
                                    />
                                ) : (
                                    <div className="user-profile-pic-placeholder">No Pic</div>
                                )}
                                <div className="user-details">
                                    <span className="user-name">{content.userId ? content.userId.name : 'Unknown User'}</span>
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

                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default UserContent;
