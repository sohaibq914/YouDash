import React, { useEffect, useState } from "react";
import axios from "axios";
import Cactus from "../Components/Cactus";
import "./VisualizeGoal.css";

function VisualizeGoal() {
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
            .get("http://localhost:8080/goals/" + getUser() + "/view")
            .then(function (response) {
                //setData(response.data);
                clearData();

                addGoals(response.data);
            })
            .catch((error) => console.error(error));
    }, []);


      const getUser = () => {
                  let theUrl = window.location.href;
                  console.log(theUrl);
                  if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
                      return null;
                  }
                  console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
                  return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));

              }
  return (
    <div className="VisualizeGoal">
        {data.map((igoal, index) => (
            <div key={index}>
                <h3 style={{textAlign: "center"}}>Goal #{index + 1}: {igoal.goalName}</h3>
                <Cactus goal={igoal} />
            </div>
            ))}


    </div>
  );
}

export default VisualizeGoal;
