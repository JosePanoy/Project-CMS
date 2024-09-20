import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardSidebar from "./dashboard-main-navbar";
import "../src/assets/css/profile.css";

function PersonalProfile() {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userContent, setUserContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user info");
        setLoading(false);
      }
    };

    const fetchUserContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/content/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserContent(response.data);
      } catch (error) {
        setError("Failed to fetch user content");
      }
    };

    fetchUserInfo();
    fetchUserContent();
  }, [userId]);

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const yearInterval = Math.floor(seconds / 31536000);
    if (yearInterval >= 1) return `${yearInterval}y`;
    const dayInterval = Math.floor(seconds / 86400);
    if (dayInterval > 7) {
      const weekInterval = Math.floor(dayInterval / 7);
      return `${weekInterval}w`;
    } else if (dayInterval > 0) {
      return `${dayInterval}d`;
    }
    const hourInterval = Math.floor(seconds / 3600);
    if (hourInterval >= 1) return `${hourInterval}h`;
    const minuteInterval = Math.floor(seconds / 60);
    if (minuteInterval >= 1) return `${minuteInterval}m`;
    return `${Math.floor(seconds)}s`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <DashboardSidebar />
      <div className="unique-profile-container">
        <div className="unique-profile-header">
          <img
            src={`http://localhost:8000/profilepic/${
              userInfo.profilePic || "default-profile-pic.jpg"
            }`}
            alt="Profile"
            className="unique-profile-pic"
          />
          <div className="unique-profile-info">
            <div className="unique-username-group">
              <h2 className="unique-username">{userInfo.name}</h2>
              <div className="unique-button-group">
                <button className="unique-message-button">Message</button>
                <button className="unique-follow-button">
                  Follow <span className="unique-arrow-down">▼</span>
                </button>
              </div>
            </div>
            <p className="unique-nickname">@&nbsp;{userInfo.nickName}</p>
            <div className="unique-stats">
              <span>
                <strong>Posts:</strong> {userContent.length}
              </span>
              <span>
                <strong>Followers:</strong> 0
              </span>
              <span>
                <strong>Following:</strong> 0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="unique-user-content">
    {userContent.length > 0 ? (
        userContent.map((content) => (
            <div key={content._id} className="unique-content-item">
                <div className="unique-image-wrapper">
                    {content.type === "video" ? (
                        <video
                            src={`http://localhost:8000/usersUpload/${content.fileName}`}
                            controls
                            className="unique-content-media"
                        />
                    ) : (
                        <img
                            src={`http://localhost:8000/usersUpload/${content.fileName}`}
                            alt={content.caption}
                            className="unique-content-image"
                        />
                    )}
                </div>
                <div className="unique-content-info">
                    <p className="unique-content-caption">
                        {content.caption}
                        <span
                            style={{
                                marginLeft: "0.5rem",
                                color: "gray",
                                fontSize: "0.8rem",
                            }}
                        >
                            •
                        </span>
                        <span
                            style={{
                                fontSize: "0.9rem",
                                color: "gray",
                                marginLeft: "5px",
                            }}
                        >
                            {timeAgo(content.createdAt)}
                        </span>
                    </p>
                </div>
            </div>
        ))
    ) : (
        <p>No content uploaded.</p>
    )}
</div>

    </>
  );
}

export default PersonalProfile;
