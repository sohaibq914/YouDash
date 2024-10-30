import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FollowersPage = () => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [followingCurrentUser, setFollowingCurrentUser] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsSimilarGoals, setRecommendationsSimilarGoals] = useState([]);
  const [followersOfFollowers, setFollowersOfFollowers] = useState([]);
  const [followersRecommendations, setFollowersRecommendations] = useState([]);
  const [usersWithSimilarGoalTypes, setUsersWithSimilarGoalTypes] = useState([]); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user to get their followers (which are actually who they follow)
        const currentUserResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
        const currentUserFollowers = currentUserResponse.data.followers || [];

        // Get all other data
        const [
          usersResponse,
          followingCurrentUserResponse,
          recommendationsResponse,
          recommendationsSimilarGoalsResponse,
          followersOfFollowersResponse,
          followersRecsResponse,
          similarGoalTypesResponse, // New API call
        ] = await Promise.all([axios.get("http://localhost:8080/api/users"), axios.get(`http://localhost:8080/api/users/${userId}/followers`), axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers`), axios.get(`http://localhost:8080/goals/${userId}/recommended-similar-goals`), axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers-of-followers`), axios.get(`http://localhost:8080/api/users/${userId}/recommendations-from-followers`), axios.get(`http://localhost:8080/goals/${userId}/users-with-similar-goal-types`)]);

        // Update all user lists with following status
        const updateUserList = (userList) =>
          userList.map((user) => ({
            ...user,
            isFollowing: currentUserFollowers.includes(user.id),
          }));

        setUsers(updateUserList(usersResponse.data));
        setFollowingCurrentUser(followingCurrentUserResponse.data);
        setRecommendations(updateUserList(recommendationsResponse.data));
        setRecommendationsSimilarGoals(updateUserList(recommendationsSimilarGoalsResponse.data));
        setFollowersOfFollowers(updateUserList(followersOfFollowersResponse.data));
        setFollowersRecommendations(updateUserList(followersRecsResponse.data));
        setUsersWithSimilarGoalTypes(updateUserList(similarGoalTypesResponse.data));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleFollowUnfollow = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:8080/api/users/${targetUserId}/unfollow/${userId}`);
      } else {
        await axios.post(`http://localhost:8080/api/users/${targetUserId}/follow/${userId}`);
      }

      // Refresh all data after follow/unfollow
      const currentUserResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
      const currentUserFollowers = currentUserResponse.data.followers || [];

      // Fetch all updated data
      const [usersResponse, followingCurrentUserResponse, recommendationsResponse, recommendationsSimilarGoalsResponse, followersOfFollowersResponse, followersRecsResponse, similarGoalTypesResponse] = await Promise.all([axios.get("http://localhost:8080/api/users"), axios.get(`http://localhost:8080/api/users/${userId}/followers`), axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers`), axios.get(`http://localhost:8080/goals/${userId}/recommended-similar-goals`), axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers-of-followers`), axios.get(`http://localhost:8080/api/users/${userId}/recommendations-from-followers`), axios.get(`http://localhost:8080/goals/${userId}/users-with-similar-goal-types`)]);

      // Update all user lists with new following status
      const updateUserList = (userList) =>
        userList.map((user) => ({
          ...user,
          isFollowing: currentUserFollowers.includes(user.id),
        }));

      // Update all states with fresh data
      setUsers(updateUserList(usersResponse.data));
      setFollowingCurrentUser(followingCurrentUserResponse.data);
      setRecommendations(updateUserList(recommendationsResponse.data));
      setRecommendationsSimilarGoals(updateUserList(recommendationsSimilarGoalsResponse.data));
      setFollowersOfFollowers(updateUserList(followersOfFollowersResponse.data));
      setFollowersRecommendations(updateUserList(followersRecsResponse.data));
      setUsersWithSimilarGoalTypes(updateUserList(similarGoalTypesResponse.data));
    } catch (err) {
      console.error("Error updating follow status:", err);
      alert(`Failed to ${isFollowing ? "unfollow" : "follow"} user.`);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center p-2 border rounded">
            <span>{user.name}</span>
            <button onClick={() => handleFollowUnfollow(user.id, user.isFollowing)} className={`px-4 py-2 rounded ${user.isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
              {user.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Following You</h2>
      <ul className="space-y-2">
        {followingCurrentUser.length > 0 ? (
          followingCurrentUser.map((follower) => (
            <li key={follower.id} className="p-2 border rounded">
              {follower.name}
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No one is following you yet.</li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">People Your Network Follows</h2>
      <ul className="space-y-2">
        {followersOfFollowers.length > 0 ? (
          followersOfFollowers.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 border rounded">
              <span>{user.name}</span>
              <button onClick={() => handleFollowUnfollow(user.id, user.isFollowing)} className={`px-4 py-2 rounded ${user.isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No recommendations available.</li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Recommendations from Your Followers</h2>
      <ul className="space-y-2">
        {followersRecommendations.length > 0 ? (
          followersRecommendations.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 border rounded">
              <span>{user.name}</span>
              <button onClick={() => handleFollowUnfollow(user.id, user.isFollowing)} className={`px-4 py-2 rounded ${user.isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No recommendations from your followers available.</li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Users with Similar Goal Types</h2>
      <ul className="space-y-2">
        {usersWithSimilarGoalTypes.length > 0 ? (
          usersWithSimilarGoalTypes.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 border rounded">
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-sm text-gray-500">{[user.wtgoals?.length > 0 && "Watch Time Goals", user.qgoals?.length > 0 && "Quality Goals", user.todgoals?.length > 0 && "Time of Day Goals"].filter(Boolean).join(", ")}</span>
              </div>
              <button onClick={() => handleFollowUnfollow(user.id, user.isFollowing)} className={`px-4 py-2 rounded ${user.isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No users with similar goal types found.</li>
        )}
      </ul>
    </div>
  );
};

export default FollowersPage;
