import React, { useState } from "react";
import styled from "styled-components";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import { useContentWarning } from "./ContentWarningContext";

const PostFormCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
`;

const PostInput = styled.textarea`
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  resize: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: ${({ theme }) => theme.text}80;
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
    outline: none;
  }
`;

const FileUploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.hover};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary}15;
    color: ${({ theme }) => theme.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PreviewImage = styled.div`
  position: relative;
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  max-width: 300px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PostForm = ({ handlePostSubmit, newPost, setNewPost, postImage, setPostImage }) => {
  const showWarning = useContentWarning();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !postImage) {
        showWarning("Cannot submit an empty post.");
        return;
    }
    
    await handlePostSubmit(e);  
  };

  return (
    <PostFormCard>
      <form onSubmit={handleSubmit}>
        <PostInput
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share updates, ideas, or celebrations with your team..."
          rows="4"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            <FileUploadLabel>
              <PaperClipIcon className="h-5 w-5" />
              <span>Add Media</span>
              <input
                type="file"
                onChange={(e) => setPostImage(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
            </FileUploadLabel>
            
            {postImage && (
              <PreviewImage>
                <img src={URL.createObjectURL(postImage)} alt="Preview" />
                <RemoveImageButton
                  type="button"
                  onClick={() => setPostImage(null)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </RemoveImageButton>
              </PreviewImage>
            )}
          </div>
          
          <SubmitButton 
            type="submit" 
            disabled={!newPost.trim() && !postImage}  
          >
            Post
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </SubmitButton>
        </div>
      </form>
    </PostFormCard>
  );
};

export default PostForm;