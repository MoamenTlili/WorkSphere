import React, { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import axios from "axios";
import styled from "styled-components";
import { XMarkIcon, HeartIcon as HeartOutline, HeartIcon as HeartSolid, ChatBubbleOvalLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import ReportButton from "./ReportButton";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  ModalOverlay,
  ModalContent,
  CloseButton,
  Comment,
  Reply,
  CommentActions,
  CommentLikeButton,
  ReplyButton,
  DeleteButton,
  ViewRepliesButton,
  PostHeader,
  PostUserImage,
  PostUserInfo,
  PostUserName,
  PostUserDetails,
  CommentsHeader
} from "../styles/PostModalStyles";
import { useContentWarning } from './ContentWarningContext';


const PostModal = ({ post, onClose }) => {
  const showWarning = useContentWarning();
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const loggedInUserId = localStorage.getItem("userId");
  const [currentPost, setCurrentPost] = useState(post);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  
  if (!post) return null;

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleLikeComment = async (commentId, replyId = null) => {
    try {
      const token = localStorage.getItem("token");
      let endpoint;
      
      if (replyId) {
        endpoint = `http://localhost:3001/posts/${currentPost._id}/comments/${commentId}/replies/${replyId}/like`;
      } else {
        endpoint = `http://localhost:3001/posts/${currentPost._id}/comments/${commentId}/like`;
      }
  
      const response = await axios.patch(
        endpoint,
        { userId: loggedInUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setCurrentPost(prevPost => {
        const updatedPost = { ...prevPost };
        const comment = updatedPost.comments.find(c => c._id === commentId);
        
        if (replyId && comment) {
          const reply = comment.replies.find(r => r._id === replyId);
          if (reply) {
            reply.likes = response.data.likes;
          }
        } else if (comment) {
          comment.likes = response.data.likes;
        }
        
        return updatedPost;
      });
      
    } catch (error) {
      console.error("Failed to like comment/reply:", error);
    }
  };

  const handleAddComment = async () => {
     if (!newComment.trim()) {
        showWarning("Comment cannot be empty.");
        return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3001/posts/${post._id}/comment`,
        { userId: loggedInUserId, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setCurrentPost(response.data);
    } catch (error) {
      console.log("Full error response:", error.response); 
      
      if (error.response?.status === 400 && error.response.data?.isHateSpeech) {
        showWarning(`Comment blocked: ${error.response.data.message}`);
      } else {
        console.error("Failed to add comment:", error);
        showWarning("Error posting comment. Please try again.");
      }
    }
  };

  const confirmDelete = (type, id, commentId = null) => {
    setItemToDelete({ type, id, commentId });
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      let endpoint;
      
      if (itemToDelete?.type === 'comment') {
        endpoint = `http://localhost:3001/posts/${currentPost._id}/comments/${itemToDelete.id}`;
      } else if (itemToDelete?.type === 'reply') {
        endpoint = `http://localhost:3001/posts/${currentPost._id}/comments/${itemToDelete.commentId}/replies/${itemToDelete.id}`;
      }

      const response = await axios.delete(
        endpoint,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setCurrentPost(response.data);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleAddReply = async (commentId, parentReplyId = null) => {
    if (!replyText.trim()) {
        showWarning("Reply cannot be empty.");
        return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3001/posts/${post._id}/comments/${commentId}/reply`,
        { userId: loggedInUserId, comment: replyText, parentReplyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReplyText("");
      setReplyingTo(null);
      setCurrentPost(response.data);
      
    } catch (error) {
      console.log("Full reply error:", error.response);
      
      if (error.response?.status === 400 && error.response.data?.isHateSpeech) {
        showWarning(`Reply blocked: ${error.response.data.message}`);
      } else {
        console.error("Failed to add reply:", error);
        showWarning("Error posting reply. Please try again.");
      }
    }
  };

  const renderReplies = (replies, comment, parentReply = null, depth = 1) => {
    const shouldLimitReplies = replies.length > 2 && !expandedReplies[comment._id];
    const repliesToShow = shouldLimitReplies ? replies.slice(0, 2) : replies;

    return (
      <>
        {repliesToShow.map((reply) => (
          <div key={reply._id} style={{ 
            marginLeft: `${20 * depth}px`,
            marginTop: "10px",
            position: 'relative',
            paddingLeft: '10px'
          }}>
            {/* Visual connector line */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: '20px',
              bottom: '-10px',
              width: '2px',
              backgroundColor: '#ddd'
            }}></div>
            
            {/* Reply indicator */}
            {parentReply && (
              <div style={{
                position: 'absolute',
                left: '-15px',
                top: '15px',
                width: '15px',
                height: '2px',
                backgroundColor: '#ddd'
              }}></div>
            )}

            {/* Reply header */}
            {parentReply && (
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{marginRight: '5px'}}>↳</span>
                <span>Replying to <strong>{parentReply.userName}</strong></span>
              </div>
            )}

            <div style={{display: 'flex', alignItems: 'flex-start'}}>
              <img
                src={`http://localhost:3001${reply.userPicturePath}`}
                alt={reply.userName}
                style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%",
                  marginRight: '10px',
                  objectFit: 'cover' 
                }}
              />
              <div style={{flex: 1}}>
                <p style={{ fontWeight: "bold", margin: 0 }}>{reply.userName}</p>
                <p style={{ margin: "0.5rem 0" }}>{reply.comment}</p>
                
                <CommentActions>
                  <CommentLikeButton
                    $isLiked={reply.likes?.[loggedInUserId]}
                    onClick={() => handleLikeComment(comment._id, reply._id)}
                  >
                    {reply.likes?.[loggedInUserId] ? (
                      <HeartSolid className="h-4 w-4" />
                    ) : (
                      <HeartOutline className="h-4 w-4" />
                    )}
                    <span>{Object.keys(reply.likes || {}).length}</span>
                  </CommentLikeButton>
                  <ReplyButton onClick={() => setReplyingTo(reply._id)}>
                    Reply
                  </ReplyButton>

                  <ReportButton 
                    postId={post._id} 
                    commentId={comment._id}
                    replyId={reply._id}
                  />

                  {reply.userId === loggedInUserId && (
                    <DeleteButton onClick={() => confirmDelete('reply', reply._id, comment._id)}>
                      <TrashIcon className="h-4 w-4" />
                    </DeleteButton>
                  )}
                </CommentActions>
                
                {replyingTo === reply._id && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{
                      backgroundColor: "#f5f5f5",
                      padding: "5px",
                      borderRadius: "4px",
                      marginBottom: "5px",
                      fontSize: "0.8rem"
                    }}>
                      Replying to {reply.userName}
                    </div>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                      placeholder="Write a reply..."
                    />
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button
                        onClick={() => handleAddReply(comment._id, reply._id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#6b7280",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Recursive replies */}
                {reply.replies && renderReplies(reply.replies, comment, reply, depth + 1)}
              </div>
            </div>
          </div>
        ))}
        {replies.length > 2 && (
          <ViewRepliesButton onClick={() => toggleReplies(comment._id)}>
            {expandedReplies[comment._id] ? 
              "Hide replies" : 
              `View all ${replies.length} replies`}
          </ViewRepliesButton>
        )}
      </>
    );
  };

  if (!currentPost) return null;
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </CloseButton>
  
        <PostHeader>
          <PostUserImage
            src={`http://localhost:3001${currentPost.userPicturePath}`}
            alt={`${currentPost.firstName} ${currentPost.lastName}`}
          />
          <PostUserInfo>
            <PostUserName>
              {currentPost.firstName} {currentPost.lastName}
            </PostUserName>
            <PostUserDetails>
              {currentPost.location && <span>{currentPost.location}</span>}
              {currentPost.createdAt && (
                <span> • {new Date(currentPost.createdAt).toLocaleDateString()}</span>
              )}
            </PostUserDetails>
          </PostUserInfo>
        </PostHeader>
  
        <p style={{ 
          fontSize: "1.1rem", 
          lineHeight: "1.6", 
          marginBottom: "1.5rem",
          whiteSpace: "pre-line" 
        }}>
          {currentPost.description}
        </p>
  
        {currentPost.picturePath && (
          <img
            src={`http://localhost:3001${currentPost.picturePath}`}
            alt="Post"
            style={{ 
              width: "100%", 
              borderRadius: "12px", 
              margin: "1rem 0",
              maxHeight: "500px",
              objectFit: "contain"
            }}
          />
        )}
  
        <CommentsHeader>Comments</CommentsHeader>
        
        {currentPost.comments?.map((comment) => (
          <Comment key={comment._id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <img
                src={`http://localhost:3001${comment.userPicturePath}`}
                alt={comment.userName}
                style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <p style={{ fontWeight: "bold", margin: 0 }}>{comment.userName}</p>
                </div>
                <p style={{ margin: "0.5rem 0" }}>{comment.comment}</p>
                
                <CommentActions>
                  <CommentLikeButton
                    $isLiked={comment.likes?.[loggedInUserId]}
                    onClick={() => handleLikeComment(comment._id)}
                  >
                    {comment.likes?.[loggedInUserId] ? (
                      <HeartSolid className="h-4 w-4" />
                    ) : (
                      <HeartOutline className="h-4 w-4" />
                    )}
                    <span>{Object.keys(comment.likes || {}).length}</span>
                  </CommentLikeButton>
                  <ReplyButton onClick={() => setReplyingTo(comment._id)}>
                    Reply
                  </ReplyButton>

                  <ReportButton 
                    postId={post._id} 
                    commentId={comment._id} 
                  />

                  {comment.userId === loggedInUserId && (
                    <DeleteButton onClick={() => confirmDelete('comment', comment._id)}>
                      <TrashIcon className="h-4 w-4" />
                    </DeleteButton>
                  )}
                </CommentActions>
              </div>
            </div>
  
            {comment.replies && renderReplies(comment.replies, comment)}
  
            {replyingTo === comment._id && (
              <div style={{ marginTop: "1rem", marginLeft: "3rem" }}>
                <div style={{
                  backgroundColor: "#f5f5f5",
                  padding: "5px",
                  borderRadius: "4px",
                  marginBottom: "5px",
                  fontSize: "0.8rem"
                }}>
                  Replying to {comment.userName}
                </div>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "0.9rem"
                  }}
                  placeholder="Write a reply..."
                />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleAddReply(comment._id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Comment>
        ))}
  
        <div style={{ marginTop: "2rem" }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              outline: "none",
              fontSize: "1rem"
            }}
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Comment
          </button>
        </div>

        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDelete}
          title={
            itemToDelete?.type === 'comment' ? "Delete Comment" : 
            "Delete Reply"
          }
          message={
            itemToDelete?.type === 'comment' ? "Are you sure you want to delete this comment? This action cannot be undone." :
            "Are you sure you want to delete this reply? This action cannot be undone."
          }
        />
      </ModalContent>
    </ModalOverlay>
  );
}; 

export default PostModal;