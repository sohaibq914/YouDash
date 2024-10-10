import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FollowersPage.css"; // Import CSS for styling

const FollowersPage = () => {
  const [users, setUsers] = useState([]);
  const [myFollowers, setMyFollowers] = useState([]); // New state to store the current user's followers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(12345); // Replace with logic to get the current user ID

  // Fetch users and followers from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:8080/api/users"); // Fetch all users
        const myFollowersResponse = await axios.get(`http://localhost:8080/api/users/${currentUserId}/my-followers`); // Fetch followers of the current user

        setUsers(usersResponse.data);
        setMyFollowers(myFollowersResponse.data); // Store the current user's followers in state
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users or followers.");
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUserId]);

  const handleFollowUnfollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:8080/api/users/${userId}/unfollow`);
        alert("Unfollowed successfully!");
      } else {
        await axios.post(`http://localhost:8080/api/users/${userId}/follow`);
        alert("Followed successfully!");
      }

      // Update the UI by refreshing the users' state (just toggling follow state)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                isFollowing: !isFollowing,
              }
            : user
        )
      );

      // Re-fetch the followers list for the current user to keep the state accurate
      const myFollowersResponse = await axios.get(`http://localhost:8080/api/users/${currentUserId}/my-followers`);
      setMyFollowers(myFollowersResponse.data); // Update followers state
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isFollowing ? "unfollow" : "follow"} user.`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="followers-page">
      <h1>Users</h1>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span>{user.name}</span>
            <button onClick={() => handleFollowUnfollow(user.id, user.isFollowing)} className="follow-button">
              {user.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </li>
        ))}
      </ul>

      {/* Display section for followers of the current user */}
      <h2>Your Followers</h2>
      <ul className="followers-list">
        {myFollowers.length > 0 ? (
          myFollowers.map((follower) => (
            <li key={follower.id} className="follower-item">
              {follower.name}
            </li>
          ))
        ) : (
          <li>No followers yet.</li>
        )}
      </ul>
    </div>
  );
};

export default FollowersPage;
