import React from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent } from '../styles/StyledComponents';

const DialogContent = styled.div`
  padding: 2rem;
  text-align: center;
`;

const DialogTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const DialogMessage = styled.p`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.text}90;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ConfirmButton = styled(Button)`
  background: #ff4d4d;
  color: white;
  border: none;
  
  &:hover {
    background: #e04545;
  }
`;

const CancelButton = styled(Button)`
  background: ${({ theme }) => theme.hover};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    background: ${({ theme }) => theme.hover}90;
  }
`;

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone." 
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          <DialogMessage>{message}</DialogMessage>
          <ButtonGroup>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <ConfirmButton onClick={onConfirm}>Delete</ConfirmButton>
          </ButtonGroup>
        </DialogContent>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationDialog;