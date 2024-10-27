import React, { useEffect, useState } from "react";
import axios from "axios";

const GoalLeaderboard = () => {
  const [users, setUsers] = useState([]);
  const [userGoalsMap, setUserGoalsMap] = useState({});
  const [goalTypeFilter, setGoalTypeFilter] = useState("All");
  const [progressFilter, setProgressFilter] = useState("All");
  const [rankedGoals, setRankedGoals] = useState([]);

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
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGoalsForAllUsers = async () => {
    try {
      const goalsMap = {};
      const responses = await Promise.all(
        users.map(async (user) => {
          try {
            const response = await axios.get(`http://localhost:8080/goals/${user.id}/view`);
            return {
              userId: user.id,
              goals: response.data,
            };
          } catch (error) {
            console.error(`Error fetching goals for user ${user.id}:`, error);
            return {
              userId: user.id,
              goals: [],
            };
          }
        })
      );

      responses.forEach(({ userId, goals }) => {
        const uniqueGoals = goals.filter((goal) => {
          const goalKey = `${goal.goalName}-${goal.goalDescription}`;
          const isUnique = !Object.values(goalsMap)
            .flat()
            .some((existingGoal) => `${existingGoal.goalName}-${existingGoal.goalDescription}` === goalKey);
          return isUnique;
        });

        if (uniqueGoals.length > 0) {
          goalsMap[userId] = uniqueGoals;
        }
      });

      setUserGoalsMap(goalsMap);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const applyFiltersAndRank = () => {
    let filteredGoals = [];

    Object.entries(userGoalsMap).forEach(([userId, goals]) => {
      const user = users.find((u) => u.id.toString() === userId.toString());

      const validGoals = goals.filter((goal) => {
        if (goalTypeFilter !== "All") {
          if (goalTypeFilter === "QualityGoal" && !(goal.categoryToWatch && goal.categoryToAvoid)) {
            return false;
          }
          if (goalTypeFilter === "WatchTimeGoal" && !goal.currentWatchTime) {
            return false;
          }
          if (goalTypeFilter === "TimeOfDayGoal" && !(goal.startWatchHour && goal.startAvoidHour)) {
            return false;
          }
        }

        const progress = goal.goalProgress || 0;
        if (progressFilter === "High" && progress < 0.75) return false;
        if (progressFilter === "Medium" && (progress < 0.25 || progress >= 0.75)) return false;
        if (progressFilter === "Low" && progress >= 0.25) return false;

        return true;
      });

      validGoals.forEach((goal) => {
        filteredGoals.push({
          userId: userId,
          userName: user ? user.name : "Unknown",
          ...goal,
        });
      });
    });

    filteredGoals.sort((a, b) => (b.goalProgress || 0) - (a.goalProgress || 0));
    setRankedGoals(filteredGoals);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchGoalsForAllUsers();
    }
  }, [users]);

  useEffect(() => {
    applyFiltersAndRank();
  }, [userGoalsMap, goalTypeFilter, progressFilter]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-6">Goal Leaderboard</h1>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="goalTypeFilter" className="block mb-2 font-medium">
              Filter by Goal Type:
            </label>
            <select id="goalTypeFilter" className="w-full p-2 border rounded-lg" value={goalTypeFilter} onChange={(e) => setGoalTypeFilter(e.target.value)}>
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
            <select id="progressFilter" className="w-full p-2 border rounded-lg" value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)}>
              <option value="All">All Progress</option>
              <option value="High">High (≥ 75%)</option>
              <option value="Medium">Medium (25% - 74%)</option>
              <option value="Low">Low (&lt; 25%)</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-end space-x-4 text-sm text-gray-600">
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
          <table className="w-full border-collapse bg-white">
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
