import React, { useEffect, useState } from "react";
import axios from "axios";

function GoalComponent(goal) {

  return (
    <div className="GoalCreate">
      <h1>Goal #{goal.number}</h1>
      <p>Name: {goal.name}</p>
    </div>
  );
}

export default GoalComponent;
