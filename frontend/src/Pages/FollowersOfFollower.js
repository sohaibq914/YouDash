// FollowersOfFollower.js
import React, { useState } from "react";
import axios from "axios";

const FollowersOfFollower = ({ followerId }) => {
  const [followersOfFollower, setFollowersOfFollower] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFollowersOfFollower = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${followerId}/followers-of-follower`);
      setFollowersOfFollower(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch followers.");
      setLoading(false);
    }
  };

  const handleExpand = () => {
    if (!expanded) {
      fetchFollowersOfFollower();
    }
    setExpanded(!expanded);
  };

  return (
    <div>
      <button onClick={handleExpand}>{expanded ? "Hide Followers" : "View Followers"}</button>
      {loading && <div>Loading followers...</div>}
      {error && <div>{error}</div>}
      {expanded && followersOfFollower.length > 0 && (
        <ul>
          {followersOfFollower.map((follower) => (
            <li key={follower.id}>{follower.name}</li>
          ))}
        </ul>
      )}
      {expanded && followersOfFollower.length === 0 && !loading && <div>No followers available.</div>}
    </div>
  );
};

export default FollowersOfFollower;
