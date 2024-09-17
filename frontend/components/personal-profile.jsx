import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/assets/css/personal-profile.css';
import DashboardSidebar from './dashboard-main-navbar';

function PersonalProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/user/info', { 
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
                });
                setUser(data);
            } catch (error) {
                setError('Error fetching user data: ' + error.response?.data?.message || error.message);
            }
        };
        fetchUserData();
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <>
            <DashboardSidebar />
            <h1 style={{ textAlign: 'center' }}>Your Profile</h1>
            <div style={{ textAlign: 'center' }}>
                {user.profilePic && <img src={`http://localhost:8000/profilepic/${user.profilePic}`} alt="Profile" style={{ maxWidth: '150px', borderRadius: '50%' }} />}
                <h2>{user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Nickname: {user.nickName}</p>
                <p>Address: {user.addr}</p>
                <p>Contact: {user.contact}</p>
                {/* Additional user info here */}
            </div>
        </>
    );
}

export default PersonalProfile;
