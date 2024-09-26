import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalComponent from "../Components/GoalComponent"

function GoalCreate() {
    const [data, setData] = useState({ key1: 'value1', key2: 'value2' });
    const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/goals/thename/view")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="GoalCreate">
        <h2>Create A Goal</h2>
        <p>Create a watchtime goal by inputting the fields below</p>
        <form>
            <table>
                <tr>
                    <td>
                        Goal Name:
                    </td>
                    <td>
                        <input id="goalName" name="goalName" autocapitalize="words" required="true" placeholder="e.g. Watch Less Sports!"/>
                    </td>
                    </tr>
                <tr>
                    <td>
                        Goal Description:
                    </td>
                    <td>
                        <input id="goalDescription" name="goalDescription" required="false" placeholder="..."/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Watchtime Limit:
                    </td>
                    <td>
                        Hours: <input type="range" min="0" max="40" id="hoursRange" name="hoursRange" step="1"/>
                        <input type="number" id="hoursInput" name="hoursInput" required="true" placeholder="0" min="0" max="40"/>
                        Minutes: <input type="range" min="0" max="55" id="minutesRange" name="minutesRange" step="5"/>
                        <input type="number" id="minutesInput" name="minutesInput" required="true" placeholder="0" min="0" max="59"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Aim Above or Below Limit:
                    </td>
                    <td>
                        <button type="button" id="aimAboveGoal" name="aimAboveGoal">Above</button> <button type="button" id="aimBelowGoal" name="aimBelowGoal">Below</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        Category:
                    </td>
                    <td>
                        <select>
                            <option value="allCategories">All Categories</option>
                            <option value="sports">Sports</option>
                        </select>
                    </td>
                </tr>
            </table>
            <br/>
            <button>
                Create Goal
            </button>

        </form>

      <h1>Message from Spring Boot Goals:</h1>
      <p>{message}</p>
      <GoalComponent name="test" number="7" />
    </div>
  );
}

export default GoalCreate;
