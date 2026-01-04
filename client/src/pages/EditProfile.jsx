import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import {
  EditProfileContainer,
  ContentWrapper,
  Form,
  FormGroup,
  Label,
  Input,
  FileInputLabel,
  ProfileImage,
  Button,
  ErrorMessage,

} from "../styles/EditProfileStyles";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    department: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const { firstName, lastName, email, location, department, picturePath } = response.data;
        setFormData({
          firstName,
          lastName,
          email,
          location,
          department,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        if (picturePath) {
          setPreviewImage(`http://localhost:3001${picturePath}`);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (profilePicture) {
        data.append("picture", profilePicture);
      }

      const response = await axios.patch(
        `http://localhost:3001/users/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("userFirstName", response.data.firstName);
      localStorage.setItem("userLastName", response.data.lastName);
      if (response.data.picturePath) {
        localStorage.setItem("userPicture", response.data.picturePath);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate(`/profile/${userId}`);
      }, 1500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <>
      <EditProfileContainer>
        <ContentWrapper>
          
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <FormGroup>
              <Label>Profile Picture</Label>
              <FileInputLabel>
                {previewImage ? (
                  <ProfileImage src={previewImage} alt="Profile" />
                ) : (
                  <span>Click to upload a new profile picture</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </FileInputLabel>
            </FormGroup>

            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Department</Label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormGroup>

            <h3>Change Password</h3>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </FormGroup>

            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </FormGroup>

            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </FormGroup>

            <Button type="submit">Save Changes</Button>
          </Form>
        </ContentWrapper>
      </EditProfileContainer>
    </>
  );
};

export default EditProfile;