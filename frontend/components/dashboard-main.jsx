import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../src/assets/css/dashboard-main.css';
import DashboardSidebar from "./dashboard-main-navbar";
import RightPanel from "./right-panel-dashboard";
import UserContent from "./dashboard-timeline";



function DashboardMain() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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

    return (
      <>
        <DashboardSidebar user={user}/>
        <RightPanel user={user} />
        <UserContent />


      </>
    );
}

export default DashboardMain;
