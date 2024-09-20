import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardSidebar from './dashboard-main-navbar';
import '../src/assets/css/profile.css';

function PersonalProfile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user info:', error);
                setError('Failed to fetch user info');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <DashboardSidebar />
            <div className="unique-profile-container">
                <div className="unique-profile-header">
                    <img
                        src={`http://localhost:8000/profilepic/${userInfo.profilePic || 'default-profile-pic.jpg'}`}
                        alt="Profile"
                        className="unique-profile-pic"
                    />
                    <div className="unique-profile-info">
                        <div className="unique-username-group">
                            <h2 className="unique-username">{userInfo.name}</h2>
                            <div className="unique-button-group">
                                <button className="unique-message-button">Message</button>
                                <button className="unique-follow-button">
                                    Follow <span className="unique-arrow-down">▼</span>
                                </button>
                            </div>
                        </div>
                        <p className="unique-nickname">@&nbsp;{userInfo.nickName}</p>
                        <div className="unique-stats">
                    <span><strong>Posts:</strong> 0</span>
                    <span><strong>Followers:</strong> 0</span>
                    <span><strong>Following:</strong> 0</span>
                </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PersonalProfile;
