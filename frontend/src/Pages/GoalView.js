import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalComponent from "../Components/GoalComponent";
import "./GoalView.css";

function GoalView() {
    //const [data, setData] = useState({ goalName: '', goalDescription: '', goalWatchTime: '', category: '', watchLessThanGoal: 'false'});
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
                //setData(response.data);
                clearData();

                addGoals(response.data);
            })
            .catch((error) => console.error(error));
    }, []);
  return (
    <div className="GoalView">
        {data.map((igoal, index) => (
            <div key={index}>
                <h3 style={{textAlign: "center"}}>Goal #{index + 1}</h3>
                <GoalComponent goal={igoal} />
            </div>
            ))}


    </div>
  );
}

export default GoalView;
