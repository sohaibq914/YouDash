import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios"; // Import axios to communicate with backend

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open
  const [darkMode, setDarkMode] = useState(false); // State to track dark mode

  // Fetch user's dark mode setting from the backend when component mounts
  useEffect(() => {
    const fetchDarkModeSetting = async () => {
      try {
        const response = await axios.get("http://localhost:8080/profile/darkmode"); // Updated API path
        setDarkMode(response.data.darkMode); // Set dark mode state based on fetched data
        document.body.classList.toggle("dark", response.data.darkMode); // Apply initial theme based on fetched setting
      } catch (error) {
        console.error("Failed to fetch dark mode setting:", error);
      }
    };
    fetchDarkModeSetting();
  }, []);

  // Handle dark mode toggle button click
  const handleDarkModeToggle = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark", newDarkMode); // Toggle dark mode class on body

    try {
      // Save dark mode setting in the backend
      await axios.post("http://localhost:8080/profile/darkmode", { darkMode: newDarkMode }); // Updated API path
    } catch (error) {
      console.error("Failed to save dark mode setting:", error);
    }
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <Link to="/" className="title">
        YouDash
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/block-categories">Block Categories</NavLink>
        </li>
        <li>
          <NavLink id="goalsCreate" to="/goalsCreate">Create Goals</NavLink>
        </li>
        <li>
          <NavLink id="goalsView" to="/goalsView">View Goals</NavLink>
        </li>
        <li>
          <NavLink id="goalsEdit" to="/goalsEdit">Edit Goals</NavLink>
        </li>
        <li>
          <NavLink id="goalsVis" to="/goalsVis">Visualize Goals</NavLink>
        </li>
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li>
          {/* Dark mode toggle button */}
          <button onClick={handleDarkModeToggle} className="dark-mode-btn">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <NavLink to="/watch-history">Watch History</NavLink>
        </li>
      </ul>
    </nav>
  );
};
