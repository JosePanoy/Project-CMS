import React, { useState } from 'react';
import { FaHome, FaSearch, FaEnvelope, FaBell, FaUser, FaSignOutAlt, FaUpload, FaBookmark } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../src/assets/css/dashboard-main-sidebar.css';
import loadingAnimation from '../src/assets/img/loading.gif';

function DashboardSidebar({ user, onContentUpload }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLogout();
    }, 3500);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !caption) {
      alert('File and caption are required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    setLoading(true);

    try {
      await fetch('http://localhost:8000/api/content/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      alert('Upload successful');
      setFile(null);
      setCaption('');
      closeUploadModal();

      // Notify the parent component to refetch or update content
      if (onContentUpload) {
        onContentUpload();
      }
    } catch (error) {
      console.error('Error uploading content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-sidebar">
      <Link style={{ textDecoration: 'none' }} to="/dashboard">
        <h2 style={{cursor: 'pointer'}}>Panoy Socials</h2>
      </Link>
      <div className="dashboard-sidebar-content">
        <button className="dashboard-sidebar-btn" onClick={() => navigate('/dashboard')}>
          <FaHome />
          <span>Home</span>
        </button>
        <button className="dashboard-sidebar-btn">
          <FaSearch />
          <span>Search</span>
        </button>
        <button className="dashboard-sidebar-btn" onClick={() => navigate('/savedpost')}>
          <FaBookmark />
          <span>Saved</span>
        </button>
        <button className="dashboard-sidebar-btn">
          <FaEnvelope />
          <span>Messages</span>
        </button>
        <button className="dashboard-sidebar-btn">
          <FaBell />
          <span>Notifications</span>
        </button>
        <Link to="/user-profile" className="dashboard-sidebar-btn dashboard-profile-btn">
          {user && user.profilePic ? (
            <img
              src={`http://localhost:8000/profilepic/${user.profilePic}`}
              alt="Profile"
              className="dashboard-profile-pic-sidebar"
            />
          ) : (
            <FaUser />
          )}
          <span>Profile</span>
        </Link>
        <button className="dashboard-sidebar-btn dashboard-upload-btn" onClick={openUploadModal}>
          <FaUpload />
          <span>Create</span>
        </button>
        <button className="dashboard-sidebar-btn dashboard-logout-btn" onClick={openLogoutModal}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      <div className="dashboard-vertical-line"></div>

      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Upload Content</h3>
            <form onSubmit={handleUpload} className="upload-form">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="modal-input"
              />
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="modal-textarea"
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-button modal-button-upload">
                  Upload
                </button>
                <button type="button" onClick={closeUploadModal} className="modal-button modal-button-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content logout-modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={confirmLogout} className="modal-button modal-button-logout">
                Logout
              </button>
              <button onClick={closeLogoutModal} className="modal-button modal-button-cancel">
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
