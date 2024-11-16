import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';
import 'animate.css/animate.min.css';

import "./GroupComponent.css";

function GroupComponent(props) {
    const navigate = useNavigate();
    const [group, setGroup] = useState(props.group);
    const [users, setUsers] = useState();
    const [cusers, setCUsers] = useState();
    const [managers, setManagers] = useState();
    const [cmanagers, setCManagers] = useState([]);
    const [profilePic, setProfilePic] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
    const [isManager, setManager] = useState(false);

    const getUser = () => {
                let theUrl = window.location.href;
                //console.log(theUrl);
                if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
                    return null;
                }
                //console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
                return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));

            }

    useEffect (() => {
            getAllUsers();
            getAllManagers();
            setProfilePic(group.profilePictureKey != "NULL" ? "https://profilepicture12.s3.us-east-2.amazonaws.com/" + group.profilePictureKey : "");
            if (group.managers.includes(+getUser())) {
                setManager(true);
            }
            //console.log(group.managers);
        }, []);

    const getAllUsers = () => {

              axios.get("http://localhost:8080/api/users")
              .then(function (response) {
                //console.log(group);
                //console.log(group.users.length);
                //console.log(response.data);
                let userList = [];
                  for (let i = 0; i < response.data.length; i++) {
                  //console.log(response.data[i], i);
                    if (response.data[i].id == getUser()) {
                        userList.push(response.data[i].name);
                        response.data.splice(i, 1);
                        i--;
                        continue;
                    }
                    for (let j = 0; j < group.users.length; j++) {
                        if (response.data[i].id == group.users[j]) {
                            userList.push(response.data[i].name);
                            response.data.splice(i, 1);
                            i--;
                            break;
                        }
                    }

                  }
                  setUsers(response.data);
                  setCUsers(userList);
              })
              .catch((error) => console.error(error));
      }

      const getAllManagers = () => {

            axios.get("http://localhost:8080/api/users")
            .then(function (response) {
              //console.log(group);
              //console.log(group.users.length);
              //console.log(response.data);
                let managersList = [];
                for (let i = 0; i < response.data.length; i++) {
                //console.log(response.data[i], i);
                  if (response.data[i].id == getUser()) {
                      managersList.push(response.data[i].name);
                      response.data.splice(i, 1);
                      i--;
                      continue;
                  }
                  for (let j = 0; j < group.managers.length; j++) {
                      if (response.data[i].id == group.managers[j]) {
                          managersList.push(response.data[i].name);
                          response.data.splice(i, 1);
                          //console.log(response.data[i].name);
                          i--;
                          break;
                      }
                  }

                }
                setManagers(response.data);
                setCManagers(managersList);
                //console.log(managersList);
            })
            .catch((error) => console.error(error));
    }

    const updateGroup = () => {
        //edit and send group to backend
        const formDataFull = new FormData();
        console.log(selectedFile);
        const groupData = {
          groupName: group.groupName,
          groupDescription: group.groupDescription,
          managers: group.managers,
          users: group.users,
          userCreating: getUser(),
          groupId: group.groupId,
        };
        console.log(groupData);
        formDataFull.append("group", new Blob([JSON.stringify(groupData)], {type: "application/json" } ));
        if (selectedFile) {
            //console.log("appended!!!")
            formDataFull.append("image", selectedFile);
            setSelectedFile(null);
        }
        console.log(formDataFull);
        axios
          .post("http://localhost:8080/groups/" + getUser() + "/edit", formDataFull)
          .then((response) => {

              console.log(response);
              //window.location.reload();
              //TODO figure out reload?? get
              /*if (selectedFile) {
                console.log("group-" + group.groupId + "-profile-picture." + selectedFile.name.substring(selectedFile.name.indexOf(".") + 1))
                setProfilePic("group-" + group.groupId + "-profile-picture." + selectedFile.name.substring(selectedFile.name.indexOf(".") + 1));


              }*/
            })
          .catch((error) => {
            if (error.response.status == "409") {
              Store.addNotification({
                          title: "Group Creation Error",
                          message: "No duplicate group names!",
                          type: "warning",
                          insert: "top",
                          container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 5000,
                              onScreen: true
                            }
                      });
            } else {
              console.error(error);
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          });
    }

    const updatePic = (e) => {

        setSelectedFile(document.getElementById("picInput" + group.groupId).files[0]);
        console.log("Updated:" + selectedFile);
        updateGroup();
        //wait and refresh?
    }

    const handleChange = (e) => {
        //handle the change
        const value = e.target.value;
        if (value == "") {
            Store.addNotification({
                title: "Group Value Error",
                message: "Group Values Cannot Be Empty",
                type: "warning",
                insert: "top",
                container: "top-right",
                  animationIn: ["animate__animated", "animate__fadeIn"],
                  animationOut: ["animate__animated", "animate__fadeOut"],
                  dismiss: {
                    duration: 5000,
                    onScreen: true
                  }
            });
            e.target.value = group[e.target.name];
            return;
        }
        //console.log(value + " " + e.target.name);
        setGroup({
              ...group,
              [e.target.name]: value,
            });
        //group[e.target.name] = value;
        //console.log(group[e.target.name], value);
    }
    useEffect (() => {
        updateGroup();
    }, [group]);


  return (
    <div className="GroupComponent">
        {(isManager) ? (<>
        <div style={{textAlign: "center"}}>
        <h3 style={{display: "inline-block"}}> Group Name: </h3>
        <input style={{display: "inline-block"}} type="text" id="groupName" name="groupName" autoCapitalize="words" required={true} onBlur={handleChange} defaultValue={group.groupName} />
        </div>
        {(profilePic) ? ( <>
        <div className="profilePic">
        <img
                  src={profilePic || "https://via.placeholder.com/100"}
                  alt="Group"
                  className="profilePic"
                />
                </div>
                <h5 style={{textAlign: "center"}}>Alter Group Picture</h5>
                <div style={{marginLeft: "40%"}}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={updatePic}
                    id={"picInput" + group.groupId}

                  />
                  </div>
                  <br/>
                  <div style={{textAlign: "center"}}>
                    <button style={{width: "50%"}} onClick={updatePic}>Update</button>
                  </div>
                </> ) : (
                <>
                <h5 style={{textAlign: "center"}}>Upload Group Picture</h5>
                <div style={{marginLeft: "40%"}}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    id={"picInput" + group.groupId}

                  />
                  </div>
                  <br/>
                  <div style={{textAlign: "center"}}>
                    <button style={{width: "50%"}} onClick={updatePic}>Upload</button>
                  </div>
                </>)}
        <br/>
        <div style={{textAlign: "center"}}>
        <h5 style={{display: "inline-block"}}>Description:</h5>
        <input style={{display: "inline-block"}} type="text" id="groupDescription" name="groupDescription" autoCapitalize="words" required={true} onBlur={handleChange} defaultValue={group.groupDescription} />
        </div>
        <br/>
        <table style={{width: "80%", margin:"auto"}}>
        <tbody style={{width: "80%", margin:"auto"}}>
        <tr>
        <td style={{width: "50%"}}>
            <h5 style={{textAlign: "center"}}>Users</h5>
            {cusers ? cusers.map((iuser, index) => (
                <div key={index}>
                <p style={{textAlign: "center"}}>{iuser}</p>
                </div>
            )) : (<></>)}
            <br/>
        </td>
        <td style={{width: "50%"}}>
            <h5 style={{textAlign: "center"}}>Add Users</h5>
            <select id="usersSelect" name="users" multiple size="5" style={{height:"5em", width:"100%"}}>
                  <option value="Empty"></option>
                  {users ? users.map((u, index) => (
                     <option key={"u" + index} value={u.id}>{u.name}</option>
                 )) : (<></>)}
                </select>
            <br/>
            <button style={{width:"100%"}} onClick={() => window.location.href = `chat/${group.groupId}`}>
                                Add
                            </button>
        </td>
        </tr>
        <tr>
        <td>
        <h5 style={{textAlign: "center"}}>Managers</h5>
        {cmanagers ? cmanagers.map((imanager, index) => (
            <div key={index}>
            <p style={{textAlign: "center"}}>{imanager}</p>
            </div>
        )) : (<></>)}
        </td>
        <td style={{width: "50%"}}>
            <h5 style={{textAlign: "center"}}>Add Managers</h5>
            <select id="managersSelect" name="managers" multiple size="5" style={{height:"5em", width:"100%"}}>
                  <option value="Empty"></option>
                  {managers ? managers.map((m, index) => (
                     <option key={"m" + index} value={m.id}>{m.name}</option>
                 )) : (<></>)}
                </select>
            <br/>
            <button style={{width:"100%"}} onClick={() => window.location.href = `chat/${group.groupId}`}>
                                Add
                            </button>
        </td>
        </tr>
        </tbody>
        </table>
        <br/>
        <button style={{width:"50%"}} onClick={() => window.location.href = `leaderboard/${group.groupId}`}>
                    Go to leaderboard
                </button>

        <button style={{width:"50%"}} onClick={() => window.location.href = `chat/${group.groupId}`}>
                    Go to chat
                </button>
        <hr/>

        </>) : (<>

        <h3 style={{textAlign: "center"}}> Group Name: {group.groupName}</h3>
        {(profilePic) ? ( <>
        <div className="profilePic">
            <img
                  src={profilePic || "https://via.placeholder.com/100"}
                  alt="Group"
                  className="profilePic"
                />
                </div>
                </> ) : (
                <>
                </>)}

        <h5 style={{textAlign: "center"}}>Description: {group.groupDescription}</h5>
        <br/>
            <h5 style={{textAlign: "center"}}>Users</h5>
            {cusers ? cusers.map((iuser, index) => (
                <div key={index}>
                <p style={{textAlign: "center"}}>{iuser}</p>
                </div>
            )) : (<></>)}
            <br/>
        <h5 style={{textAlign: "center"}}>Managers</h5>
        {cmanagers ? cmanagers.map((imanager, index) => (
            <div key={index}>
            <p style={{textAlign: "center"}}>{imanager}</p>
            </div>
        )) : (<></>)}
        <br/>
        <button style={{width:"50%"}} onClick={() => window.location.href = `leaderboard/${group.groupId}`}>
                    Go to leaderboard
                </button>

        <button style={{width:"50%"}} onClick={() => window.location.href = `chat/${group.groupId}`}>
                    Go to chat
                </button>
        <hr/>
        </>)}
    </div>
  );
}

export default GroupComponent;