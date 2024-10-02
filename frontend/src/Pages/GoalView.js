import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalComponent from "../Components/GoalComponent";
import "./GoalView.css";

function GoalView() {
    //const [data, setData] = useState({ goalName: '', goalDescription: '', goalWatchTime: '', category: '', watchLessThanGoal: 'false'});
    const [data, setData] = useState([]);
    const addGoal = (newGoal) => {
      setData(prevData => [...prevData, newGoal]);
    };
    const clearData = () => {
        setData([]);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .get("http://localhost:8080/goals/thename/view")
            .then(function (response) {
                //setData(response.data);
                clearData();

                addGoal(response.data);
                console.log(response.data)
            })
            .catch((error) => console.error(error));
    };
  return (
    <div className="GoalView">

        <button style={{width: "100%"}} type="submit" onClick={handleSubmit}>
            View Goals
        </button>
        {data.map((goal, index) => (
            <div key={index}>
                <GoalComponent goal={data[index]} />
            </div>
            ))};


    </div>
  );
}

export default GoalView;
