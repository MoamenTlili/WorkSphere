import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../assets/pic.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faRobot,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import {
  fadeIn,
  gradientShift,
  pulse,
  LoginContainer,
  LeftSection,
  Illustration,
  MissionStatement,
  FeatureCarousel,
  Feature,
  FeatureIcon,
  FeatureTitle,
  RightSection,
  LoginForm,
  Input,
  Button,
  SignupLink,
  ErrorMessage
} from "../styles/AuthStyles"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/auth/login", { email, password });
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("isAdmin", response.data.user.isAdmin.toString());
      localStorage.setItem("userPicture", response.data.user.picturePath);
      localStorage.setItem("userFirstName", response.data.user.firstName);
      localStorage.setItem("userLastName", response.data.user.lastName);
      
      window.dispatchEvent(new CustomEvent('authChange'));
      console.log("authChange event dispatched after login."); 

      console.log("Login successful. User data:", {
        userId: response.data.user._id,
        isAdmin: response.data.user.isAdmin
      });
  
      if (response.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/feed");
      }
      
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <LoginContainer>
      <RightSection>
        <LoginForm onSubmit={handleLogin}>
          <h2>Login to WorkSphere</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Login</Button>
          <SignupLink>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </SignupLink>
        </LoginForm>
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
    </LoginContainer>
  );
};

export default Login;