import React, { useState } from 'react';
import { FaHome, FaSearch, FaEnvelope, FaBell, FaUser, FaSignOutAlt, FaUpload } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../src/assets/css/dashboard-main-sidebar.css';
import loadingAnimation from '../src/assets/img/loading.gif';

function DashboardSidebar({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const goHome = () => {
    navigate('/dashboard');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openLogoutConfirmModal = () => setIsLogoutConfirmOpen(true);
  const closeLogoutConfirmModal = () => setIsLogoutConfirmOpen(false);

  const confirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLogout();
    }, 3500); // 3.5 seconds delay
  };

  return (
    <div className="sidebar">
      <Link style={{ textDecoration: 'none' }} to="/dashboard">
        <h2>Panoy Socials</h2>
      </Link>
      <div className="sidebar-content">
        <button className="sidebar-btn" onClick={goHome}>
          <FaHome />
          <span>Home</span>
        </button>
        <button className="sidebar-btn">
          <FaSearch />
          <span>Search</span>
        </button>
        <button className="sidebar-btn">
          <FaEnvelope />
          <span>Messages</span>
        </button>
        <button className="sidebar-btn">
          <FaBell />
          <span>Notifications</span>
        </button>
        <Link to="/user-profile" className="sidebar-btn profile-btn">
          {user && user.profilePic ? (
            <img
              src={`http://localhost:8000/profilepic/${user.profilePic}`}
              alt="Profile"
              className="profile-pic-sidebar"
            />
          ) : (
            <FaUser />
          )}
          <span>Profile</span>
        </Link>
        <button className="sidebar-btn upload-btn" onClick={openModal}>
          <FaUpload />
          <span>Create</span>
        </button>
        <button className="sidebar-btn logout-btn" onClick={openLogoutConfirmModal}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      <div className="vertical-line"></div>

      {isModalOpen && (
        <div className="modal-overlay-create">
          <div className="modal-content-create">
            <h3>Upload Content</h3>
            <p>The upload functionality has been removed. This modal is now used for other purposes.</p>
            <div className="modal-buttons-create">
              <button onClick={closeModal} className="modal-btn-create cancel-btn-create">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isLogoutConfirmOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-buttons">
              <button onClick={confirmLogout} className="logout-confirm-btn">
                Logout
              </button>
              <button onClick={closeLogoutConfirmModal} className="logout-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <img src={loadingAnimation} alt="Loading" />
        </div>
      )}
    </div>
  );
}

export default DashboardSidebar;
