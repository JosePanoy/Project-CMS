import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/css/profile.css';
import DashboardSidebar from './dashboard-main-navbar';

const UsersProfile = () => {
    const { userId } = useParams(); 
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError('No userId provided');
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserData(response.data);
            } catch (error) {
                setError('Error fetching user data: ' + (error.response?.data?.message || error.message));
            }
        };
    
        fetchUserData();
    }, [userId]);

    if (error) return <div className="user-profile-error">{error}</div>;
    if (!userData) return <div className="user-profile-loading">Loading...</div>;

    const contents = userData.contents || [];

    return (
        <>
            <DashboardSidebar />
            <div className="user-profile-container">
                <div className="user-profile-header">
                    <div className="user-profile-picture">
                        {userData.profilePic && <img src={`http://localhost:8000/profilepic/${userData.profilePic}`} alt="Profile" />}
                    </div>
                    <div className="user-profile-details">
                        <div className="user-profile-header-top">
                            <h1 className="user-profile-username">{userData.name}</h1>
                            <button className="user-profile-follow-button">Follow</button>
                        </div>
                        <p className="user-profile-nickname">@{userData.nickName}</p>
                        <div className="user-profile-stats">
                            <div className="user-profile-stat">
                                <strong>Posts:</strong> {contents.length}
                            </div>
                            <div className="user-profile-stat">
                                <strong>Followers:</strong> {followersCount}
                            </div>
                            <div className="user-profile-stat">
                                <strong>Following:</strong> {followingCount}
                            </div>
                        </div>
                        <div className="user-profile-followed-by">
                            <strong>Followed by:</strong> [Placeholder for followed-by list]
                        </div>
                    </div>
                </div>
                <div className="user-profile-contents">
                    {contents.length > 0 ? (
                        contents.map((content, index) => (
                            <div key={index} className="user-profile-content">
                                <img src={`http://localhost:8000/usersUpload/${content.fileName}`} alt={content.caption} />
                                <p>{content.caption}</p>
                                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p>No content available</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UsersProfile;
