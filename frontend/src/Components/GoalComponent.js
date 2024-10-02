import React, { useEffect, useState } from "react";
import axios from "axios";

function GoalComponent(props) {
    const goal = props.goal;
  return (
    <div className="GoalCreate">
      <h1>Goal #1</h1>
      <p>Name: {goal?.goalName || "ERROR"}</p>
      <p>Description: {goal?.goalDescription || "ERROR"}</p>
      <p>Category: {goal?.category || "ERROR"}</p>
      {(goal?.watchLessThanGoal || false) ? (
      <p>Aiming for less than goal.</p>
      ) : (
      <p>Aiming for more than goal.</p>
      )}
      <p>Watch Less Than Goal: {goal?.watchLessThanGoal || "ERROR"}</p>
      <p>Current Watch Time: {goal?.currentWatchTime || "ERROR"}</p>
      <p>Goal Watch Time: {goal?.goalWatchTime || "ERROR"}</p>
      <p>Goal Progress: {goal?.goalProgress || "ERROR"}</p>
    </div>
  );
}

export default GoalComponent;
