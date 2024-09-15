import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/css/profile.css';
import DashboardSidebar from './dashboard-main-navbar';

const Profile = () => {
    const navigate = useNavigate();

    return (
        <>
            <DashboardSidebar />

            <h1 style={{textAlign: 'center'}}></h1>
        </>
    );
};

export default Profile;
