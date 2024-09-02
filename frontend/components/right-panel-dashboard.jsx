import React, { useEffect, useState } from 'react';
import '../src/assets/css/right-panel-dashboard.css';
import { Link } from 'react-router-dom';

function RightPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="right-panel">
      <div className="profile-info">
        {user && user.profilePic ? (
          <Link to="/user-profile">
            <img
              src={`http://localhost:8000/profilepic/${user.profilePic}`}
              alt="Profile"
              className="profile-pic"
            />
          </Link>
        ) : (
          <Link to="/user-profile">
            <div className="profile-pic default-pic"></div>
          </Link>
        )}
        <Link style={{ textDecoration: 'none' }} to="/user-profile">
          <div className="username-container">
            <span className="username-user">{user ? user.name : 'Guest'}</span>
            <span className="username-nickname">
              {user ? user.nickName : 'Guest'}
            </span>
          </div>
        </Link>
      </div>
      <h2>Suggested For You</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div key={user._id} className="user-item">
              <p className="user-name">{user.name}</p>
              <button className="follow-btn">Follow</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RightPanel;
