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
            .get("http://localhost:8080/goals/" + getUser() + "/view")
            .then(function (response) {
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
    <div className="GoalEdit">
        {data && data.length != 0 ? data.map((igoal, index) => (
            <div key={index}>
                <h3 style={{textAlign: "center"}}>Goal #{index + 1}</h3>
                <GoalEditComponent goal={igoal} />
            </div>
            )) : (<><h3 style={{textAlign: "center"}}>YOU DO NOT HAVE ANY GOALS</h3></>)}




    </div>
  );
}

export default GoalEdit;
