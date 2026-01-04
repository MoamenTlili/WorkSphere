import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, BellIcon } from "@heroicons/react/24/outline";
import Notifications from "./Notifications";
import SearchResults from "./SearchResults";
import axios from "axios";
import {
  NavbarContainer,
  Logo,
  SearchContainer,
  SearchBar,
  IconsContainer,
  IconButton,
  ProfileDropdown,
  ProfileButton,
  ProfileImage,
  DropdownContent,
  DropdownItem,
  DropdownButton
} from "../styles/AuthStyles"; 

const Navbar = ({ toggleTheme, theme }) => {
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Get user data from localStorage
  const user = {
    picturePath: localStorage.getItem("userPicture") || "/default-profile.png",
    firstName: localStorage.getItem("userFirstName") || "User",
    lastName: localStorage.getItem("userLastName") || "",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchUsers = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/users/search/${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userPicture");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");

    window.dispatchEvent(new CustomEvent('authChange')); 
    console.log("authChange event dispatched after logout.");

    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  //const loggedInUserId = localStorage.getItem("userId");

  return (
    <NavbarContainer>
      <Logo to="/">WorkSphere</Logo>
      
      <SearchContainer ref={searchRef}>
        <SearchBar
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery && setShowResults(true)}
        />
        {showResults && searchResults.length > 0 && (
          <SearchResults 
            results={searchResults} 
            onSelect={handleResultClick}
          />
        )}
      </SearchContainer>

      <IconsContainer>
        <IconButton onClick={handleThemeToggle}>
          {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </IconButton>
        <Notifications />
        
        <ProfileDropdown ref={dropdownRef}>
          <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <ProfileImage 
              src={`http://localhost:3001${user.picturePath}`} 
              alt={`${user.firstName} ${user.lastName}`}
            />
            <span>{user.firstName}</span>
          </ProfileButton>
          <DropdownContent $isOpen={isDropdownOpen}>
            <DropdownItem to={`/profile/${localStorage.getItem("userId")}`}>
              My Profile
            </DropdownItem>
            <DropdownItem to="/edit-profile">
              Edit Profile
            </DropdownItem>
            <DropdownButton onClick={handleLogout}>
              Logout
            </DropdownButton>
          </DropdownContent>
        </ProfileDropdown>
      </IconsContainer>
    </NavbarContainer>
  );
};

export default Navbar;