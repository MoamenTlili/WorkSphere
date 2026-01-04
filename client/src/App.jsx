import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import AppRoutesWrapper from "./routes"; 
import { lightTheme, darkTheme } from "./styles/theme";
import GlobalStyles from "./styles/GlobalStyles";
import { ContentWarningProvider } from "./components/ContentWarningContext"; 
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ContentWarningProvider> 
        <SocketProvider>
        <GlobalStyles />
        <AppRoutesWrapper toggleTheme={toggleTheme} theme={theme} /> 
        </SocketProvider>
      </ContentWarningProvider>
    </ThemeProvider>
  );
};

export default App;