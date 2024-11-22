import React from "react";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import GoalEdit from "./Pages/GoalEdit";
import VisualizeGoal from "./Pages/VisualizeGoal";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile.js";
import WatchHistory from "./Pages/WatchHistory.tsx";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router-dom";
import FollowersPage from "./Pages/FollowersPage.js";
import PromptHistory from "./Pages/PromptHistory.tsx";
import WatchtimeLeaderboard from "./Pages/WatchtimeLeaderboard.js";
import GoalLeaderboard from "./Pages/GoalLeaderboard.js";
import YouDashBoard from "./Pages/YouDashBoard";
import WatchTimeChart from "./Components/WatchDataChart.jsx";
import GroupChat from "./Pages/GroupPage.jsx";
import CreateGroup from "./Pages/CreateGroup";
import GroupView from "./Pages/GroupView";
import DirectMessage from "./Pages/DirectMessage.js";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import AllAnnouncementsPage from "./Pages/AllAnnouncementsPage";
import InterestWatchTimeDashboard from "./Pages/InterestWatchtimeLeaderboard.js";

function RouterPages() {
  return (
    <div className="RouterPages">
      <Routes>
        {/* Base routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* User-specific routes */}
        <Route path="/:userId/home" element={<Home />} />
        <Route path="/:userId/youDashBoard" element={<YouDashBoard />} />
        <Route path="/:userId/dashboard/:userID" element={<YouDashBoard />} /> {/* New route for viewing other users' dashboards */}
        <Route path="/:userId/block-categories" element={<BlockedPage />} />
        <Route path="/:userId/goalsCreate" element={<GoalCreate />} />
        <Route path="/:userId/goalsView" element={<GoalView />} />
        <Route path="/:userId/goalsEdit" element={<GoalEdit />} />
        <Route path="/:userId/goalsVis" element={<VisualizeGoal />} />
        <Route path="/:userID/profile" element={<Profile />} />
        <Route path="/:userId/watch-history" element={<WatchHistory />} />
        <Route path="/:userId/followers" element={<FollowersPage />} />
        <Route path="/:userId/goalLeaderboard" element={<GoalLeaderboard />} />
        <Route path="/ai/:userId/promptHistory" element={<PromptHistory />} />
        <Route path="/:userId/watchtime-leaderboard" element={<WatchtimeLeaderboard />} />
        <Route path="/:userId/analytics" element={<WatchTimeChart />} />
        <Route path="/:userId/group-chat/:groupId" element={<GroupChat />} />
        <Route path="/:userId/groupCreate" element={<CreateGroup />} />
        <Route path="/:userId/groupView" element={<GroupView />} />
        <Route path="/:currentUserId/dm" element={<DirectMessage />} />
        <Route path="/:userId/announcements/:groupId" element={<AnnouncementsPage />} />
        <Route path="/:userId/all-announcements" element={<AllAnnouncementsPage />} />
        <Route path="/:userId/leaderboard/:groupId" element={<InterestWatchTimeDashboard />} />
      </Routes>
    </div>
  );
}

export default RouterPages;
