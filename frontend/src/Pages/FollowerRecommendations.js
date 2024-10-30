// FollowerRecommendations.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FollowerRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers`);
        setRecommendations(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recommendations.");
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [userId]);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Recommended Users to Follow</h2>
      <ul>
        {recommendations.length > 0 ? (
          recommendations.map((user) => (
            <li key={user.id}>
              <span>{user.name}</span>
              {/* Follow/Unfollow button can be added here if needed */}
            </li>
          ))
        ) : (
          <li>No recommendations available.</li>
        )}
      </ul>
    </div>
  );
};

export default FollowerRecommendations;
