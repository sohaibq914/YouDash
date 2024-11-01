import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const FollowersPage = () => {
  const { userId } = useParams();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [followingCurrentUser, setFollowingCurrentUser] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsSimilarGoals, setRecommendationsSimilarGoals] = useState([]);
  const [followersOfFollowers, setFollowersOfFollowers] = useState([]);
  const [followersRecommendations, setFollowersRecommendations] = useState([]);
  const [usersWithSimilarGoalTypes, setUsersWithSimilarGoalTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
        const currentUserFollowers = currentUserResponse.data.followers || [];
        const pendingRequestsResponse = await axios.get(`http://localhost:8080/api/privacy/${userId}/pending-requests`);

        const [
          usersResponse,
          followingCurrentUserResponse,
          recommendationsResponse,
          recommendationsSimilarGoalsResponse,
          followersOfFollowersResponse,
          followersRecsResponse,
          similarGoalTypesResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/users"),
          axios.get(`http://localhost:8080/api/users/${userId}/followers`),
          axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers`),
          axios.get(`http://localhost:8080/goals/${userId}/recommended-similar-goals`),
          axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers-of-followers`),
          axios.get(`http://localhost:8080/api/users/${userId}/recommendations-from-followers`),
          axios.get(`http://localhost:8080/goals/${userId}/users-with-similar-goal-types`)
        ]);

        const updateUserList = (userList) =>
          userList.map((user) => ({
            ...user,
            isFollowing: currentUserFollowers.includes(user.id),
            hasPendingRequest: pendingRequestsResponse.data.some(
              request => request.requesterId === parseInt(userId) && 
              request.status === "PENDING"
            )
          }));

        setPendingRequests(pendingRequestsResponse.data);
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

  const handleRequest = async (requesterId, accept) => {
    try {
      await axios.post(`http://localhost:8080/api/privacy/${userId}/handle-request`, {
        requesterId,
        accept
      });

      // Refresh pending requests
      const pendingResponse = await axios.get(`http://localhost:8080/api/privacy/${userId}/pending-requests`);
      setPendingRequests(pendingResponse.data);

      setSuccessMessage(accept ? "Follow request accepted" : "Follow request rejected");
      setTimeout(() => setSuccessMessage(""), 3000);

      // If accepted, refresh followers list
      if (accept) {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}/followers`);
        setFollowingCurrentUser(response.data);
      }
    } catch (err) {
      console.error("Error handling request:", err);
      setError("Failed to handle request");
    }
  };

  const getUser = () => {
    let theUrl = window.location.href;
    if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
      return null;
    }
    return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));
  };

  const handleFollowUnfollow = async (targetUserId, isFollowing, isRequesting) => {
    try {
      if (isRequesting) {
        await axios.post(`http://localhost:8080/api/users/${targetUserId}/follow/${userId}`, null, {
          params: { requesterId: userId }
        });
        setSuccessMessage("Follow request sent");

      } else {
      if (isFollowing) {
        await axios.post(`http://localhost:8080/api/users/${targetUserId}/unfollow/${userId}`);
      } else {
        // First, get the target user's privacy status
        const targetUserResponse = await axios.get(`http://localhost:8080/api/users/${targetUserId}`);
        const isPrivateAccount = targetUserResponse.data.isPrivateAccount;
        console.log(isPrivateAccount, targetUserResponse);

        if (isPrivateAccount) {
          // For private accounts, send a follow request
          await axios.post(`http://localhost:8080/api/users/${targetUserId}-fr/follow/${userId}`, null, {
            params: { requesterId: userId }
          });
          setSuccessMessage("Follow request sent");
        } else {
          // For public accounts, directly follow
          await axios.post(`http://localhost:8080/api/users/${targetUserId}/follow/${userId}`);
          setSuccessMessage("Successfully followed user");
        }
      }
    }

      // Refresh data
      const [currentUserResponse, pendingRequestsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/users/${userId}`),
        axios.get(`http://localhost:8080/api/privacy/${userId}/pending-requests`)
      ]);
      
      const currentUserFollowers = currentUserResponse.data.followers || [];

      const [
        usersResponse,
        followingCurrentUserResponse,
        recommendationsResponse,
        recommendationsSimilarGoalsResponse,
        followersOfFollowersResponse,
        followersRecsResponse,
        similarGoalTypesResponse
      ] = await Promise.all([
        axios.get("http://localhost:8080/api/users"),
        axios.get(`http://localhost:8080/api/users/${userId}/followers`),
        axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers`),
        axios.get(`http://localhost:8080/goals/${userId}/recommended-similar-goals`),
        axios.get(`http://localhost:8080/api/users/${userId}/recommended-followers-of-followers`),
        axios.get(`http://localhost:8080/api/users/${userId}/recommendations-from-followers`),
        axios.get(`http://localhost:8080/goals/${userId}/users-with-similar-goal-types`)
      ]);

      const updateUserList = (userList) =>
        userList.map((user) => ({
          ...user,
          isFollowing: currentUserFollowers.includes(user.id),
          isRequesting: currentUserFollowers.includes(user.id + "-fr"),
          hasPendingRequest: pendingRequestsResponse.data.some(
            request => request.requesterId === parseInt(userId) && 
            request.status === "PENDING"
          )
        }));

      setUsers(updateUserList(usersResponse.data));
      setFollowingCurrentUser(followingCurrentUserResponse.data);
      setRecommendations(updateUserList(recommendationsResponse.data));
      setRecommendationsSimilarGoals(updateUserList(recommendationsSimilarGoalsResponse.data));
      setFollowersOfFollowers(updateUserList(followersOfFollowersResponse.data));
      setFollowersRecommendations(updateUserList(followersRecsResponse.data));
      setUsersWithSimilarGoalTypes(updateUserList(similarGoalTypesResponse.data));

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating follow status:", err);
      setError("Failed to update follow status");
    }
  };

  const UserListItem = ({ user, showFollowButton = true }) => (
    <li key={user.id} className="flex justify-between items-center p-2 border rounded">
      <div className="flex flex-col">
        {user.isFollowing ? (
          <>
            <Link to={`http://localhost:3000/${getUser()}/dashboard/${user.id}`} className="hover:text-blue-500">
              <span>{user.name}</span>
            </Link>
            {user.wtgoals && (
              <span className="text-sm text-gray-500">
                {[
                  user.wtgoals?.length > 0 && "Watch Time Goals",
                  user.qgoals?.length > 0 && "Quality Goals",
                  user.todgoals?.length > 0 && "Time of Day Goals"
                ].filter(Boolean).join(", ")}
              </span>
            )}
          </>
        ) : (
          <>
          {user.isRequesting ? (
            <>
              <span>{user.name}</span>
            {user.wtgoals && (
              <span className="text-sm text-gray-500">
                {[
                  user.wtgoals?.length > 0 && "Watch Time Goals",
                  user.qgoals?.length > 0 && "Quality Goals",
                  user.todgoals?.length > 0 && "Time of Day Goals"
                ].filter(Boolean).join(", ")}
              </span>
            )}
            </>
          ) : ( <>
            <span>{user.name}</span>
            {user.wtgoals && (
              <span className="text-sm text-gray-500">
                {[
                  user.wtgoals?.length > 0 && "Watch Time Goals",
                  user.qgoals?.length > 0 && "Quality Goals",
                  user.todgoals?.length > 0 && "Time of Day Goals"
                ].filter(Boolean).join(", ")}
              </span>
            )}
            </>
          )}
          </>
        )}
      </div>
      {showFollowButton && (
        <button
          onClick={() => handleFollowUnfollow(user.id, user.isFollowing, user.isRequesting)}
          className={`px-4 py-2 rounded ${
            user.isFollowing 
              ? "bg-red-500 text-white" 
              : user.isRequesting
                ? "bg-gray-500 text-white"
                : "bg-blue-500 text-white"
          }`}
          disabled={user.hasPendingRequest}
        >
          {user.isFollowing 
            ? "Unfollow" 
            : user.isRequesting 
              ? "Accept Request"
              : "Follow"}
        </button>
      )}
    </li>
  );

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Pending Follow Requests</h2>
          <ul className="space-y-2">
            {pendingRequests.map((request) => (
              <li key={request.requesterId} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div>
                  <span className="font-medium">{request.requesterName}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    Requested {new Date(request.requestDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRequest(request.requesterId, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(request.requesterId, false)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Following You</h2>
      <ul className="space-y-2">
        {followingCurrentUser.length > 0 ? (
          followingCurrentUser.map((follower) => (
            <UserListItem key={follower.id} user={follower} showFollowButton={false} />
          ))
        ) : (
          <li className="p-2 text-gray-500">No one is following you yet.</li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">People Your Network Follows</h2>
      <ul className="space-y-2">
        {followersOfFollowers.length > 0 ? (
          followersOfFollowers.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))
        ) : (
          <li className="p-2 text-gray-500">No recommendations available.</li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Recommendations from Your Followers</h2>
      <ul className="space-y-2">
        {followersRecommendations.length > 0 ? (
          followersRecommendations.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))
        ) : (
          <li className="p-2 text-gray-500">No recommendations from your followers available.</li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Users with Similar Goal Types</h2>
      <ul className="space-y-2">
        {usersWithSimilarGoalTypes.length > 0 ? (
          usersWithSimilarGoalTypes.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))
        ) : (
          <li className="p-2 text-gray-500">No users with similar goal types found.</li>
        )}
      </ul>
    </div>
  );
};

export default FollowersPage;