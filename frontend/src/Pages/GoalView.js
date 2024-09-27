import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalComponent from "../Components/GoalComponent";
import "./GoalView.css";

function GoalView() {

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .get("http://localhost:8080/goals/thename/view")
            .then(function (response) {
                document.getElementById("Response").innerHTML = response;
            })
            .catch((error) => console.error(error));
    };
  return (
    <div className="GoalView">

        <button style={{width: "100%"}} type="submit" onClick={handleSubmit}>
            View Goals
        </button>

        <p id="Response">NO RESPONSE</p>

    </div>
  );
}

export default GoalView;
