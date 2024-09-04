import React from 'react';
import '../src/assets/css/user-profile.css'; 
import DashboardMainNavbar from './dashboard-main-navbar';


function UserProfile() {

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <DashboardMainNavbar user={user} />
      <div className="user-profile-container">
        <div className="profile-header">
          <div className="profile-pic-container">
            {user.profilePic ? (
              <img
                src={`http://localhost:8000/profilepic/${user.profilePic}`}
                alt="Profile"
                className="profile-pic-user"
              />
            ) : (
              <div className="profile-pic-placeholder">No Profile Pic</div>
            )}
          </div>
          <div className="profile-info-user">
            <div className="profile-info-header">
              <h1 className="profile-username">{user.name}</h1>
              <button className="profile-edit-btn">Edit Profile</button>
            </div>
            <div className="profile-stats">
              <span className="profile-posts">Posts: </span>
              <span className="profile-followers">Followers:</span>
              <span className="profile-following">Following: </span>
            </div>
            <blockquote className="profile-quote">
              "Keep pushing forward!"
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
