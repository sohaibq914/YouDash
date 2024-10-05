import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import GoalEdit from "./Pages/GoalEdit";
import Home from "./Pages/Home";
import Navbar from "./Components/navbar.js";
import Profile from "./Pages/Profile.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default RouterPages;
