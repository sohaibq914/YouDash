import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink, useNavigate, useLocation} from "react-router-dom";
import axios from "axios"; // Import axios to communicate with backend

export const Navbar = () => {
  const [userID, setUserID] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open
  const [darkMode, setDarkMode] = useState(false); // State to track dark mode
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (location.pathname === "/signup") {
          return;
        }
        const response = await axios.get("http://localhost:8080/api/users/session", {
          withCredentials: true,
        });
        setUserID(response.data.userId); // Set userID from session
      } catch (error) {
        console.error("No active session:", error);
        setUserID(null);
        navigate("/login"); // Redirect to login if not logged in
      }
    };

    checkSession();
  }, [navigate]);

  // Fetch user's dark mode setting from the backend when component mounts
  useEffect(() => {
    const fetchDarkModeSetting = async () => {
      console.log(userID);
      try {
        const response = await axios.get("http://localhost:8080/profile/darkmode"); // Updated API path
        setDarkMode(response.data.darkMode); // Set dark mode state based on fetched data
        document.body.classList.toggle("dark", response.data.darkMode); // Apply initial theme based on fetched setting
      } catch (error) {
        console.error("Failed to fetch dark mode setting:", error);
      }
    };
    fetchDarkModeSetting();
    getUser();
  }, [window.location.href]);

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
                  <div className="dropdown" style={{marginLeft: "8px", marginRight: "8px"}}>
                                  <button style={{fontSize: "0.9rem"}} className="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown">Groups <span className="caret"></span></button>
                      <ul className="dropdown-menu" role="menu">
                    <li>
                      <NavLink id="groupView" to={"/" + String(userID) + "/groupView"}>
                        View Groups
                      </NavLink>
                    </li>
                    <li>
                      <NavLink id="groupCreate" to={"/" + String(userID) + "/groupCreate"}>
                        Create Group
                      </NavLink>
                    </li>
                    </ul>
                    </div>
            </li>
            <li>
              <div className="dropdown" style={{marginLeft: "8px", marginRight: "8px"}}>
                              <button style={{fontSize: "0.9rem"}} className="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown">Goals <span className="caret"></span></button>
                  <ul className="dropdown-menu" role="menu">
                  <li>
                    <NavLink id="goalsCreate" to={"/" + String(userID) + "/goalsCreate"}>
                      Create Goals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink id="goalsView" to={"/" + String(userID) + "/goalsView"}>
                      View Goals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink id="goalsEdit" to={"/" + String(userID) + "/goalsEdit"}>
                      Edit Goals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink id="goalsVis" to={"/" + String(userID) + "/goalsVis"}>
                      Visual Goals
                    </NavLink>
                  </li>
                  </ul>
                  </div>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/profile"}>Profile</NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/dm"}>DMs</NavLink>
            </li>
            <li>
              <NavLink to={"/" + String(userID) + "/watch-history"}>Watch History</NavLink>
            </li>
            <li>
                      <div className="dropdown" style={{marginLeft: "8px", marginRight: "8px"}}>
                                      <button style={{fontSize: "0.9rem"}} className="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown">Leaderboards <span className="caret"></span></button>
                          <ul className="dropdown-menu" role="menu">
                    <li>
                      <NavLink to={"/" + String(userID) + "/goalLeaderboard"}>Top Goal</NavLink>
                    </li>
                    <li>
                      <NavLink to={"/" + String(userID) + "/watchtime-leaderboard"}>Top Watchtime</NavLink>
                    </li>
                    </ul>
                    </div>
            </li>
            <li>
              {/* Dark mode toggle button */}
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
                  <div className="dropdown" style={{marginLeft: "8px", marginRight: "8px"}}>
                                  <button style={{fontSize: "0.9rem"}} className="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown">Groups <span className="caret"></span></button>
                      <ul className="dropdown-menu" role="menu">
                    <li>
                      <NavLink id="groupView" to={"/login"}>
                        View Groups
                      </NavLink>
                    </li>
                    <li>
                      <NavLink id="groupCreate" to="/login">
                        Create Group
                      </NavLink>
                    </li>
                    </ul>
                    </div>
            </li>
            <li>
              <div className="dropdown" style={{marginLeft: "8px", marginRight: "8px"}}>
                              <button style={{fontSize: "0.9rem"}} className="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown">Goals <span className="caret"></span></button>
                  <ul className="dropdown-menu" role="menu">
                  <li>
                    <NavLink id="goalsCreate" to={"/login"}>
                      Create Goals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink id="goalsView" to={"/login"}>
                      View Goals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink id="goalsEdit" to={"/login"}>
                      Edit Goals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink id="goalsVis" to={"/login"}>
                      Visual Goals
                    </NavLink>
                  </li>
                  </ul>
                  </div>
            </li>
            <li>
              <NavLink to="/login">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/login">Watch History</NavLink>
            </li>
            <li>
                          <div className="dropdown" style={{marginLeft: "8px", marginRight: "8px"}}>
                                          <button style={{fontSize: "0.9rem"}} className="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown">Leaderboards <span className="caret"></span></button>
                              <ul className="dropdown-menu" role="menu">
                        <li>
                          <NavLink to={"/login"}>Top Goal</NavLink>
                        </li>
                        <li>
                          <NavLink to={"/login"}>Top Watchtime</NavLink>
                        </li>
                        </ul>
                        </div>
                </li>

            <li>
              {/* Dark mode toggle button */}
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
