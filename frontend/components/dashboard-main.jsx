import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../src/assets/css/dashboard-main.css';
import DashboardSidebar from "./dashboard-main-navbar"; // Ensure correct import path
import RightPanel from "./right-panel-dashboard";
import Feed from "./feed";

function DashboardMain() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [feedKey, setFeedKey] = useState(Date.now());

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                navigate('/');
            }
        }
    }, [navigate]);

    const handleContentUpload = () => {
        setFeedKey(Date.now()); // Change key to force Feed component to refetch
    };

    return (
        <>
            <DashboardSidebar onContentUpload={handleContentUpload} user={user} />
            <RightPanel user={user} />
            <Feed key={feedKey} />
        </>
    );
}

export default DashboardMain;
