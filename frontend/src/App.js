import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Navbar } from "./Components/Navbar.jsx";
import RouterPages from "./RouterPages.js";
import 'react-notifications-component/dist/theme.css'
import { ReactNotifications } from 'react-notifications-component'
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./App.css";

// Add this at the top of App.js, after imports
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080'; // Optional but recommended

function App() {
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Google Client ID
  const googleClientId = "100708680067-lo35ieok973sub71he44sjtsmqmg73i1.apps.googleusercontent.com"; // Replace with your actual client ID

  // Fetch dark mode setting on component mount
  useEffect(() => {
    const fetchDarkModeSetting = async () => {
      try {
        const response = await axios.get("http://localhost:8080/profile/darkmode");
        setDarkMode(response.data.darkMode);
        applyDarkModeStyles(response.data.darkMode);
      } catch (error) {
        console.error("There was an error fetching the dark mode setting!", error);
      }
    };

    fetchDarkModeSetting();
  }, []);

  // Apply or remove the dark mode CSS file dynamically
  const applyDarkModeStyles = (isDarkMode) => {
    const darkModeStylesheetId = "dark-mode-stylesheet";
    let darkModeStylesheet = document.getElementById(darkModeStylesheetId);

    if (isDarkMode && !darkModeStylesheet) {
      darkModeStylesheet = document.createElement("link");
      darkModeStylesheet.rel = "stylesheet";
      darkModeStylesheet.id = darkModeStylesheetId;
      darkModeStylesheet.href = "/darkmode.css";
      document.head.appendChild(darkModeStylesheet);
    } else if (!isDarkMode && darkModeStylesheet) {
      document.head.removeChild(darkModeStylesheet);
    }
  };

  // Toggle dark mode state and save to backend
  const handleDarkModeToggle = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    applyDarkModeStyles(newDarkMode);

    try {
      await axios.post("http://localhost:8080/profile/darkmode", { darkMode: newDarkMode });
    } catch (error) {
      console.error("Failed to save dark mode setting:", error);
    }
  };

  // Fetch message data from API
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/message")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <>
        <Navbar darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />
        <div className={`App ${darkMode ? "dark" : ""}`} style={{ width: "100%", overflow: "hidden" }}>
          <ReactNotifications />
          <div style={{ marginTop: "56px" }}>
            <RouterPages />
          </div>
        </div>
      </>
    </GoogleOAuthProvider>
  );
}

export default App;