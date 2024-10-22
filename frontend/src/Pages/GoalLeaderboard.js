import React, { useEffect, useState } from "react";
import axios from "axios";

const GoalLeaderboard = () => {
  const [allGoals, setAllGoals] = useState([]); // Store all goals initially
  const [filteredGoals, setFilteredGoals] = useState([]); // Store goals based on filter
  const [filter, setFilter] = useState("All"); // Track the selected filter

  useEffect(() => {
    axios
      .get("http://localhost:8080/goals/12345/view")
      .then((response) => {
        const allGoals = response.data; // Get all goals from backend
        setAllGoals(allGoals); // Set all goals initially
        setFilteredGoals(allGoals); // Set filtered goals to show all initially
      })
      .catch((error) => {
        console.error("There was an error fetching the goals!", error);
      });
  }, []);

  // Filter the goals based on the selected type
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilter(filterValue);

    if (filterValue === "QualityGoal") {
      setFilteredGoals(allGoals.filter((goal) => goal.categoryToWatch && goal.categoryToAvoid)); // Filtering QualityGoals
    } else if (filterValue === "WatchTimeGoal") {
      setFilteredGoals(allGoals.filter((goal) => goal.currentWatchTime)); // Filtering WatchTimeGoals
    } else if (filterValue === "TimeOfDayGoal") {
      setFilteredGoals(allGoals.filter((goal) => goal.startWatchHour && goal.startAvoidHour)); // Filtering TimeOfDayGoals
    } else {
      setFilteredGoals(allGoals); // Show all goals if 'All' is selected
    }
  };

  return (
    <div>
      <h1>Goal Leaderboard</h1>

      {/* Dropdown Filter */}
      <div>
        <label htmlFor="goalFilter">Filter by Goal Type: </label>
        <select id="goalFilter" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="QualityGoal">Quality Goals</option>
          <option value="WatchTimeGoal">Watch Time Goals</option>
          <option value="TimeOfDayGoal">Time of Day Goals</option>
        </select>
      </div>

      {/* Display Filtered Goals */}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Goal Name</th>
            <th>Goal Description</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {filteredGoals.map((goal, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* Rank */}
              <td>{goal.goalName}</td>
              <td>{goal.goalDescription}</td>
              <td>{(goal.goalProgress * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoalLeaderboard;
