import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import "./GroupComponent.css";

function GroupComponent(props) {
    const navigate = useNavigate();
    const group = props.group;

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
    <div className="GroupComponent">
        <h3 style={{textAlign: "center"}}>{group.groupName}</h3>
        <h5 style={{textAlign: "center"}}>{group.groupDescription}</h5>
        <br/>
        <h5 style={{textAlign: "center"}}>Users</h5>
        {group.users.map((iuser, index) => (
            <div key={index}>
            <p style={{textAlign: "center"}}>{iuser}</p>
            </div>
        ))}
        <br/>
        <h5 style={{textAlign: "center"}}>Managers</h5>
        {group.managers.map((imanager, index) => (
            <div key={index}>
            <p style={{textAlign: "center"}}>{imanager}</p>
            </div>
        ))}
        <button style={{width:"50%"}} onClick={() => window.location.href = `leaderboard/${group.groupId}`}>
                    Go to leaderboard
                </button>

        <button style={{width:"50%"}} onClick={() => window.location.href = `chat/${group.groupId}`}>
                    Go to chat
                </button>
        <hr/>
    </div>
  );
}

export default GroupComponent;