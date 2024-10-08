import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/assets/css/dash-notification.css';
import DashboardSidebar from './dashboard-main-navbar';

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

function Notification() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/content/notifications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <>
            <DashboardSidebar />
            <h2 className="notifications-title">Notifications</h2>
            <div className="notifications-container">
                {notifications.map((notification) => (
                    <div key={notification._id} className="notification-item">
                        {notification.interactingUserDetails && (
                            <div className="notification-content">
                                <img 
                                    src={`http://localhost:8000/profilepic/${notification.interactingUserDetails.profilePic}`} 
                                    alt="User Avatar" 
                                    className="notification-avatar" 
                                />
                                <div className="notification-text">
                                    <span className="notification-user-name">
                                        {notification.interactingUserDetails.name}
                                    </span>
                                    <span className="notification-message">
                                        {notification.message}
                                    </span>
                                    <span className="notification-timestamp">
                                        <span className="dot">•</span> {timeAgo(notification.timestamp)}
                                    </span>
                                </div>
                                {notification.contentDetails && (
                                    <div className="notification-thumbnail">
                                        {notification.contentDetails.fileName.endsWith('.mp4') ? (
                                            <video
                                                className="thumbnail-video"
                                                src={`http://localhost:8000/usersUpload/${notification.contentDetails.fileName}`}
                                                controls
                                                alt="Content Thumbnail"
                                            />
                                        ) : (
                                            <img
                                                src={`http://localhost:8000/usersUpload/${notification.contentDetails.fileName}`}
                                                alt="Content Thumbnail"
                                                className="thumbnail-image"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Notification;
