import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
  const [userID, setUserID] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDarkModeSetting = async () => {
      console.log(userID);
      try {
        const response = await axios.get("http://localhost:8080/profile/darkmode");
        setDarkMode(response.data.darkMode);
        document.body.classList.toggle("dark", response.data.darkMode);
      } catch (error) {
        console.error("Failed to fetch dark mode setting:", error);
      }
    };
    fetchDarkModeSetting();
    getUser();
  }, [window.location.href]);

  const handleDarkModeToggle = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark", newDarkMode);

    try {
      await axios.post("http://localhost:8080/profile/darkmode", { darkMode: newDarkMode });
    } catch (error) {
      console.error("Failed to save dark mode setting:", error);
    }
  };

  const getUser = () => {
    let theUrl = window.location.href;
    console.log(theUrl);
    if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
      setUserID(null);
      return;
    }
    console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
    setUserID(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
    console.log(userID);
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
      {userID != null && String(userID).length != 0 ? (
        <>
          <ul className={menuOpen ? "open" : ""}>
            <li>
              <NavLink to={"/" + String(userID) + "/home"}>Home</NavLink>
            </li>
            <li>
              <NavLink id="youDashBoard" to={"/" + String(userID) + "/youDashBoard"}>
                YouDashBoard
              </NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/block-categories"}>Block Categories</NavLink>
            </li>
            <li>
              <NavLink id="groupCreate" to={"/" + String(userID) + "/groupCreate"}>
                Create Group
              </NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/interest-groups"}>Interest Groups</NavLink>
            </li>
            <li>
              <NavLink id="goalsCreate" to={"/" + String(userID) + "/goalsCreate"}>
                Create Goals
              </NavLink>
              <NavLink id="goalsView" to={"/" + String(userID) + "/goalsView"}>
                View Goals
              </NavLink>
            </li>
            <li>
              <NavLink id="goalsEdit" to={"/" + String(userID) + "/goalsEdit"}>
                Edit Goals
              </NavLink>
              <NavLink id="goalsVis" to={"/" + String(userID) + "/goalsVis"}>
                Visual Goals
              </NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/profile"}>Profile</NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/watch-history"}>Watch History</NavLink>
            </li>
            <li>
              <NavLink id="analytics-button" to={"/" + String(userID) + "/analytics"}>
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/goalLeaderboard"}>Top Goal</NavLink>
              <NavLink to={"/" + String(userID) + "/watchtime-leaderboard"}>Top Watchtime</NavLink>
            </li>
            <li>
              <button onClick={handleDarkModeToggle} className="dark-mode-btn">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul className={menuOpen ? "open" : ""}>
            <li>
              <NavLink to="/login">Home</NavLink>
            </li>
            <li>
              <NavLink id="youDashBoard" to="/login">
                YouDashBoard
              </NavLink>
            </li>
            <li>
              <NavLink to="/login">Block Categories</NavLink>
            </li>
            <li>
              <NavLink id="groupCreate" to="/login">
                Create Group
              </NavLink>
            </li>
            <li>
              <NavLink to="/login">Interest Groups</NavLink>
            </li>
            <li>
              <NavLink id="goalsCreate" to="/login">
                Create Goals
              </NavLink>
              <NavLink id="goalsView" to="/login">
                View Goals
              </NavLink>
            </li>
            <li>
              <NavLink id="goalsEdit" to="/login">
                Edit Goals
              </NavLink>
              <NavLink id="goalsVis" to="/login">
                Visual Goals
              </NavLink>
            </li>
            <li>
              <NavLink to="/login">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/login">Watch History</NavLink>
            </li>
            <li>
              <button onClick={handleDarkModeToggle} className="dark-mode-btn">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;