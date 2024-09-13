import React from "react";
import '../src/assets/css/dash-notification.css';
import DashboardSidebar from "./dashboard-main-navbar";

function Notification() {

return(
    <>
    <DashboardSidebar />
    <h2 style={{ textAlign: 'center', marginTop: '50px'}}>Notifications</h2>
    </>
    );
}

export default Notification;