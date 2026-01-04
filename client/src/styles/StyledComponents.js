import styled from "styled-components";
import { Link } from "react-router-dom";

// Comment-related styled components
export const Comment = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const CommentUserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const CommentContent = styled.div`
  background: ${({ theme }) => theme.hover};
  padding: 0.75rem;
  border-radius: 12px;
  flex: 1;
`;

export const CommentUserName = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const CommentText = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
`;

export const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const CommentLikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: ${({ $isLiked }) => ($isLiked ? "#ff324b" : "inherit")};
  cursor: pointer;
  font-size: 0.875rem;
`;

export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 0.875rem;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 0.875rem;
`;

// Styled components
export const CommentSectionContainer = styled.div`
  margin-top: 1rem;
`;

export const ViewAllComments = styled.button`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;
export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

export const PostContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  position: relative;
`;

export const UserImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
`;

export const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const UserName = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const UserDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text}90;
  margin-top: 0.25rem;
`;

export const PostContent = styled.div`
  margin-bottom: 1.25rem;
  line-height: 1.6;
`;

export const PostImage = styled.img`
  width: 100%;
  border-radius: 12px;
  margin-top: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center; /* Ensures buttons are vertically aligned */
`;

export const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: ${({ $isLiked, theme }) =>
    $isLiked ? "rgba(255, 50, 75, 0.15)" : theme.hover};
  color: ${({ $isLiked }) => ($isLiked ? "#ff324b" : "inherit")};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${({ $isLiked, theme }) =>
      $isLiked ? "rgba(255, 50, 75, 0.2)" : theme.hover};
    transform: translateY(-1px);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${({ $isLiked }) => ($isLiked ? "#ff324b" : "transparent")};
    stroke: ${({ $isLiked }) => ($isLiked ? "#ff324b" : "currentColor")};
    stroke-width: 2px;
  }
`;

export const CommentButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.hover};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primary}15;
    color: ${({ theme }) => theme.primary};
  }
`;

export const OptionsMenu = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 120px;
`;

export const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;
export const ReportButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text}80;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ff4d4d;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;
export const ViewRepliesButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  margin-left: 20px;
  &:hover {
    text-decoration: underline;
  }
`;