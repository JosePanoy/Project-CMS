import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/assets/css/dash-notification.css';
import DashboardSidebar from './dashboard-main-navbar';

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
            <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Notifications</h2>
            <div className="notifications-container">
                {notifications.map((notification) => (
                    <div key={notification._id} className="notification-item">
                        <img 
                            src={`http://localhost:8000/profilepic/${notification.userProfilePic}`} 
                            alt="User Avatar" 
                            className="notification-avatar" 
                        />
                        <div className="notification-text">
                            <span className="notification-user-name">{notification.userName}</span> 
                            {notification.message}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Notification;
