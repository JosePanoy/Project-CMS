import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardSidebar from './dashboard-main-navbar';

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
            <div className="personal-profile-container">
                <h2>{userInfo.name}'s Profile</h2>
                <img
                    src={`http://localhost:8000/profilepic/${userInfo.profilePic || 'default-profile-pic.jpg'}`}
                    alt="Profile"
                    className="personal-profile-pic"
                />
                <div className="personal-profile-details">
                    <p><strong>Username:</strong> {userInfo.nickName}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Address:</strong> {userInfo.addr}</p>
                    <p><strong>Contact:</strong> {userInfo.contact}</p>
                </div>
            </div>
        </>
    );
}

export default PersonalProfile;
