import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;
export const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc, #6a11cb);
  background-size: 200% 200%;
  animation: ${gradientShift} 10s ease infinite;
`;
export const LeftSection = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 3rem;
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
`;
export const Illustration = styled.img`
  width: 70%;
  max-width: 400px;
  border-radius: 15px;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;
export const MissionStatement = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
`;
export const FeatureCarousel = styled.div`
  width: 80%;
  max-width: 400px;
  margin-top: 1.5rem;
  animation: ${fadeIn} 1.5s ease-in-out;
`;
export const Feature = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  transition: background 0.3s ease, transform 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-5px);
  }
`;
export const FeatureIcon = styled.div`
  margin-right: 1rem;
  font-size: 1.5rem;
  color: #fff;
  transition: transform 0.3s ease;
  ${Feature}:hover & {
    transform: scale(1.2);
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;
export const RightSection = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 15px 0 0 15px;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  padding: 3rem;
`;
export const LoginForm = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.75rem 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: #6a11cb;
    box-shadow: 0 0 8px rgba(106, 17, 203, 0.5);
  }
`;
export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin: 1.5rem 0;
  border-radius: 8px;
  border: none;
  background-color: #6a11cb;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  animation: ${pulse} 2s infinite;
  &:hover {
    background-color: #2575fc;
    transform: translateY(-2px);
  }
`;
export const SignupLink = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  a {
    color: #6a11cb;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
    &:hover {
      color: #2575fc;
      text-decoration: underline;
    }
  }
`;
export const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 1rem;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const NavbarContainer = styled.nav`
  position: fixed;      
  top: 0;                
  left: 0;              
  right: 0;              
  z-index: 1000;        
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
export const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
`;
export const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;
export const SearchBar = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  outline: none;
  width: 100%;
`;
export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;
export const ProfileDropdown = styled.div`
  position: relative;
  display: inline-block;
`;
export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50px;
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;
export const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;
export const DropdownContent = styled.div`
  position: absolute;
  right: 0;
  background-color: ${({ theme }) => theme.cardBg};
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;
export const DropdownItem = styled(Link)`
  color: ${({ theme }) => theme.text};
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;
export const DropdownButton = styled.button`
  color: ${({ theme }) => theme.text};
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;
