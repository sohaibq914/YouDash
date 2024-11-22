import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function InterestWatchTimeDashboard() {
  const [groupUsers, setGroupUsers] = useState([]); // Store users in the current group
  const [userWatchTimes, setUserWatchTimes] = useState([]); // Store users with watch times by category
  const [followers, setFollowers] = useState([]); // Store followers of currentUser
  const [category, setCategory] = useState("all"); // State for category filter
  const [hasFetched, setHasFetched] = useState(false); // To track if watch time was fetched
  const [showFollowersOnly, setShowFollowersOnly] = useState(false); // Toggle to show followers only
  const { userId: currentUser, groupId } = useParams(); // Get current user and group ID from URL params

  // Reload page every minute
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60000); // Reload every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Fetch users in the current group
  const getGroupUsers = async () => {
    console.log(groupId);
    try {
      const response = await axios.get(`http://localhost:8080/groups/${groupId}/viewgroup`);
      setGroupUsers(response.data); // Map user IDs to user objects
      return response.data;
    } catch (error) {
      console.error("Error fetching group users:", error);
      return [];
    }
  };



  // Fetch followers of the current user
  const getFollowers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${currentUser}/followers`);
      setFollowers(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching followers for user ${currentUser}:`, error);
      return [];
    }
  };

  // Fetch total watch time for a user
  const fetchTotalWatchTime = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/watch-history/${userId}/totalWatchTime`);
      return response.data; // This is the total watch time
    } catch (error) {
      console.error(`Error fetching total watch time for user ${userId}:`, error);
      return 0; // Return 0 on error
    }
  };

  // Fetch watch time by category for a user
  const fetchWatchTimeByCategory = async (userId, selectedCategory) => {
    try {
      const response = await axios.get(`http://localhost:8080/watch-history/${userId}/watchTimeByCategory/${selectedCategory}`);
      return response.data; // This is the watch time for the specific category
    } catch (error) {
      console.error(`Error fetching watch time by category for user ${userId}:`, error);
      return 0; // Return 0 on error
    }
  };

  // Fetch all users' watch times (either total or by category)
  const fetchGroupUsersWatchTime = async () => {
    const usersList = await getGroupUsers(); // Get users in the current group first
    const userWatchTimeData = await Promise.all(
      usersList.map(async (user) => {
        let watchTime;
        if (category === "all") {
          watchTime = await fetchTotalWatchTime(user.id); // Fetch total watch time if no category is selected
        } else {
          watchTime = await fetchWatchTimeByCategory(user.id, category); // Fetch watch time for selected category
        }
        return { ...user, watchTime }; // Combine user data with their watch time
      })
    );
    setUserWatchTimes(userWatchTimeData);
    setHasFetched(true);
  };

  // Fetch followers' watch times
  const fetchFollowersWatchTime = async () => {
    const followersList = await getFollowers(); // Get followers of currentUser first
    const followersWatchTimeData = await Promise.all(
      followersList.map(async (follower) => {
        let watchTime;
        if (category === "all") {
          watchTime = await fetchTotalWatchTime(follower.id); // Fetch total watch time for each follower
        } else {
          watchTime = await fetchWatchTimeByCategory(follower.id, category); // Fetch watch time for selected category
        }
        return { ...follower, watchTime }; // Combine follower data with their watch time
      })
    );
    setUserWatchTimes(followersWatchTimeData); // Set watch times for followers
    setHasFetched(true);
  };

  // Fetch watch times on component mount or when category changes
  useEffect(() => {
    if (showFollowersOnly) {
      fetchFollowersWatchTime(); // Fetch watch times for followers only
    } else {
      fetchGroupUsersWatchTime(); // Fetch watch times for users in the current group
    }
  }, [category, showFollowersOnly, groupId]); // Re-fetch when category, toggle, or group changes

  const sortedUsers = userWatchTimes.sort((a, b) => b.watchTime - a.watchTime);

  return (
    <div className="WatchTimeDashboard">
      <h1>User Watch Time Leaderboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="categoryFilter">Filter by category: </label>
        <select
          id="categoryFilter"
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Update the category and re-fetch watch times
        >
          <option value="all">All Categories</option>
          <option value="1">Film & Animation</option>
          {/* Add more category options */}
        </select>
      </div>

      {/* Toggle for showing only followers' watch times */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={showFollowersOnly}
            onChange={(e) => setShowFollowersOnly(e.target.checked)} // Toggle followers only
          />
          Show Followers Only
        </label>
      </div>

      {hasFetched && (
        <div>
          <h2>Leaderboard</h2>
          {sortedUsers.length > 0 ? (
            <ul>
              {sortedUsers.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.username}) - {user.watchTime > 0 ? `Watch Time: ${user.watchTime} hours` : "Not enough data"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found for the selected category.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default InterestWatchTimeDashboard;