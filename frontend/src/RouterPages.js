import React from "react";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import GoalEdit from "./Pages/GoalEdit";
import VisualizeGoal from "./Pages/VisualizeGoal";
import Home from "./Pages/Home";
// import Navbar from "./Components/navbar.js";
import Profile from "./Pages/Profile.js";
import WatchHistory from "./Pages/WatchHistory.tsx";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, Link } from "react-router-dom"; // Remove Router and only import Routes and Route
import FollowersPage from "./Pages/FollowersPage.js";
import PromptHistory from "./Pages/PromptHistory.tsx";
import WatchtimeLeaderboard from "./Pages/WatchtimeLeaderboard.js";
import YouDashBoard from "./Pages/YouDashBoard"
import WatchTimeChart from "./Components/WatchDataChart.jsx";

function RouterPages() {
  return (
    <div className="RouterPages">
      {/* Routes holds each page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:userId/home" element={<Home />} />
        <Route path="/:userId/youDashBoard" element={<YouDashBoard />} />
        <Route path="/:userId/block-categories" element={<BlockedPage />} />
        <Route path="/:userId/goalsCreate" element={<GoalCreate />} />
        <Route path="/:userId/goalsView" element={<GoalView />} />
        <Route path="/:userId/goalsEdit" element={<GoalEdit />} />
        <Route path="/:userId/goalsVis" element={<VisualizeGoal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/navbar" element={<Navbar />} /> */}
        <Route path="/:userId/profile" element={<Profile />} />
        <Route path="/:userId/watch-history" element={<WatchHistory />} />
        <Route path="/:userId/followers" element={<FollowersPage />} />
        <Route path="/ai/:userId/promptHistory" element={<PromptHistory />} />
        <Route path="/:userId/watchtime-leaderboard" element={<WatchtimeLeaderboard />} /> {/* Add new route */}
        <Route path="/:userId/analytics" element={<WatchTimeChart />}/>
      </Routes>
    </div>
  );
}

export default RouterPages;
