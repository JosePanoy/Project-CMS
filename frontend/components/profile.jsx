import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/css/profile.css'; // Ensure this file includes styles for the unique class names
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from './dashboard-main-navbar';

function Profile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/profile/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to load user profile. Please try again later.');
            }
        };

        fetchUserProfile();
    }, [id]);

    if (error) return <p className="profile-error">{error}</p>;
    if (!user) return <p className="profile-loading">Loading...</p>;

    return (
        <>
            <DashboardSidebar />

            <div className="profile-container">
                <h1 className="profile-name">{user.name}</h1>
                <h2 className="profile-nickname">{user.nickName}</h2>
                <div className="profile-image-container">
                    <img
                        src={`http://localhost:8000/profilepic/${user.profilePic}`}
                        alt="Profile"
                        className="profile-image"
                    />
                </div>
                <h3 className="profile-media-title">Uploaded Media:</h3>
                <div className="profile-media-container">
                    {user.contents.map((content, index) => (
                        <div key={index} className="profile-media-item">
                           <img
                            src={`http://localhost:8000/usersUpload/${content.filePath}`}
                            alt={content.caption}
                            className="profile-media-image"
                            />
                            <p className="profile-media-caption">{content.caption}</p>
                            <small className="profile-media-date">
                                {new Date(content.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Profile;
