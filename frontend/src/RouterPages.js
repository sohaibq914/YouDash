import React from "react";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import GoalEdit from "./Pages/GoalEdit";
import VisualizeGoal from "./Pages/VisualizeGoal";
import Home from "./Pages/Home";
// import Navbar from "./Components/navbar.js";
import Profile from "./Pages/Profile.js";
import WatchHistory from "./Pages/WatchHistory.tsx"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, Link } from "react-router-dom"; // Remove Router and only import Routes and Route

function RouterPages() {
  return (
    <div className="RouterPages">
      {/* Routes holds each page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/block-categories" element={<BlockedPage />} />
        <Route path="/goalsCreate" element={<GoalCreate />} />
        <Route path="/goalsView" element={<GoalView />} />
        <Route path="/goalsEdit" element={<GoalEdit />} />
        <Route path="/goalsVis" element={<VisualizeGoal />} />
        {/* <Route path="/navbar" element={<Navbar />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/watch-history" element={<WatchHistory />}/>
      </Routes>
    </div>
  );
}

export default RouterPages;
