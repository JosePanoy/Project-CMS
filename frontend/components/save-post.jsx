import React, { useEffect, useState } from "react";
import axios from "axios";
import '../src/assets/css/save-post.css';
import DashboardSidebar from "./dashboard-main-navbar";

function SavePost() {


    return (
        <>
            <DashboardSidebar />
            <h3 className="saved-posts-header">Saved Posts</h3>
           
        </>
    );
}

export default SavePost;
