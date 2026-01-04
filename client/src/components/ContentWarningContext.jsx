import React, { createContext, useContext } from 'react';
import { useInternalContentWarningState, ContentWarningDisplay } from './ContentWarning'; 

const ContentWarningContext = createContext(null);

export const useContentWarning = () => {
  const context = useContext(ContentWarningContext);
  if (!context) {
    throw new Error('useContentWarning must be used within a ContentWarningProvider');
  }
  // We only expose the 'showWarning' function to consumers
  return context.showWarning;
};

export const ContentWarningProvider = ({ children }) => {
  const { warningMessage, showWarning, hideWarning } = useInternalContentWarningState();

  return (
    <ContentWarningContext.Provider value={{ showWarning }}>
      {children}
      <ContentWarningDisplay message={warningMessage} onClose={hideWarning} />
    </ContentWarningContext.Provider>
  );
};