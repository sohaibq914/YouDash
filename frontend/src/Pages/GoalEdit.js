import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GoalEdit.css";
import GoalEditComponent from "../Components/GoalEditComponent"

function GoalEdit() {

const [data, setData] = useState([]);
    const addGoals = (newGoals) => {
        let dataTemp = [];
        for (var i=0; i <newGoals.length; i++) {
            dataTemp.push(newGoals[i]);
        }
        setData(dataTemp);
    };
    const clearData = () => {
        setData([]);
    };
    useEffect (() => {
        axios
            .get("http://localhost:8080/goals/thename/view")
            .then(function (response) {
                clearData();

                addGoals(response.data);
            })
            .catch((error) => console.error(error));
    }, []);

  return (
    <div className="GoalEdit">
      <h1>In Progress</h1>
        {data.map((igoal, index) => (
            <div key={index}>
                <h2>Goal #{index + 1}</h2>
                <GoalEditComponent goal={igoal} />
            </div>
            ))}




    </div>
  );
}

export default GoalEdit;
