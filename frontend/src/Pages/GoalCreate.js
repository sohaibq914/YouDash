import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GoalCreate.css";
import navbar from "../Components/navbar";
import WTGoalCreate from "../Components/WTGoalCreate.js"
import QualityGoalCreate from "../Components/QualityGoalCreate.js"

function GoalCreate() {

    const wtGoalsBtn = () => {
        document.getElementById("wtgoalsDiv").style.display = "block";
        document.getElementById("qgoalsDiv").style.display = "none";
        document.getElementById("wtGoalsBtn").classList.add("selectedGoalTypeButton");
        document.getElementById("qGoalsBtn").classList.remove("selectedGoalTypeButton");
    };
    const qGoalsBtn = () => {
        document.getElementById("wtgoalsDiv").style.display = "none";
        document.getElementById("qgoalsDiv").style.display = "block";

        document.getElementById("wtGoalsBtn").classList.remove("selectedGoalTypeButton");
        document.getElementById("qGoalsBtn").classList.add("selectedGoalTypeButton");
    };


  return (
    <div className="GoalCreate">
        <h2>Create A Goal</h2>
        <table style={{ width: "100%" }}>
        <tbody>
        <tr>
        <td>
            <button type="button" style={{ width: "50%" }} className="selectedGoalTypeButton responsiveGoalButton" id="wtGoalsBtn" onClick={wtGoalsBtn}>
              Watch Time Goal
            </button>
            <button type="button" style={{ width: "50%" }} className="responsiveGoalButton" id="qGoalsBtn" onClick={qGoalsBtn}>
              Quality Goal
            </button>
        </td>
        </tr>
        </tbody>
        </table>

        <div id="wtgoalsDiv">
            <WTGoalCreate />
        </div>
        <div id="qgoalsDiv" style={{ display: "none"}}>
            <QualityGoalCreate />
        </div>
        </div>
  );
}

export default GoalCreate;
