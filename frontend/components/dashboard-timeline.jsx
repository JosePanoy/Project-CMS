import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/assets/css/dashboard-timeline.css';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa'; // Import icons

function DashboardTimeline() {
    const [content, setContent] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch content data
                const contentResponse = await axios.get('http://localhost:8000/api/content', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const contentData = contentResponse.data;

                // Fetch user data
                const userIds = [...new Set(contentData.map(item => item.userId))];
                const usersResponse = await Promise.all(
                    userIds.map(userId => axios.get(`http://localhost:8000/api/users/${userId}`))
                );
                const usersData = usersResponse.reduce((acc, response) => {
                    acc[response.data._id] = response.data;
                    return acc;
                }, {});

                setContent(contentData);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const options = { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    return (
        <div className="timeline-container">
            {content.map((item) => {
                const user = users[item.userId];
                const contentUrl = `http://localhost:8000/usersUpload/${item.contentFile}`;
                const createdAtFormatted = formatDate(item.createdAt);

                return (
                    <div className="post-card" key={item._id}>
                        <div className="post-header">
                            <img
                                src={user ? `http://localhost:8000/profilepic/${user.profilePic}` : 'default-profile-pic.png'}
                                alt="User profile"
                                className="post-profile-pic"
                            />
                            <div className="post-user-info">
                                <span className="post-user-name">
                                    {user ? user.name : 'Anonymous'}
                                </span>
                                <span className="post-created-at">
                                    {createdAtFormatted}
                                </span>
                            </div>
                        </div>
                        <p className="post-caption">{item.caption}</p>
                        <div className="post-content">
                            {item.contentFile.endsWith('.jpg') || item.contentFile.endsWith('.png') ? (
                                <img
                                    src={contentUrl}
                                    alt="User content"
                                    className="post-image"
                                />
                            ) : item.contentFile.endsWith('.mp4') ? (
                                <video
                                    src={contentUrl}
                                    controls
                                    className="post-video"
                                />
                            ) : (
                                <p>Unknown content type</p>
                            )}
                        </div>
                        <div className="post-actions">
                        <FaHeart className="action-icon" />
                        <FaComment className="action-icon" />
                        <FaBookmark className="action-icon save-icon" /> 
                        </div>

                    </div>
                );
            })}
        </div>
    );
}

export default DashboardTimeline;
