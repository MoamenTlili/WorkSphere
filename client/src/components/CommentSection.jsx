import React, { useState } from "react";
import {
  Comment,
  CommentUserImage,
  CommentContent,
  CommentUserName,
  CommentText,
  CommentActions,
  CommentLikeButton,
  ReplyButton,
  DeleteButton,
  CommentSectionContainer,
  ViewAllComments,
  ViewRepliesButton
} from "../styles/StyledComponents";
import { HeartIcon as HeartOutline, HeartIcon as HeartSolid, TrashIcon } from "@heroicons/react/24/outline";
import ReportButton from "./ReportButton";

const CommentSection = ({
  post,
  comments,
  loggedInUserId,
  handleLikeComment,
  handleDeleteComment,
  handleReplySubmit,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  setShowCommentModal,
}) => {
  const [expandedReplies, setExpandedReplies] = useState({});
  const visibleComments = comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
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

            {/* Reply header showing who is replying to who */}
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

            <div style={{display: 'flex'}}>
              <CommentUserImage
                src={`http://localhost:3001${reply.userPicturePath}`}
                alt={reply.userName}
                style={{marginRight: '10px'}}
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
                  <ReplyButton onClick={() => setReplyingTo(reply._id)}>
                    Reply
                  </ReplyButton>
                  
                  <ReportButton 
                    postId={post._id} 
                    commentId={comment._id}
                    replyId={reply._id}
                  />
                  
                  {reply.userId === loggedInUserId && (
                    <DeleteButton onClick={() => handleDeleteComment(comment._id, reply._id)}>
                      <TrashIcon className="h-4 w-4" />
                    </DeleteButton>
                  )}
                </CommentActions>
                
                {replyingTo === reply._id && (
                  <div className="mt-2">
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
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write a reply..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReplySubmit(comment._id, reply._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Recursive replies with increased depth */}
                {reply.replies && renderReplies(reply.replies, comment, reply, depth + 1)}
              </CommentContent>
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

  return (
    <CommentSectionContainer>
      {visibleComments.map((comment, index) => (
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
              
              <ReportButton 
                postId={post._id} 
                commentId={comment._id} 
              />
              
              {comment.userId === loggedInUserId && (
                <DeleteButton onClick={() => handleDeleteComment(comment._id)}>
                  <TrashIcon className="h-4 w-4" />
                </DeleteButton>
              )}
            </CommentActions>
            
            {comment.replies && renderReplies(comment.replies, comment)}
            {replyingTo === comment._id && (
              <div className="mt-2">
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
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a reply..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </CommentContent>
        </Comment>
      ))}
      {hasMoreComments && (
        <ViewAllComments onClick={() => setShowCommentModal(true)}>
          View all {comments.length} comments
        </ViewAllComments>
      )}
    </CommentSectionContainer>
  );
};

export default CommentSection;