import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardSidebar from './dashboard-main-navbar';


function SavePost() {
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await axios.get('/api/saved/saved', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSavedPosts(response.data);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            }
        };
        fetchSavedPosts();
    }, []);

    return (
        <>
            <DashboardSidebar />
            <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Saved Posts</h3>
            <div>
                {savedPosts.map(post => (
                    <div key={post._id}>
                        <img src={`/usersUpload/${post.fileName}`} alt={post.caption} />
                        <p>{post.caption}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default SavePost;
