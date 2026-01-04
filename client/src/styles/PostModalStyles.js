import styled from "styled-components";

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
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
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

export const Comment = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.hover};
  border-radius: 8px;
`;

export const Reply = styled.div`
  margin-left: 2rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.hover};
  border-radius: 8px;
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

export const ViewRepliesButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  margin-left: 3rem;
  &:hover {
    text-decoration: underline;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const PostUserImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
`;

export const PostUserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PostUserName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;

export const PostUserDetails = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}90;
`;

export const CommentsHeader = styled.h3`
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
`;