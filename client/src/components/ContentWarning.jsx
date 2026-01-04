import { useState, useEffect } from 'react';
import styled from 'styled-components';

const WarningContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ffebee; /* Light red background */
  color: #c62828; /* Dark red text */
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  z-index: 2000; /* Ensure it's above other elements, like Navbar's 1000 */
  max-width: 400px;
  border-left: 4px solid #c62828; /* Accent border */
`;

const WarningMessage = styled.span`
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #c62828;
  font-size: 20px; /* Slightly larger for easier clicking */
  margin-left: 16px;
  cursor: pointer;
  line-height: 1;
`;


export const ContentWarningDisplay = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 7000); 
    return () => clearTimeout(timer);
  }, [message, onClose]); 

  if (!message) return null;

  return (
    <WarningContainer role="alert">
      <WarningMessage>{message}</WarningMessage>
      <CloseButton onClick={onClose} aria-label="Close warning">×</CloseButton>
    </WarningContainer>
  );
};

export const useInternalContentWarningState = () => {
  const [warningMessage, setWarningMessage] = useState(null);

  const showWarning = (message) => {
    setWarningMessage(message);
  };

  const hideWarning = () => {
    setWarningMessage(null);
  };

  return { warningMessage, showWarning, hideWarning };
};