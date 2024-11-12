import React, { useEffect, useState } from "react";
import axios from "axios";
import GroupComponent from "../Components/GroupComponent";
import "./GroupView.css";

function GroupView() {
    const [data, setData] = useState([]);
    const addGroups = (newGroups) => {
        let dataTemp = [];
        for (var i=0; i < newGroups.length; i++) {
            dataTemp.push(newGroups[i]);
        }
        setData(dataTemp);
    };
    const clearData = () => {
        setData([]);
    };
    useEffect (() => {
        axios
            .get("http://localhost:8080/groups/" + getUser() + "/view")
            .then(function (response) {
                //setData(response.data);
                clearData();

                addGroups(response.data);
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
    <div className="GroupView">
        {data.map((igroup, index) => (
            <div key={index}>
                <h3 style={{textAlign: "center"}}>Group #{index + 1}</h3>
                <GroupComponent group={igroup} />
            </div>
            ))}


    </div>
  );
}

export default GroupView;
