import React from 'react';
import '../src/assets/css/home.css';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="home-title">Welcome to Panoy Socials</h1>
                <p className="intro-text">
                    Connect, share, and interact with friends on our innovative social media platform. Explore features
                    like user profiles, news feeds, and real-time updates.
                </p>
                <p className="intro-text">
                    Stay tuned as we bring exciting new features and enhancements to enhance your social experience.
                </p>
                <Link to="/login" className="explore-button">Explore Now</Link>
            </div>
        </div>
    );
}

export default Home;
