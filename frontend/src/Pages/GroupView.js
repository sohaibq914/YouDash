import React, { useEffect, useState } from "react";
import axios from "axios";
import GroupComponent from "../Components/GroupComponent";
import "./GroupView.css";

function GroupView() {
    const [data, setData] = useState([]);
    const [join, setJoin] = useState([]);
    const [inv, setInv] = useState([]);
    const [req, setReq] = useState([]);
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
                console.log(response.data);
                addGroups(response.data);
            })
            .catch((error) => console.error(error));
            getRIJData();
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

    const getRIJData = () => {
        axios
            .get("http://localhost:8080/groups/" + getUser() + "/rij")
            .then(function (response) {
                //setData(response.data);
                //clearData();
                let newInv = [];
                let newJoin = [];
                let newReq = [];
                let index = 1;
                while (!(response.data[index] === "r")) {
                    newJoin.push(response.data[index]);
                    index += 1;
                }
                index+=1;
                while (!(response.data[index] === "i")) {
                    newReq.push(response.data[index]);
                    index += 1;
                }
                index+=1;
                console.log(response.data);
                console.log(index);
                while (index < response.data.length) {
                    newInv.push(response.data[index]);
                    index += 1;
                }
                setInv(newInv);
                console.log(newInv);
                setJoin(newJoin);
                setReq(newReq);
            })
            .catch((error) => console.error(error));
    }

    const requestJoin = () => {
    //send request join axios groupname user
    //update req
        const result = document.getElementById("groupJoin").selectedOptions;
        if (result.length == 0 || result[0].value === "IGNORE") {
            //console.log("empty");
            return;
        }
        var listReqs = [];
        for (let i = 0; i < result.length; i++) {
            listReqs.push(result[i].value);
        }
        console.log(listReqs);
        const jsonList = JSON.stringify(listReqs);

        axios
            .post("http://localhost:8080/groups/" + getUser() + "/req", jsonList,
            {
                    headers: {
                      "Content-Type": "application/json", // Set Content-Type to JSON
                    },
                  }
            )
            .then(function (response) {
                //setData(response.data);
                console.log("request sent");
                setReq(req.concat(listReqs));
                var newJoin = join;
                for (var j = 0; j < listReqs.length; j++) {
                    newJoin.splice(newJoin.indexOf(listReqs[j]), 1);
                }
            })
            .catch((error) => console.error(error));
    }
    const acceptInvite = () => {
    //send accept axios groupname user
    //update inv

        const result = document.getElementById("groupInvite").selectedOptions;
        if (result.length == 0 || result[0].value === "IGNORE") {
            //console.log("empty");
            return;
        }
        var listAcc = [];
        for (let i = 0; i < result.length; i++) {
            listAcc.push(result[i].value);
        }
        console.log(listAcc);
        const jsonList = JSON.stringify(listAcc);

        axios
            .post("http://localhost:8080/groups/" + getUser() + "/acc", jsonList,
            {
                    headers: {
                      "Content-Type": "application/json", // Set Content-Type to JSON
                    },
                  }
            )
            .then(function (response) {
                //setData(response.data);
                console.log("request sent");
                //remove accepted invites
                var newInv = inv;
                for (var j = 0; j < listAcc.length; j++) {
                    newInv.splice(newInv.indexOf(listAcc[j]), 1);
                }
            })
            .catch((error) => console.error(error));
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
                            {join && join.length != 0 ? join.map((i, index) => (
                                 <option key={"i" + index} value={i}>{i}</option>
                             )) : (<><option value="IGNORE">No Groups To Join</option></>)}
                        </select>
                        <button style={{width:"100%"}} onClick={requestJoin}>
                                Request
                            </button>
                    </td>
                    <td style={{width: "33%", padding: "5px"}}>
                        <h3 style={{textAlign: "center"}}>Requested</h3>
                        <select id="groupRequest" name="groupRequest" multiple size="8" style={{height:"10em", width:"100%"}}>
                            {req && req.length != 0 ? req.map((i, index) => (
                                 <option key={"i" + index} value={i}>{i}</option>
                             )) : (<><option value="IGNORE">No Requests</option></>)}
                        </select>
                    </td>
                    <td style={{width: "33%", padding: "5px"}}>
                        <h3 style={{textAlign: "center"}}>Invites</h3>
                        <select id="groupInvite" name="groupInvite" multiple size="5" style={{height:"5em", width:"100%"}}>
                            {inv && inv.length != 0 ? inv.map((i, index) => (
                                 <option key={"i" + index} value={i}>{i}</option>
                             )) : (<><option value="IGNORE">No Invites</option></>)}
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
        {data && data.length != 0 ? data.map((igroup, index) => (
            <div key={index}>
                <h3 style={{textAlign: "center"}}>Group #{index + 1}</h3>
                <GroupComponent group={igroup} />
            </div>
            )) : (<><h3 style={{textAlign: "center"}}>YOU ARE NOT PART OF ANY GROUPS</h3></>)}


    </div>
  );
}

export default GroupView;
