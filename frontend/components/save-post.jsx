import React, { useEffect, useState } from "react";
import axios from "axios";
import '../src/assets/css/save-post.css';
import DashboardSidebar from "./dashboard-main-navbar";

const SavePost = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/content/bookmarked', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSavedPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching saved posts:', error.response?.data || error.message);
                setError('Failed to fetch saved posts');
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    if (loading) return <div className="saved-posts-loading">Loading...</div>;
    if (error) return <div className="saved-posts-error">{error}</div>;

    return (
        <>
            <DashboardSidebar />
            <h3 className="saved-posts-header" style={{marginTop: '50px'}}>Saved Posts</h3>
            <div className="saved-posts-container">
                {savedPosts.length === 0 ? (
                    <p>No saved posts available</p>
                ) : (
                    savedPosts.map(post => (
                        <div key={post._id} className="saved-post-item">
                            <div className="saved-post-user-info">
                                <img
                                    src={`http://localhost:8000/profilepic/${post.userId?.profilePic || 'default-profile-pic.jpg'}`}
                                    alt="Profile"
                                    className="saved-post-user-profile-pic"
                                />
                                <div className="saved-post-user-details">
                                    <span className="saved-post-user-name">{post.userId?.name || 'Unknown User'}</span>
                                </div>
                            </div>
                            <div className="saved-post-content-body">
                                {post.caption && <p className="saved-post-caption">{post.caption}</p>}
                                {post.fileName && post.fileName.endsWith('.mp4') ? (
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
                    ))
                )}
            </div>
        </>
    );
}

export default SavePost;
