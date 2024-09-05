import React, { useEffect, useState } from "react";
import axios from "axios";
import '../src/assets/css/save-post.css';
import DashboardSidebar from "./dashboard-main-navbar";

function SavePost() {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSavedPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/content/saved', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSavedPosts(response.data);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
            setError('Failed to fetch saved posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    if (loading) {
        return <div className="save-post-loading">Loading...</div>;
    }

    if (error) {
        return <div className="save-post-error">{error}</div>;
    }

    return (
        <>
            <DashboardSidebar />
            <h3 className="saved-posts-header">Saved Posts</h3>
            <div className="saved-posts-container">
                {savedPosts.length === 0 ? (
                    <p className="no-saved-posts">You have no saved posts.</p>
                ) : (
                    savedPosts.map(post => {
                        const isVideo = post.fileName.endsWith('.mp4');
                        const userDetails = post.userDetails || {};
                        const profilePic = userDetails.profilePic || 'default-profile-pic.jpg';
                        const userName = userDetails.name || 'Unknown User';

                        return (
                            <div key={post._id} className="saved-post-item">
                                <div className="saved-post-user-info">
                                    <img
                                        src={`http://localhost:8000/profilepic/${profilePic}`}
                                        alt="Profile"
                                        className="saved-post-user-profile-pic"
                                    />
                                    <div className="saved-post-user-details">
                                        <span className="saved-post-user-name">{userName}</span>
                                        <span className="saved-post-post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="saved-post-content-body">
                                    {post.caption && <p className="saved-post-caption">{post.caption}</p>}
                                    {isVideo ? (
                                        <video
                                            src={`http://localhost:8000/usersUpload/${post.fileName}`}
                                            controls
                                            className="saved-post-content-media"
                                        />
                                    ) : (
                                        <img
                                            src={`http://localhost:8000/usersUpload/${post.fileName}`}
                                            alt={post.caption}
                                            className="saved-post-content-image"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default SavePost;
