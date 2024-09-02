import React, { useState } from 'react';
import { FaHome, FaSearch, FaEnvelope, FaBell, FaUser, FaSignOutAlt, FaUpload } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/css/dashboard-main-sidebar.css'; // Adjust the path as needed

function DashboardSidebar({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
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
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setCaption('');
  };

  const openLogoutConfirmModal = () => setIsLogoutConfirmOpen(true);
  const closeLogoutConfirmModal = () => setIsLogoutConfirmOpen(false);

  const confirmLogout = () => {
    handleLogout();
    closeLogoutConfirmModal();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !caption) {
        alert('Please upload a file and add a caption.');
        return;
    }

    const formData = new FormData();
    formData.append('contentFile', file);
    formData.append('caption', caption);
    formData.append('contentType', file.type.startsWith('image/') ? 'image' : 'video');
    formData.append('userId', user._id);

    try {
        await axios.post('http://localhost:8000/api/userupload/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        
        alert('Content uploaded successfully!');
        closeModal();
    } catch (error) {
        alert('Failed to upload content.');
        console.error('Upload Error:', error.response?.data.message || error.message);
    }
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
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="file-input-create"
            />
            <textarea
              placeholder="Enter caption"
              className="caption-input-create"
              value={caption}
              onChange={handleCaptionChange}
            />
            <div className="modal-buttons-create">
              <button onClick={handleUpload} className="modal-btn-create upload-btn-create">
                Upload
              </button>
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
    </div>
  );
}

export default DashboardSidebar;
