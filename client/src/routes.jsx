import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";


const AppRoutes = ({ toggleTheme, theme }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  

  const location = useLocation(); 


  const noNavbarPaths = ["/login", "/signup"];


  const showNavbar = !noNavbarPaths.includes(location.pathname);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  if (initialLoad && !location) { 
    return <div>Loading...</div>;
  }

  return (
    <> 
      {showNavbar && <Navbar toggleTheme={toggleTheme} theme={theme} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        
        <Route 
          path="/admin/*" 
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/feed" replace state={{ from: "admin" }} />
            )
          } 
        />
        
        <Route 
          path="/" 
          element={
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/feed" replace />
            )
          } 
        />
        
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </>
  );
};

const AppRoutesWrapper = (props) => (
  <Router>
    <AppRoutes {...props} />
  </Router>
);

export default AppRoutesWrapper;