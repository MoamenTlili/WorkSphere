import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const SidebarContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 100px;
  width: 280px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
`;

const SidebarHeader = styled.h3`
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled(Link)`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  display: block;
  &:hover {
    text-decoration: underline;
  }
`;

const UserDepartment = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const StatusIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $isActive }) => ($isActive ? '#4CAF50' : '#9E9E9E')};
  margin-right: 6px;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const PaginationButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:disabled {
    background: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const UserListSidebar = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeUserIds } = useSocket();
  const usersPerPage = 9;

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, limit: usersPerPage }
        });
        
        if (!response.data?.users) {
          throw new Error('Invalid response format: missing users array');
        }

        setUsers(response.data.users);
        setTotalPages(response.data.totalPages); 
      } catch (err) {
        console.error('Fetch error in UserListSidebar:', err);
        setError(err.message || "Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <SidebarContainer>
        <SidebarHeader>Users</SidebarHeader>
        <div>Loading users...</div>
      </SidebarContainer>
    );
  }

  if (error) {
    return (
      <SidebarContainer>
        <SidebarHeader>Users</SidebarHeader>
        <div>Error: {error}</div>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <SidebarHeader>Users</SidebarHeader>
      
      {users.length === 0 && !isLoading && <p>No users to display.</p>}

      {users.map(user => {
        const isActive = activeUserIds.has(user._id);
        return (
          <UserItem key={user._id}>
            <UserAvatar 
              src={`http://localhost:3001${user.picturePath || '/assets/default-profile.png'}`} 
              alt={`${user.firstName} ${user.lastName}`}
            />
            <UserInfo>
              <UserName to={`/profile/${user._id}`}>
                {user.firstName} {user.lastName}
              </UserName>
              <UserDepartment>
                <StatusIndicator $isActive={isActive} /> 
                {user.department || 'No department'}
              </UserDepartment>
            </UserInfo>
          </UserItem>
        );
      })}
      
      {totalPages > 1 && (
        <PaginationControls>
          <PaginationButton 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          <span>Page {currentPage} of {totalPages}</span>
          <PaginationButton 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
        </PaginationControls>
      )}
    </SidebarContainer>
  );
};

export default UserListSidebar;