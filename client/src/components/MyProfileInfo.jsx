import React from "react";
import styled from "styled-components";
import { BriefcaseIcon, MapPinIcon } from "@heroicons/react/24/outline";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.primary};
  margin-bottom: 1.5rem;
`;

const ProfileName = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
`;

const MyProfileInfo = ({ user }) => {
  if (!user) return null;

  return (
    <ProfileContainer>
      <ProfileImage 
        src={`http://localhost:3001${user.picturePath}`} 
        alt={`${user.firstName} ${user.lastName}`}
      />
      <ProfileName>{user.firstName} {user.lastName}</ProfileName>
      
      <ProfileDetails>
        <DetailItem>
          <BriefcaseIcon className="h-5 w-5" />
          <span>{user.department}</span>
        </DetailItem>
        <DetailItem>
          <MapPinIcon className="h-5 w-5" />
          <span>{user.location}</span>
        </DetailItem>
      </ProfileDetails>
    </ProfileContainer>
  );
};

export default MyProfileInfo;