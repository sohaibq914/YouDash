import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GoalCreate.css";
// import navbar from "../Components/navbar";
import WTGoalCreate from "../Components/WTGoalCreate.js";
import QualityGoalCreate from "../Components/QualityGoalCreate.js";
import TODGoalCreate from "../Components/TODGoalCreate.js";

function GoalCreate() {
  const wtGoalsBtn = () => {
    document.getElementById("wtgoalsDiv").style.display = "block";
    document.getElementById("qgoalsDiv").style.display = "none";
      document.getElementById("todgoalsDiv").style.display = "none";

    document.getElementById("wtGoalsBtn").classList.add("selectedGoalTypeButton");
    if (document.getElementById("qGoalsBtn").classList.contains("selectedGoalTypeButton")) {
        document.getElementById("qGoalsBtn").classList.remove("selectedGoalTypeButton");
    }
    if (document.getElementById("todGoalsBtn").classList.contains("selectedGoalTypeButton")) {
      document.getElementById("todGoalsBtn").classList.remove("selectedGoalTypeButton");
      }
  };
  const qGoalsBtn = () => {
    document.getElementById("wtgoalsDiv").style.display = "none";
    document.getElementById("qgoalsDiv").style.display = "block";
      document.getElementById("todgoalsDiv").style.display = "none";

    if (document.getElementById("wtGoalsBtn").classList.contains("selectedGoalTypeButton")) {
        document.getElementById("wtGoalsBtn").classList.remove("selectedGoalTypeButton");
    }
    document.getElementById("qGoalsBtn").classList.add("selectedGoalTypeButton");
    if (document.getElementById("todGoalsBtn").classList.contains("selectedGoalTypeButton")) {
      document.getElementById("todGoalsBtn").classList.remove("selectedGoalTypeButton");
      }
  };

  const todGoalsBtn = () => {
      document.getElementById("wtgoalsDiv").style.display = "none";
      document.getElementById("todgoalsDiv").style.display = "block";
      document.getElementById("qgoalsDiv").style.display = "none";

      if (document.getElementById("wtGoalsBtn").classList.contains("selectedGoalTypeButton")) {
        document.getElementById("wtGoalsBtn").classList.remove("selectedGoalTypeButton");
      }
      document.getElementById("todGoalsBtn").classList.add("selectedGoalTypeButton");
      if (document.getElementById("qGoalsBtn").classList.contains("selectedGoalTypeButton")) {
        document.getElementById("qGoalsBtn").classList.remove("selectedGoalTypeButton");
      }
    };

  return (
    <div className="GoalCreate">
      <h3 style={{textAlign: "center"}}>Create A Goal</h3>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <button type="button" style={{ width: "33%" }} className="selectedGoalTypeButton responsiveGoalButton" id="wtGoalsBtn" onClick={wtGoalsBtn}>
                Watch Time Goal
              </button>
              <button type="button" style={{ width: "33%" }} className="responsiveGoalButton" id="qGoalsBtn" onClick={qGoalsBtn}>
                Quality Goal
              </button>
              <button type="button" style={{ width: "33%" }} className="responsiveGoalButton" id="todGoalsBtn" onClick={todGoalsBtn}>
                  Time of Day Goal
                </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div id="wtgoalsDiv">
        <WTGoalCreate />
      </div>
      <div id="qgoalsDiv" style={{ display: "none" }}>
        <QualityGoalCreate />
      </div>
      <div id="todgoalsDiv" style={{ display: "none" }}>
          <TODGoalCreate />
        </div>
    </div>
  );
}

export default GoalCreate;
