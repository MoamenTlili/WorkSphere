import React, { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChatBubbleOvalLeftIcon, XMarkIcon, TrashIcon, HeartIcon as HeartOutline, HeartIcon as HeartSolid } from "@heroicons/react/24/outline";
import CommentSection from "./CommentSection";
import {
  PostContainer,
  PostHeader,
  UserImage,
  UserInfo,
  UserName,
  UserDetails,
  PostContent,
  PostImage,
  PostActions,
  LikeButton,
  CommentButton,
  Comment,
  CommentUserImage,
  CommentSectionContainer,
  CommentContent,
  CommentUserName,
  CommentText,
  CommentActions,
  CommentLikeButton,
  ReplyButton,
  DeleteButton,
  ModalOverlay,
  ModalContent,
  CloseButton,
  OptionsMenu,
  DropdownMenu,
  DropdownItem
} from "../styles/StyledComponents";
import ReportButton from "./ReportButton";
import { useContentWarning } from "./ContentWarningContext";

const Post = ({ post, handleDeletePost, handleUpdatePost }) => {
   const showWarning = useContentWarning();
  const loggedInUserId = localStorage.getItem("userId");
  const isPostOwner = post.userId === loggedInUserId;
  const [likes, setLikes] = useState(post.likes || {});
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(post.description);
  const [showOptions, setShowOptions] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const isLiked = likes[loggedInUserId] || false;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${post._id}/like`,
        { userId: loggedInUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${post._id}/comment`,
        { userId: loggedInUserId, comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  

      if (response.data.isHateSpeech) {
        alert(`Content blocked: ${response.data.message}`);
        return;
      }
  
      setComments(response.data.comments);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      
      if (error.response?.data?.isHateSpeech) {
        showWarning(`Content blocked: ${error.response.data.message}`); 
      } 
      else if (error.response) {
        showWarning("Server error while adding comment. Please try again later.");
      } 
      else {
        showWarning("Network error while adding comment. Please check your connection.");
      }
    }
  };

  const handleReplySubmit = async (commentId, parentReplyId = null) => {
    if (!replyText.trim()) return;
  
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${post._id}/comments/${commentId}/reply`,
        { userId: loggedInUserId, comment: replyText, parentReplyId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.data.isHateSpeech) {
        alert(`Content blocked: ${response.data.message}`);
        return;
      }
  
      setComments(response.data.comments);
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to add reply:", error);
      
      if (error.response?.data?.isHateSpeech) {
        showWarning(`Content blocked: ${error.response.data.message}`);
      } 
      else if (error.response) {
        showWarning("Server error while adding reply. Please try again later.");
      } 
      else {
        showWarning("Network error while adding reply. Please check your connection.");
      }
    }
  };

  const confirmDelete = (type, id, commentId = null) => {
    setItemToDelete({ type, id, commentId });
    setShowDeleteDialog(true);
  };

  const handleCancelEdit = () => {
  setUpdatedDescription(post.description);
  setIsEditing(false); 
  setShowOptions(false); 
};

  const handleDelete = async () => {
    try {
      if (itemToDelete?.type === 'post') {
        await handleDeletePost(post._id);
      } else if (itemToDelete?.type === 'comment') {
        await deleteComment(itemToDelete.id);
      } else if (itemToDelete?.type === 'reply') {
        await deleteComment(itemToDelete.commentId, itemToDelete.id);
      }
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const deleteComment = async (commentId, replyId = null) => {
    try {
      const endpoint = replyId
        ? `http://localhost:3001/posts/${post._id}/comments/${commentId}/replies/${replyId}`
        : `http://localhost:3001/posts/${post._id}/comments/${commentId}`;
  
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setComments((prevComments) =>
        replyId
          ? prevComments.map((c) =>
              c._id === commentId
                ? {
                    ...c,
                    replies: c.replies.filter((r) => r._id !== replyId),
                  }
                : c
            )
          : prevComments.filter((c) => c._id !== commentId) 
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLikeComment = async (commentId, replyId = null) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        console.error("No user ID found");
        return;
      }
  
      let endpoint;
      if (replyId) {
        endpoint = `http://localhost:3001/posts/${post._id}/comments/${commentId}/replies/${replyId}/like`;
      } else {
        endpoint = `http://localhost:3001/posts/${post._id}/comments/${commentId}/like`;
      }
  
      console.log("Making request to:", endpoint, "with userId:", userId);
  
      const response = await axios.patch(
        endpoint,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Like successful, updated post:", response.data);
      if (replyId) {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply._id === replyId) {
                    return { ...reply, likes: response.data.likes };
                  }
                  return reply;
                }),
              };
            }
            return comment;
          })
        );
      } else {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Failed to like comment/reply:", error);
      console.log("Full error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  };
  
  const handleUpdate = async () => {
    await handleUpdatePost(post._id, updatedDescription);
    setIsEditing(false);
    setShowOptions(false);
  };

  return (
    <PostContainer>
      <PostHeader>
        <UserImage
          src={`http://localhost:3001${post.userPicturePath}`}
          alt={`${post.firstName} ${post.lastName}`}
        />
        <UserInfo>
          <UserName to={`/profile/${post.userId}`}>
            {post.firstName} {post.lastName}
          </UserName>
          <UserDetails>
            <span>{post.location}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </UserDetails>
        </UserInfo>
        {isPostOwner && (
          <OptionsMenu onClick={() => setShowOptions(!showOptions)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
            {showOptions && (
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setIsEditing(true);
                    setUpdatedDescription(post.description);
                    setShowOptions(false);
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => confirmDelete('post', post._id)}
                  style={{ color: "red" }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            )}
          </OptionsMenu>
        )}
      </PostHeader>
      <PostContent>
        {isEditing ? (
          <div>
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minHeight: '100px', marginBottom: '0.5rem' }} // Added for better layout
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}> {/* Wrapper for buttons */}
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-4">{post.description}</p>
        )}
        {post.picturePath && (
          <PostImage
            src={`http://localhost:3001${post.picturePath}`}
            alt="Post"
          />
        )}
      </PostContent>

      <PostActions>
        <LikeButton onClick={handleLike} $isLiked={isLiked}>
          <svg viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{Object.keys(likes).length}</span>
        </LikeButton>
        <CommentButton onClick={() => setShowCommentModal(true)}>
          <ChatBubbleOvalLeftIcon className="h-5 w-5" />
          <span>{comments.length}</span>
        </CommentButton>
        <ReportButton postId={post._id} />
      </PostActions>

      <CommentSection
        post={post}
        comments={comments}
        loggedInUserId={loggedInUserId}
        handleLikeComment={handleLikeComment}
        handleDeleteComment={(commentId, replyId) => confirmDelete(replyId ? 'reply' : 'comment', replyId || commentId, replyId ? commentId : null)}
        handleReplySubmit={handleReplySubmit}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        replyText={replyText}
        setReplyText={setReplyText}
        setShowCommentModal={setShowCommentModal}
      />
      <form onSubmit={handleCommentSubmit} className="flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Comment
        </button>
      </form>

      {showCommentModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setShowCommentModal(false)}>
              <XMarkIcon className="h-6 w-6" />
            </CloseButton>
            <h3 className="font-bold text-lg mb-4">Comments</h3>
            {comments.map((comment, index) => (
              <Comment key={index}>
                <CommentUserImage
                  src={`http://localhost:3001${comment.userPicturePath}`}
                  alt={comment.userName}
                />
                <CommentContent>
                  <CommentUserName to={`/profile/${comment.userId}`}>
                    {comment.userName}
                  </CommentUserName>
                  <CommentText>{comment.comment}</CommentText>
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
                    {comment.userId === loggedInUserId && (
                      <DeleteButton onClick={() => confirmDelete('comment', comment._id)}>
                        <TrashIcon className="h-4 w-4" />
                      </DeleteButton>
                    )}
                  </CommentActions>
                  {/* Render Replies in Modal */}
                  {comment.replies && comment.replies.map((reply) => (
                    <div key={reply._id} style={{ marginLeft: "20px", marginTop: "10px" }}>
                      <CommentUserImage
                        src={`http://localhost:3001${reply.userPicturePath}`}
                        alt={reply.userName}
                      />
                      <CommentContent>
                        <CommentUserName to={`/profile/${reply.userId}`}>
                          {reply.userName}
                        </CommentUserName>
                        <CommentText>{reply.comment}</CommentText>
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
                          {reply.userId === loggedInUserId && (
                            <DeleteButton onClick={() => confirmDelete('reply', reply._id, comment._id)}>
                              <TrashIcon className="h-4 w-4" />
                            </DeleteButton>
                          )}
                        </CommentActions>
                      </CommentContent>
                    </div>
                  ))}
                </CommentContent>
              </Comment>
            ))}
          </ModalContent>
        </ModalOverlay>
      )}

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        title={
          itemToDelete?.type === 'post' ? "Delete Post" : 
          itemToDelete?.type === 'comment' ? "Delete Comment" : 
          "Delete Reply"
        }
        message={
          itemToDelete?.type === 'post' ? "Are you sure you want to delete this post? This action cannot be undone." :
          itemToDelete?.type === 'comment' ? "Are you sure you want to delete this comment? This action cannot be undone." :
          "Are you sure you want to delete this reply? This action cannot be undone."
        }
      />
    </PostContainer>
  );
};

export default Post;