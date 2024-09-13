import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../src/assets/css/signup.css'; 
import Navbar from './navbar';
import loginAnimation from '../src/assets/img/loading.gif';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        nickName: '',
        addr: '',
        email: '',
        contact: '',
        password: '',
        profilePic: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, nickName, addr, email, contact, password, profilePic } = formData;
        
        if (!name || !nickName || !addr || !email || !contact || !password) {
            setError('All fields are required');
            return;
        }
   
        const data = new FormData();
        data.append('name', name);
        data.append('nickName', nickName);
        data.append('addr', addr);
        data.append('email', email);
        data.append('contact', contact);
        data.append('password', password);
        if (profilePic) data.append('profilePic', profilePic);
    
        setLoading(true); 
        try {
            await axios.post('http://localhost:8000/api/users/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Registration successful!');
            setFormData({
                name: '',
                nickName: '',
                addr: '',
                email: '',
                contact: '',
                password: '',
                profilePic: null
            });
            setTimeout(() => {
                setLoading(false); 
                setSuccess('');
                setError('');
                navigate('/login');
            }, 3500);
        } catch (error) {
            setLoading(false); 
            setError('Failed to register. Please try again.');
            console.error(error);
        }
    };
    
    return (
        <>
        <Navbar />
        <div className="signup-container">
            <h2 className="signup-title">Panoy Socials</h2>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    <FaUser className="form-icon" />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="nickName"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                        placeholder="Nickname"
                        required
                    />
                    <FaUser className="form-icon" />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="addr"
                        name="addr"
                        value={formData.addr}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                    />
                    <FaMapMarkerAlt className="form-icon" />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <FaEnvelope className="form-icon" />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Contact"
                        required
                    />
                    <FaPhone className="form-icon" />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <FaLock className="form-icon" />
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '15px' }}>
                Already have an account? 
                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}> Log In</Link>
            </p>
        </div>
        {loading && (
            <div className="loading-overlay">
                <img src={loginAnimation} alt="Loading" />
            </div>
        )}
        </>
    );
}

export default Signup;
