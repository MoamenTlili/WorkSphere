import React, { useState } from "react";
import styled from "styled-components";
import { FlagIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { ModalOverlay, ModalContent } from "../styles/StyledComponents";

const ReportButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ReportButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text}80;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff4d4d;
    background: rgba(255, 77, 77, 0.1);
  }
`;

const ReportModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ReportForm = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
`;

const ReportTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const ReasonSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

const SubmitButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
  
  &:hover {
    background: #e04545;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text}80;
  margin-left: 1rem;
  cursor: pointer;
`;

const ReportButtonComponent = ({ postId, commentId, replyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("hate_speech");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReport = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      let endpoint;
      if (replyId) {
        endpoint = `http://localhost:3001/posts/${postId}/comments/${commentId}/replies/${replyId}/report`;
      } else if (commentId) {
        endpoint = `http://localhost:3001/posts/${postId}/comments/${commentId}/report`;
      } else {
        endpoint = `http://localhost:3001/posts/${postId}/report`;
      }
      
      await axios.post(
        endpoint,
        { userId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (replyId ? "Failed to report reply" : 
         commentId ? "Failed to report comment" : 
         "Failed to report post"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReportButtonWrapper>
      <ReportButton onClick={() => setIsOpen(true)} title="Report Post">
        <FlagIcon width={20} />
      </ReportButton>

      {isOpen && (
        <ModalOverlay>
          <ModalContent>
            <ReportForm>
              <ReportTitle>Report Post</ReportTitle>
              
              {success ? (
                <p>Thank you for reporting this post. Our team will review it.</p>
              ) : (
                <>
                  <p>Please select a reason for reporting this post:</p>
                  
                  <ReasonSelect
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="hate_speech">Hate Speech</option>
                    <option value="harassment">Harassment</option>
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="other">Other</option>
                  </ReasonSelect>
                  
                  {error && <p style={{ color: "#ff4d4d" }}>{error}</p>}
                  
                  <div>
                    <SubmitButton 
                      onClick={handleReport}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Reporting..." : "Submit Report"}
                    </SubmitButton>
                    <CancelButton onClick={() => setIsOpen(false)}>
                      Cancel
                    </CancelButton>
                  </div>
                </>
              )}
            </ReportForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </ReportButtonWrapper>
  );
};

export default ReportButtonComponent;