import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WTGoalCreate.css";
// import navbar from "../Components/navbar";

function WTGoalCreate() {
  const [data, setData] = useState({ goalName: "", goalDescription: "", goalWatchTime: "", theCategory: "", watchLessThanGoal: "false" });
  let minutes = 0;
  let hours = 0;
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value + " " + e.target.name);
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const handleAboveGoalBtn = (e) => {
    handleChange(e);
    document.getElementById("aimAboveGoal").classList.add("selectedAimAboveBelowButton");
    document.getElementById("aimBelowGoal").classList.remove("selectedAimAboveBelowButton");
  };

  const handleBelowGoalBtn = (e) => {
    handleChange(e);
    document.getElementById("aimAboveGoal").classList.remove("selectedAimAboveBelowButton");
    document.getElementById("aimBelowGoal").classList.add("selectedAimAboveBelowButton");
  };

  const minuteRangeChange = (e) => {
    minutes = e.target.value;
    const minutesInput = document.getElementById("minutesInput");
    minutesInput.value = minutes;
  };

  const minuteInputChange = (e) => {
    minutes = e.target.value;
    const minutesRange = document.getElementById("minutesRange");
    minutesRange.value = minutes;
  };

  const hourRangeChange = (e) => {
    hours = e.target.value;
    const hoursInput = document.getElementById("hoursInput");
    hoursInput.value = hours;
  };

  const hourInputChange = (e) => {
    hours = e.target.value;
    const hoursRange = document.getElementById("hoursRange");
    hoursRange.value = hours;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    minutes = document.getElementById("minutesInput").value;
    hours = document.getElementById("hoursInput").value;
    const theCategory = document.getElementById("category").value;
    const userData = {
      "@type": "WatchTimeGoal",
      goalName: data.goalName,
      goalDescription: data.goalDescription,
      goalWatchTime: +minutes + +hours * 60,
      theCategory: theCategory,
      watchLessThanGoal: data.watchLessThanGoal,
    };
    console.log(userData);
    axios
      .post("http://localhost:8080/goals/thename/create", userData)
      .then((response) => console.log(response))
      .catch((error) => {
        if (error.response.status == "409") {
          alert("No duplicate goals!");
        } else {
          console.error(error);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };
  return (
    <div className="WTGoalCreate">
      <form onSubmit={handleSubmit}>
        <table className="tableGoal">
          <tbody>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Name:</h3>
              </td>
              <td>
                <input type="text" id="goalName" name="goalName" autoCapitalize="words" required={true} onChange={handleChange} value={data.goalName} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Description:</h3>
              </td>
              <td>
                <input type="text" id="goalDescription" name="goalDescription" required={false} onChange={handleChange} value={data.goalDescription} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Watchtime Limit:</h3>
              </td>
              <td>
                <table className="tableTime">
                  <tbody>
                    <tr>
                      <td>
                        <h4 style={{ fontSize: "calc(0.9rem + .3vw)" }}>Hours:</h4>
                      </td>
                      <td className="disappearWhenSmall">
                        <input type="range" style={{ width: "100%" }} min="0" max="40" id="hoursRange" name="hoursRange" step="1" onChange={hourRangeChange} />
                      </td>
                      <td>
                        <input type="number" style={{ width: "100%" }} id="hoursInput" name="hoursInput" required={true} min="0" max="40" onChange={hourInputChange} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h4 style={{ fontSize: "calc(0.9rem + .3vw)" }}>Minutes:</h4>
                      </td>
                      <td className="disappearWhenSmall">
                        <input type="range" style={{ width: "100%" }} min="0" max="55" id="minutesRange" name="minutesRange" step="5" onChange={minuteRangeChange} />
                      </td>
                      <td>
                        <input type="number" style={{ width: "100%" }} id="minutesInput" name="minutesInput" required={true} min="0" max="59" onChange={minuteInputChange} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Aim Above or Below Limit:</h3>
              </td>
              <td>
                <button type="button" style={{ width: "50%" }} className="selectedAimAboveBelowButton responsiveGoalButton" id="aimAboveGoal" name="watchLessThanGoal" value={false} onClick={handleAboveGoalBtn}>
                  Above
                </button>
                <button type="button" style={{ width: "50%" }} className="responsiveGoalButton" id="aimBelowGoal" name="watchLessThanGoal" value={true} onClick={handleBelowGoalBtn}>
                  Below
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Category:</h3>
              </td>
              <td>
                <select id="category" defaultValue="ALL" name="theCategory">
                  <option value="ALL">All Categories</option>
                  <option value="SPORTS">Sports</option>
                  <option value="BLOG">Blog</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button style={{ width: "100%" }} className="responsiveGoalButton" type="submit" id="goalSubmit">
                  Create Goal
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default WTGoalCreate;
