import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import pic from "../assets/pic2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faRobot,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
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

const pulse = keyframes`
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

const SignupContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc, #6a11cb);
  background-size: 200% 200%;
  animation: ${gradientShift} 10s ease infinite;
  
  /* Add this to prevent affecting other pages */
  &.auth-page {
    width: 100%;
  }
`;


const LeftSection = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
  box-sizing: border-box;
`;

const Illustration = styled.img`
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

const MissionStatement = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
`;

const FeatureCarousel = styled.div`
  width: 80%;
  max-width: 400px;
  margin-top: 1rem;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const Feature = styled.div`
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

const FeatureIcon = styled.div`
  margin-right: 1rem;
  font-size: 1.5rem;
  color: #fff;
  transition: transform 0.3s ease;
  ${Feature}:hover & {
    transform: scale(1.2);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const RightSection = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 15px 0 0 15px;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  box-sizing: border-box;
`;

const SignupForm = styled.form`
  background-color: ${({ theme }) => theme.cardBg || "#fff"};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text || "#333"};
  font-size: 1.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  background-color: ${({ theme }) => theme.bg || "#f9f9f9"};
  color: ${({ theme }) => theme.text || "#333"};
  outline: none;
  font-size: 1rem;
  &:focus {
    border-color: ${({ theme }) => theme.primary || "#6a11cb"};
  }
`;

const FileInputContainer = styled.div`
  width: 100%;
  margin: 0.5rem 0;
  text-align: left;
`;

const FileInputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text || "#333"};
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  background-color: ${({ theme }) => theme.bg || "#f9f9f9"};
  color: ${({ theme }) => theme.text || "#333"};
  outline: none;
  font-size: 1rem;
  &:focus {
    border-color: ${({ theme }) => theme.primary || "#6a11cb"};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.primary || "#6a11cb"};
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover || "#2575fc"};
  }
`;

const LoginLink = styled.p`
  color: ${({ theme }) => theme.text || "#333"};
  font-size: 0.9rem;
  a {
    color: ${({ theme }) => theme.primary || "#6a11cb"};
    text-decoration: none;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "",
    location: "",
    picture: null,
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("department", formData.department);
    data.append("location", formData.location);
  
    if (formData.picture) {
      data.append("picture", formData.picture);
    }
  
    try {
      const response = await axios.post("http://localhost:3001/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("userPicture", response.data.user.picturePath);
      localStorage.setItem("userFirstName", response.data.user.firstName);
      localStorage.setItem("userLastName", response.data.user.lastName);
  
      console.log("Registration successful. userId saved to localStorage:", response.data.user._id);
      navigate("/feed");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, picture: e.target.files[0] });
  };

  return (
    <SignupContainer>
      <RightSection>
        <SignupForm onSubmit={handleSignup}>
          <Title>Sign up for WorkSphere</Title>
          <Input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <FileInputContainer>
            <FileInputLabel htmlFor="picture">Profile Picture</FileInputLabel>
            <FileInput
              type="file"
              id="picture"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </FileInputContainer>
          <Button type="submit">Sign Up</Button>
          <LoginLink>
            Already have an account? <Link to="/login">Login</Link>
          </LoginLink>
        </SignupForm>
      </RightSection>

      <LeftSection>
        <Illustration src={pic} alt="WorkSphere Illustration" />
        <MissionStatement>WorkSphere: Cultivating Better Relations and Communications</MissionStatement>
        <FeatureCarousel>
          <Feature>
            <FeatureIcon>
              <FontAwesomeIcon icon={faComments} />
            </FeatureIcon>
            <FeatureTitle>Share Joy and Experiences</FeatureTitle>
          </Feature>
          <Feature>
            <FeatureIcon>
              <FontAwesomeIcon icon={faRobot} />
            </FeatureIcon>
            <FeatureTitle>AI-Powered Hate Speech Detection</FeatureTitle>
          </Feature>
          <Feature>
            <FeatureIcon>
              <FontAwesomeIcon icon={faHandshake} />
            </FeatureIcon>
            <FeatureTitle>Better Relations & Communication</FeatureTitle>
          </Feature>
        </FeatureCarousel>
      </LeftSection>
    </SignupContainer>
  );
};

export default Signup;