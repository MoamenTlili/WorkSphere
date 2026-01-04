import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
`;

const ResultItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const UserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const SearchResults = ({ results, onSelect }) => {
  return (
    <ResultsContainer>
      {results.map((user) => (
        <ResultItem 
          key={user._id} 
          to={`/profile/${user._id}`}
          onClick={onSelect}
        >
          <UserImage src={`http://localhost:3001${user.picturePath}`} alt={`${user.firstName} ${user.lastName}`} />
          <UserName>{user.firstName} {user.lastName}</UserName>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};

export default SearchResults;