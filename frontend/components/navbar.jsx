import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../src/assets/css/navbar.css';

function Navbar() {
    const [showPanel, setShowPanel] = useState(false);

    const togglePanel = () => {
        setShowPanel(!showPanel);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
            </div>
            <div className="navbar-center">
                <Link to="/" className="nav-button">Home</Link>
                <Link to="/about" className="nav-button">About</Link>
            </div>
            <div className="navbar-right">
                <FaBars className="menu-icon" onClick={togglePanel} />
            </div>
            {showPanel && (
                <div className="navbar-panel">
                    <Link to="/login" className="panel-button">Log In</Link>
                    <Link to="/signup" className="panel-button">Sign Up</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
