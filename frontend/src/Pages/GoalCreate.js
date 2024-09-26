import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalComponent from "../Components/GoalComponent"

function GoalCreate() {
    const [data, setData] = useState({ goalName: '', goalDescription: '', goalWatchTime: '', category: '', watchLessThanGoal: 'false'});
    let minutes = 0;
    let hours = 0;
    const [message, setMessage] = useState("");


    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

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
        const userData = {
            goalName: data.goalName,
            goalDescription: data.goalDescription,
            goalWatchTime: (+minutes + (+hours * 60)),
            category: data.category,
            watchLessThanGoal: data.watchLessThanGoal
        };
        axios
            .post("http://localhost:8080/goals/thename/create", userData)
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
    };
  return (
    <div className="GoalCreate">
        <h2>Create A Goal</h2>
        <p>Create a watchtime goal by inputting the fields below</p>
        <form onSubmit={handleSubmit}>
            <table>
            <tbody>
                <tr>
                    <td>
                        Goal Name:
                    </td>
                    <td>
                        <input id="goalName" name="goalName" autoCapitalize="words" required={true} placeholder="e.g. Watch Less Sports!" onChange={handleChange} value={data.goalName}/>
                    </td>
                    </tr>
                <tr>
                    <td>
                        Goal Description:
                    </td>
                    <td>
                        <input id="goalDescription" name="goalDescription" required={false} placeholder="..." onChange={handleChange} value={data.goalDescription}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Watchtime Limit:
                    </td>
                    <td>
                        Hours: <input type="range" min="0" max="40" id="hoursRange" name="hoursRange" step="1" onChange={hourRangeChange}/>
                        <input type="number" id="hoursInput" name="hoursInput" required={true} placeholder="0" min="0" max="40" onChange={hourInputChange}/>
                        Minutes: <input type="range" min="0" max="55" id="minutesRange" name="minutesRange" step="5" onChange={minuteRangeChange}/>
                        <input type="number" id="minutesInput" name="minutesInput" required={true} placeholder="0" min="0" max="59" onChange={minuteInputChange}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Aim Above or Below Limit:
                    </td>
                    <td>
                        <button type="button" id="aimAboveGoal" name="watchLessThanGoal" value={false} onClick={handleChange}>Above</button>
                        <button type="button" id="aimBelowGoal" name="watchLessThanGoal" value={true} onClick={handleChange}>Below</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        Category:
                    </td>
                    <td>
                        <select name="category" onChange={handleChange}>
                            <option value="ALL">All Categories</option>
                            <option value="SPORTS">Sports</option>
                            <option value="BLOG">Blog</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
            <br/>
            <button type="submit">
                Create Goal
            </button>

        </form>
    </div>
  );
}

export default GoalCreate;
