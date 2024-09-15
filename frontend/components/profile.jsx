import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/css/profile.css';
import DashboardSidebar from './dashboard-main-navbar';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
      }
    };
  
    fetchUserProfile();
  }, [id]);
  

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <DashboardSidebar />
      <div className="profile-container">
        {/* Display user profile details */}
        <h1>{user.name}</h1>
        {/* Additional user details */}
      </div>
    </>
  );
};

export default Profile;
