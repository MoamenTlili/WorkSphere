import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { BellIcon } from "@heroicons/react/24/outline";
import PostModal from "./PostModal";

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const NotificationText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const NotificationsContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ $isRead, theme }) => ($isRead ? theme.cardBg : theme.hover)};
  opacity: ${({ $isRead }) => ($isRead ? 0.7 : 1)};
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary}15;
  }
`;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications(); 
  }, []); 


  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:3001/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNotifications(response.data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [isOpen]); 

  const handleNotificationClick = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPost(response.data); 
      setIsOpen(false); 
    } catch (error) {
      console.error("Failed to fetch post:", error);
      console.log("Post ID:", postId); 
      alert("Post not found or deleted."); 
    }
  };
  
  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3001/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <div style={{ position: "relative" }}>
        <BellIcon className="h-6 w-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            {unreadCount}
          </div>
        )}
      </div>
      {isOpen && (
        <NotificationsContainer>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              $isRead={notification.isRead}
              onClick={() => {
                handleNotificationClick(notification.postId); 
                handleMarkAsRead(notification._id); 
              }}
            >
              <NotificationContent>
                <NotificationImage
                  src={`http://localhost:3001${notification.senderPicture}`}
                  alt={notification.senderName}
                />
                <NotificationText>{notification.message}</NotificationText>
              </NotificationContent>
            </NotificationItem>
          ))}
        </NotificationsContainer>
      )}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
};

export default Notifications;