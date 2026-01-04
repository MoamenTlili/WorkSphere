import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Post from "../components/Post";
import MyProfileInfo from "../components/MyProfileInfo";
import PostForm from "../components/PostForm";
import { useContentWarning } from '../components/ContentWarningContext';

const ProfileContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PostsContainer = styled.div`
  margin-top: 2rem;
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostImageFile, setNewPostImageFile] = useState(null);
  const { userId } = useParams();
  const isCurrentUser = userId === localStorage.getItem("userId");
  const showWarning = useContentWarning(); 

  const fetchUserAndPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const userResponse = await axios.get(`http://localhost:3001/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);

      const postsResponse = await axios.get(`http://localhost:3001/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const sortedPosts = postsResponse.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      showWarning("Failed to load profile data. Please try again."); 
    }
  };

  useEffect(() => {
    fetchUserAndPosts();

    const handleNewPostEvent = (event) => {
      if (event.detail.userId === userId) {
        fetchUserAndPosts();
      }
    };

    window.addEventListener('newPostCreated', handleNewPostEvent);
    
    return () => {
      window.removeEventListener('newPostCreated', handleNewPostEvent);
    };
  }, [userId]);

  const handlePostSubmit = async (e) => {

    if (!newPostDescription.trim() && !newPostImageFile) {
        showWarning("Cannot submit an empty post.");
        return;
    }

    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId")); 
    formData.append("description", newPostDescription);
    if (newPostImageFile) formData.append("picture", newPostImageFile);

    try {
      await axios.post("http://localhost:3001/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      window.dispatchEvent(new CustomEvent('newPostCreated', { 
        detail: { userId: localStorage.getItem("userId") } 
      }));

      setNewPostDescription("");
      setNewPostImageFile(null);
    } catch (error) {
      console.error("Failed to create post:", error);
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

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <ProfileContainer>
        <ContentWrapper>
          <MyProfileInfo user={user} />
          
          {isCurrentUser && ( 
            <PostForm
              handlePostSubmit={handlePostSubmit}
              newPost={newPostDescription}        
              setNewPost={setNewPostDescription}   
              postImage={newPostImageFile}       
              setPostImage={setNewPostImageFile}  
            />
          )}

          <PostsContainer>
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                handleDeletePost={handleDeletePost}
                handleUpdatePost={handleUpdatePost} 
              />
            ))}
          </PostsContainer>
        </ContentWrapper>
      </ProfileContainer>
    </>
  );
};

export default Profile;