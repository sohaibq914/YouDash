import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalComponent from "../Components/GoalComponent";
import "./GoalCreate.css";

function GoalCreate() {
    const [data, setData] = useState({ goalName: '', goalDescription: '', goalWatchTime: '', category: '', watchLessThanGoal: 'false'});
    let minutes = 0;
    let hours = 0;
    const [message, setMessage] = useState("");


    const handleChange = (e) => {
        const value = e.target.value;
        console.log(value + " " + e.target.name);
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleAboveGoalBtn = (e) => {
        handleChange(e);
        document.getElementById("aimAboveGoal").classList.add("selectedAimAboveBelowButton");
        document.getElementById("aimBelowGoal").classList.remove("selectedAimAboveBelowButton");

    }

    const handleBelowGoalBtn = (e) => {
            handleChange(e);
            document.getElementById("aimAboveGoal").classList.remove("selectedAimAboveBelowButton");
            document.getElementById("aimBelowGoal").classList.add("selectedAimAboveBelowButton");

        }

    const minuteRangeChange = (e) => {
        minutes = e.target.value;
        const minutesInput = document.getElementById("minutesInput");
        minutesInput.value = minutes;
    }

    const minuteInputChange = (e) => {
        minutes = e.target.value;
        const minutesRange = document.getElementById("minutesRange");
        minutesRange.value = minutes;
    }

    const hourRangeChange = (e) => {
        hours = e.target.value;
        const hoursInput = document.getElementById("hoursInput");
        hoursInput.value = hours;
    }

    const hourInputChange = (e) => {
        hours = e.target.value;
        const hoursRange = document.getElementById("hoursRange");
        hoursRange.value = hours;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        minutes = document.getElementById("minutesInput").value;
        hours = document.getElementById("hoursInput").value;
        const category = document.getElementById("category").value;
        const userData = {
            goalName: data.goalName,
            goalDescription: data.goalDescription,
            goalWatchTime: (+minutes + (+hours * 60)),
            category: category,
            watchLessThanGoal: data.watchLessThanGoal
        };
        axios
            .post("http://localhost:8080/goals/thename/create", userData)
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
    };
  return (
    <div className="GoalCreate">
        <form onSubmit={handleSubmit}>
            <h2>Create A Goal</h2>
            <table className="tableGoal">
            <tbody>
                <tr>
                    <td>
                        <h3>Goal Name:</h3>
                    </td>
                    <td>
                        <input type="text" id="goalName" name="goalName" autoCapitalize="words" required={true} onChange={handleChange} value={data.goalName}/>
                    </td>
                    </tr>
                <tr>
                    <td>
                        <h3>Goal Description:</h3>
                    </td>
                    <td>
                        <input type="text" id="goalDescription" name="goalDescription" required={false} onChange={handleChange} value={data.goalDescription}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Watchtime Limit:</h3>
                    </td>
                    <td>
                        <table className="tableTime">
                            <tbody>
                                <tr>
                                    <td>
                                        Hours:
                                    </td>
                                    <td>
                                        <input type="range" min="0" max="40" id="hoursRange" name="hoursRange" step="1" onChange={hourRangeChange}/>
                                    </td>
                                    <td>
                                        <input type="number" id="hoursInput" name="hoursInput" required={true} min="0" max="40" onChange={hourInputChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Minutes:
                                    </td>
                                    <td>
                                        <input type="range" min="0" max="55" id="minutesRange" name="minutesRange" step="5" onChange={minuteRangeChange}/>
                                    </td>
                                    <td>
                                        <input type="number" id="minutesInput" name="minutesInput" required={true} min="0" max="59" onChange={minuteInputChange}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Aim Above or Below Limit:</h3>
                    </td>
                    <td>
                        <button type="button" style={{width: "50%"}} className="selectedAimAboveBelowButton" id="aimAboveGoal" name="watchLessThanGoal" value={false} onClick={handleAboveGoalBtn}>Above</button>
                        <button type="button" style={{width: "50%"}} id="aimBelowGoal" name="watchLessThanGoal" value={true} onClick={handleBelowGoalBtn}>Below</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Category:</h3>
                    </td>
                    <td>
                        <select id="category" defaultValue="ALL" name="category">
                            <option value="ALL">All Categories</option>
                            <option value="SPORTS">Sports</option>
                            <option value="BLOG">Blog</option>
                        </select>
                    </td>
                </tr>
                <tr>
                <td colSpan="2">
                    <button style={{width: "100%"}} type="submit">
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

export default GoalCreate;
