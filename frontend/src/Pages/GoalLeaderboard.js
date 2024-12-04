import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const GoalLeaderboard = () => {
  const [users, setUsers] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [goalTypeFilter, setGoalTypeFilter] = useState("All");
  const [progressFilter, setProgressFilter] = useState("All");
  const [rankedGoals, setRankedGoals] = useState([]);
  const mountedRef = useRef(false);

  // Achievement indicator component
  const AchievementIndicator = ({ progress }) => {
    if (progress >= 1) {
      return (
        <span title="Goal Completed!" className="ml-2 text-yellow-500">
          🏆
        </span>
      );
    } else if (progress >= 0.5) {
      return (
        <span title="High Achiever!" className="ml-2 text-yellow-500">
          ⭐
        </span>
      );
    }
    return null;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setUsers(response.data);
      console.log("USERS IN DB:::" + response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchAllGoals = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      let allUserGoals = [];

      // Fetch goals for each user
      for (const user of fetchedUsers) {
        try {
          console.log(`Fetching goals for user ${user.id}`);
          const response = await axios.get(`http://localhost:8080/goals/${user.id}/view`);

          if (response.data) {
            console.log("HI");
            // Get unique goals for this user
            const uniqueUserGoals = [];
            const seenGoals = new Set();

            response.data.forEach((goal) => {
              console.log("GOAL:", { ...goal });
              const goalKey = `${goal.goalName}-${goal.goalDescription}`;
              if (!seenGoals.has(goalKey)) {
                seenGoals.add(goalKey);
                uniqueUserGoals.push({
                  ...goal,
                  userId: user.id, // Ensure userId is set
                  userName: user.name,
                });
              }
            });

            allUserGoals = [...allUserGoals, ...uniqueUserGoals];
          }
        } catch (error) {
          console.error(`Error fetching goals for user ${user.id}:`, error);
        }
      }

      console.log("All unique goals:", allUserGoals);
      setAllGoals(allUserGoals);
    } catch (error) {
      console.error("Error fetching all goals:", error);
    }
  };

  const applyFiltersAndRank = () => {
    let filteredGoals = [];
    const seenGoals = new Set();

    // First pass: collect unique goals
    allGoals.forEach((goal) => {
      const goalKey = `${goal.goalName}-${goal.goalDescription}`;
      if (!seenGoals.has(goalKey)) {
        seenGoals.add(goalKey);

        // Apply filters
        let includeGoal = true;

        if (goalTypeFilter !== "All") {
          if (goalTypeFilter === "QualityGoal" && !(goal.categoryToWatch && goal.categoryToAvoid)) {
            includeGoal = false;
          }
          if (goalTypeFilter === "WatchTimeGoal" && !goal.currentWatchTime) {
            includeGoal = false;
          }
          if (goalTypeFilter === "TimeOfDayGoal" && !(goal.startWatchHour && goal.startAvoidHour)) {
            includeGoal = false;
          }
        }

        const progress = goal.goalProgress || 0;
        if (progressFilter === "High" && progress < 0.75) includeGoal = false;
        if (progressFilter === "Medium" && (progress < 0.25 || progress >= 0.75)) includeGoal = false;
        if (progressFilter === "Low" && progress >= 0.25) includeGoal = false;

        if (includeGoal) {
          filteredGoals.push(goal);
        }
      }
    });

    // Sort by progress
    filteredGoals.sort((a, b) => (b.goalProgress || 0) - (a.goalProgress || 0));

    console.log("Final filtered and ranked goals:", filteredGoals);
    setRankedGoals(filteredGoals);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchAllGoals();
    }
  }, []);

  useEffect(() => {
    applyFiltersAndRank();
  }, [allGoals, goalTypeFilter, progressFilter]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" style={{marginBottom: "7%"}}>
      <div className="mb-6" >
        <h1 className="text-2xl font-bold text-center mb-6">Goal Leaderboard</h1>

        <div className="flex gap-4 mb-4"  style={{width: "80%", margin: "auto"}}>
          <div className="w-1/2">
            <label htmlFor="goalTypeFilter" className="block mb-2 font-medium">
              Filter by Goal Type:
            </label>
            <select id="goalTypeFilter" style={{marginLeft: "44px"}} className="w-full p-2 border rounded-lg" value={goalTypeFilter} onChange={(e) => setGoalTypeFilter(e.target.value)}>
              <option value="All">All Goals</option>
              <option value="QualityGoal">Quality Goals</option>
              <option value="WatchTimeGoal">Watch Time Goals</option>
              <option value="TimeOfDayGoal">Time of Day Goals</option>
            </select>
          </div>

          <div className="w-1/2">
            <label htmlFor="progressFilter" className="block mb-2 font-medium">
              Filter by Progress Level:
            </label>
            <select id="progressFilter" style={{marginLeft: "10px"}} className="w-full p-2 border rounded-lg" value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)}>
              <option value="All">All Progress</option>
              <option value="High">High (≥ 75%)</option>
              <option value="Medium">Medium (25% - 74%)</option>
              <option value="Low">Low (&lt; 25%)</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-end space-x-4 text-sm text-gray-600"  style={{width: "80%", margin: "auto"}}>
          <div className="flex items-center">
            <span className="text-yellow-500">🏆</span>
            <span className="ml-1">Goal Completed (100%)</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1">High Achievement (50-99%)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white" style={{width: "80%", margin: "auto"}}>
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border">Rank</th>
                <th className="p-3 text-left border">User Name</th>
                <th className="p-3 text-left border">Goal Name</th>
                <th className="p-3 text-left border">Goal Description</th>
                <th className="p-3 text-left border">Progress</th>
              </tr>
            </thead>
            <tbody>
              {rankedGoals.map((goal, index) => (
                <tr key={`${goal.userId}-${goal.goalName}-${index}`} className="border-t hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">
                    <div className="flex items-center">
                      {goal.userName}
                      <AchievementIndicator progress={goal.goalProgress || 0} />
                    </div>
                  </td>
                  <td className="p-3 border">{goal.goalName}</td>
                  <td className="p-3 border">{goal.goalDescription}</td>
                  <td className="p-3 border">
                    <span className={goal.goalProgress >= 1 ? "text-green-600 font-bold" : goal.goalProgress >= 0.5 ? "text-blue-600 font-bold" : ""}>{goal.goalProgress !== undefined ? `${(goal.goalProgress * 100).toFixed(2)}%` : "N/A"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoalLeaderboard;
