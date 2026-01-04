import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Post from "../components/Post";
import PostForm from "../components/PostForm";
import UserListSidebar from "../components/UserListSidebar";
import { useContentWarning } from '../components/ContentWarningContext'; 

const FeedContainer = styled.div`
  padding-top: 80px; /* Account for fixed Navbar */
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  transition: background 0.3s ease;
  display: flex;
  justify-content: center; /* Centers ContentWrapper if its max-width is less than viewport */
`;

const ContentWrapper = styled.div`
  display: flex;
  max-width: 1200px; /* Overall max-width for main content + sidebar */
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem; /* Padding around the main content and sidebar area */
  gap: 2rem; /* Space between MainContent and SidebarWrapper */
`;

const MainContent = styled.div`
  flex: 1; /* Allows MainContent to grow and take available space */
  max-width: 800px; /* Or your preferred max-width for the feed itself */
  /* No specific padding here, as ContentWrapper and internal components handle it */
`;

const SidebarWrapper = styled.div`
  width: 320px; /* Fixed width for the sidebar */
  position: sticky; /* Makes the sidebar sticky as the page scrolls */
  top: 100px; /* Starts 100px from the top (Navbar height + 20px spacing) - adjust as needed */
  height: calc(100vh - 120px); /* Example: Full viewport height minus navbar and some padding, enables internal scroll if content overflows */
  overflow-y: auto; /* Allow sidebar to scroll if its content is too long */
`;

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostImageFile, setNewPostImageFile] = useState(null);
  const userId = localStorage.getItem("userId");
  const showWarning = useContentWarning(); 

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      showWarning("Could not load feed. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPosts(); 
    const handleNewPostEvent = () => {
      console.log("newPostCreated event received in Feed.jsx, fetching posts...");
      fetchPosts();
    };
    window.addEventListener('newPostCreated', handleNewPostEvent);

    return () => {
      window.removeEventListener('newPostCreated', handleNewPostEvent);
    };
  }, []); 
  const handlePostSubmit = async () => { 
    if (!newPostDescription.trim() && !newPostImageFile) {
        showWarning("Cannot submit an empty post.");
        return; 
    }

    const formData = new FormData();
    formData.append("userId", userId); 
    formData.append("description", newPostDescription); 
    if (newPostImageFile) {
      formData.append("picture", newPostImageFile); 
    }

    try {
      await axios.post("http://localhost:3001/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      window.dispatchEvent(new CustomEvent('newPostCreated', { 
        detail: { userId } 
      }));

      setNewPostDescription(""); 
      setNewPostImageFile(null);

    } catch (error) {
      console.error("Failed to create post in Feed.jsx:", error); 
      if (error.response?.data?.isHateSpeech) {
        showWarning(`Post blocked: ${error.response.data.message}`);
      } else {
        showWarning("Failed to create post. Please try again.");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
      showWarning("Failed to delete post. Please try again.");
    }
  };

  const handleUpdatePost = async (postId, updatedDescription) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${postId}`,
        { description: updatedDescription },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, description: response.data.description } : post
      ));
    } catch (error) {
      console.error("Failed to update post:", error);
      if (error.response?.data?.isHateSpeech) {
        showWarning(`Update blocked: ${error.response.data.message}`);
      } else {
        showWarning("Failed to update post. Please try again.");
      }
    }
  };

  return (
    <> 
      <FeedContainer>
        <ContentWrapper>
          <MainContent>
            <PostForm
              handlePostSubmit={handlePostSubmit} 
              newPost={newPostDescription}         
              setNewPost={setNewPostDescription}   
              postImage={newPostImageFile}       
              setPostImage={setNewPostImageFile} 
            />

            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    handleDeletePost={handleDeletePost}
                    handleUpdatePost={handleUpdatePost}
                  />
                ))
              ) : (
                <p>No posts yet. Be the first to share something!</p> 
              )}
            </div>
          </MainContent>
          
          <SidebarWrapper>
            <UserListSidebar />
          </SidebarWrapper>
        </ContentWrapper>
      </FeedContainer>
    </>
  );
};

export default Feed;