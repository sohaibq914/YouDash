import React from "react";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import GoalEdit from "./Pages/GoalEdit";
import Home from "./Pages/Home";
import Login from "./Pages/Login"; // Import the Login component
import Signup from "./Pages/Signup.js"; // Ensure this matches the actual file name
import Navbar from "./Components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function RouterPages() {
  return (
    <Router>
      <div className="RouterPages">
        {/* Routes holds each page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/block-categories" element={<BlockedPage />} />
          <Route path="/goalsCreate" element={<GoalCreate />} />
          <Route path="/goalsView" element={<GoalView />} />
          <Route path="/goalsEdit" element={<GoalEdit />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} /> {/* SignUp route */}
        </Routes>
      </div>
    </Router>
  );
}

export default RouterPages;
