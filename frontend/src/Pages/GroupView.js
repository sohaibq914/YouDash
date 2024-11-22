import React, { useEffect, useState } from "react";
import axios from "axios";
import GroupComponent from "../Components/GroupComponent";
import { useNavigate } from 'react-router-dom';
import "./GroupView.css";

function GroupView() {
    const navigate = useNavigate();
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

    const requestJoin = () => {
    }
    const acceptInvite = () => {
    }

  return (
    <div className="GroupView">
        <div>
        <table style={{width: "80%", margin: "auto"}}>
            <tbody>
                <tr>
                    <td style={{width: "33%", padding: "5px"}}>
                        <h3 style={{textAlign: "center"}}>Join Groups</h3>
                        <select id="groupJoin" name="groupJoin" multiple size="5" style={{height:"5em", width:"100%"}}>
                            <option>PLACEHOLDER</option>
                        </select>
                        <button style={{width:"100%"}} onClick={requestJoin}>
                                Request
                            </button>
                    </td>
                    <td style={{width: "33%", padding: "5px"}}>
                        <h3 style={{textAlign: "center"}}>Requested</h3>
                        <select id="groupRequest" name="groupRequest" multiple size="8" style={{height:"10em", width:"100%"}}>
                            <option>PLACEHOLDER</option>
                        </select>
                    </td>
                    <td style={{width: "33%", padding: "5px"}}>
                        <h3 style={{textAlign: "center"}}>Invites</h3>
                        <select id="groupInvite" name="groupInvite" multiple size="5" style={{height:"5em", width:"100%"}}>
                            <option>PLACEHOLDER</option>
                        </select>
                        <button style={{width:"100%"}} onClick={acceptInvite}>
                                Accept
                            </button>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
        <hr/>
        {data.map((igroup, index) => (
            <div key={index}>
                <h3 style={{textAlign: "center"}}>Group #{index + 1}</h3>
                <GroupComponent group={igroup} />
            </div>
            ))}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button 
                    onClick={() => navigate(`/${getUser()}/all-announcements`)}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    View All Announcements
                </button>
            </div>


    </div>
  );
}

export default GroupView;
