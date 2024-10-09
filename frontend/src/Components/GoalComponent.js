import React, { useEffect, useState } from "react";
import axios from "axios";

import "./GoalComponent.css";

function GoalComponent(props) {
    const goal = props.goal;
  return (
    <div className="GoalComponent">
        <table className="tableGoalView" style={{width: "90%"}}>
        <tbody>
        {(!goal?.multiplier || false) ? (
        <>
        <tr>
                <td colSpan="2">
                    <h3 style={{marginTop: "0.5rem", textAlign: "center"}}>Watch Time Goal</h3>
                </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Name: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalName || "ERROR"}</h3>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Description: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalDescription || "None"}</h3>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Category: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.theCategory || "ERROR"}</h3>
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
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalWatchTime || "0"}</h3>
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
        <td colSpan="2">
        {(goal?.watchLessThanGoal || false) ? (
              <h3 style={{textAlign: "center"}}>Aiming for less than goal.</h3>
              ) : (
              <h3 style={{textAlign: "center"}}>Aiming for more than goal.</h3>
              )}
        </td>
        </tr>
        </>
        ) : (
        <>
                <tr>
                <td colSpan="2">
                    <h3 style={{marginTop: "0.5rem", textAlign: "center"}}>Quality Goal</h3>
                </td>
                </tr>
                <tr>
                <td>
                    <h3 style={{marginTop: "0.5rem"}}>Name: </h3>
                </td>
                <td>
                    <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalName || "ERROR"}</h3>
                </td>
                </tr>
                <tr>
                <td>
                    <h3 style={{marginTop: "0.5rem"}}>Description: </h3>
                </td>
                <td>
                    <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalDescription || "None"}</h3>
                </td>
                </tr>

                <tr>
                <td>
                    <h3 style={{marginTop: "0.5rem"}}>Category To Watch: </h3>
                </td>
                <td>
                    <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.categoryToWatch || "ERROR"}</h3>
                </td>
                </tr>

                <tr>
                <td>
                    <h3 style={{marginTop: "0.5rem"}}>Category To Avoid: </h3>
                </td>
                <td>
                    <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.categoryToAvoid || "ERROR"}</h3>
                </td>
                </tr>
                <tr>
                <td>
                    <h3 style={{marginTop: "0.5rem"}}>Multiplier: </h3>
                </td>
                <td>
                    <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.multiplier || "ERROR"}</h3>
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

        </>
        )}
        </tbody>
        </table>
    </div>
  );
}

export default GoalComponent;
