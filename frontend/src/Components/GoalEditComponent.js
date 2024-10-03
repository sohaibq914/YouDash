import React, { useEffect, useState, useId } from "react";
import axios from "axios";

import "./GoalEditComponent.css";

function GoalEditComponent(props) {
    const uniqueId = useId();
    const goal = props.goal;
    const maxWT = 2459;
    let originalGoalName = props.goal.goalName;

    useEffect (() => {
        if (goal.watchLessThanGoal) {
            document.getElementById('aimAboveGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
            document.getElementById('aimBelowGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
        } else {
          document.getElementById('aimAboveGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
          document.getElementById('aimBelowGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
        }
    }, []);

    const updateName = (e) => {
        goal.goalName = document.getElementById('goalName' + uniqueId).value;
        submitChange(e);
      };

    const updateDescription = (e) => {
        goal.goalDescription = document.getElementById('goalDescription' + uniqueId).value;
        submitChange(e);
      };

    const updateCategory = (e) => {
        goal.category = document.getElementById('category' + uniqueId).value;
        submitChange(e);
      };

    const updateGoalWatchTime = (e) => {
        const newWT =  document.getElementById('goalWatchTime' + uniqueId).value;
        if (newWT <= maxWT) {
            goal.goalWatchTime = newWT;
            submitChange(e);
        } else {
            document.getElementById('goalWatchTime' + uniqueId).value = maxWT;
            goal.goalWatchTime = maxWT;
            submitChange(e);
        }
      };

    const aimForLessBtn = (e) => {
        goal.watchLessThanGoal = "true";
        document.getElementById('aimAboveGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
        document.getElementById('aimBelowGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
        submitChange(e);
      };

    const aimForMoreBtn = (e) => {
      goal.watchLessThanGoal = "false";
      document.getElementById('aimAboveGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
      document.getElementById('aimBelowGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
      submitChange(e);
    };

    const submitChange = (e) => {
        e.preventDefault();
        const goalUpdate = {
            originalName: originalGoalName,
            wtg: goal
        };
        originalGoalName = goal.goalName;
        console.log(originalGoalName);
        axios
          .post("http://localhost:8080/goals/thename/edit", goalUpdate)
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      };

  return (
    <div className="GoalEditComponent">
        <table className="tableGoalView">
        <tbody>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Name: </h3>
        </td>
        <td>
            <input type="text" id={'goalName' + uniqueId} defaultValue={goal?.goalName || "ERROR"} onBlur={updateName} />
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Description: </h3>
        </td>
        <td>
            <input type="text" id={'goalDescription' + uniqueId} defaultValue={goal?.goalDescription || "ERROR"} onBlur={updateDescription} />
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Category: </h3>
        </td>
        <td>
            <select id={'category' + uniqueId} defaultValue={goal.category} name="category" onChange={updateCategory}>
              <option value="ALL">All Categories</option>
              <option value="SPORTS">Sports</option>
              <option value="BLOG">Blog</option>
            </select>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Current Watch Time: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.currentWatchTime || "0"}</h3>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Goal Watch Time: </h3>
        </td>
        <td>
            <input type="number" id={'goalWatchTime' + uniqueId} defaultValue={goal?.goalWatchTime || "0"} onBlur={updateGoalWatchTime} />
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Goal Progress: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalProgress || "N/A"}</h3>
        </td>
        </tr>
        <tr>
        <td>
        <button type="button" style={{ width: "100%" }} id={'aimAboveGoal' + uniqueId} name="watchLessThanGoal" value={false} onClick={aimForMoreBtn}>
                         Aim Above
                        </button>
        </td>
        <td>
                        <button type="button" style={{ width: "100%" }} id={'aimBelowGoal' + uniqueId} name="watchLessThanGoal" value={true} onClick={aimForLessBtn}>
                          Aim Below
                        </button>
        </td>
        </tr>
        </tbody>
        </table>
    </div>
  );
}

export default GoalEditComponent;