import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react'; // Added useRef
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [activeUserIds, setActiveUserIds] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false); 
  useEffect(() => {
    const connect = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token, WebSocket connection not initiated.");
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setIsConnected(false);
        }
        setActiveUserIds(new Set());
        return;
      }

      if (socketRef.current) {
        console.log("Existing socket found, disconnecting before reconnecting.");
        socketRef.current.disconnect();
        socketRef.current = null; 
        setIsConnected(false);
      }

      console.log("Attempting to connect WebSocket with token...");
      const newSocket = io('http://localhost:3001', {
        auth: { token },
        reconnectionAttempts: 3, 
        timeout: 5000, 
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server with ID:', newSocket.id);
        socketRef.current = newSocket; 
        setIsConnected(true);
      });

      newSocket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err.message, err);
      });

      newSocket.on('auth_error', (data) => {
        console.error('WebSocket authentication error:', data.message);
        if (socketRef.current) socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      });

      newSocket.on('active_users_list', (userIds) => {
        console.log('Received active users list:', userIds);
        setActiveUserIds(new Set(userIds));
      });

      newSocket.on('user_online', ({ userId }) => {
        console.log('User online:', userId);
        setActiveUserIds((prevActiveUsers) => {
          const newActiveUsers = new Set(prevActiveUsers);
          newActiveUsers.add(userId);
          return newActiveUsers;
        });
      });

      newSocket.on('user_offline', ({ userId }) => {
        console.log('User offline:', userId);
        setActiveUserIds((prevActiveUsers) => {
          const newActiveUsers = new Set(prevActiveUsers);
          newActiveUsers.delete(userId);
          return newActiveUsers;
        });
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        }
      });

      socketRef.current = newSocket;
    };

    connect(); 

    const handleAuthChange = () => {
      console.log("Auth state changed, re-initiating socket connection.");
      connect();
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      console.log("SocketProvider cleanup: disconnecting socket if it exists.");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []); 

  const contextValue = useMemo(() => ({
    socket: socketRef.current, 
    activeUserIds,
    isConnected, 
  }), [activeUserIds, isConnected]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};