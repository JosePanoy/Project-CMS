import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../src/assets/css/signup.css'; // Make sure your CSS file is correct
import Navbar from './navbar';

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
                setSuccess('');
                setError('');
                navigate('/login');
            }, 5000);
        } catch (error) {
            setError('Failed to register. Please try again.');
            console.error(error);
        }
    };
    
    return (
        <>
        <Navbar />
        <div className="signup-container">
            <h2>Sign Up</h2>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name"><FaUser /> Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nickName"><FaUser /> Nickname</label>
                    <input
                        type="text"
                        id="nickName"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="addr"><FaMapMarkerAlt /> Address</label>
                    <input
                        type="text"
                        id="addr"
                        name="addr"
                        value={formData.addr}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email"><FaEnvelope /> Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contact"><FaPhone /> Contact</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"><FaLock /> Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profilePic">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
        </>
    );
}

export default Signup;
