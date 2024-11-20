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
    const [invUsers, setInvUsers] = useState();
    const [userToInv, setUserToInv] = useState();
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
                let invList = [];
                  for (let i = 0; i < response.data.length; i++) {
                  //console.log(response.data[i], i);
                    //separate if user
                    if (response.data[i].id == getUser()) {
                        userList.push(response.data[i]);
                        response.data.splice(i, 1);
                        break;
                    }
                  }

                  for (let i = 0; i < response.data.length; i++) {
                    //separate if part of group
                    for (let j = 0; j < group.users.length; j++) {
                        if (response.data[i].id == group.users[j]) {
                            userList.push(response.data[i]);
                            response.data.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                  }
                    //separate if invited

                  for (let i = 0; i < response.data.length; i++) {
                    for (let k = 0; k < group.invitations.length; k++) {
                        if (response.data[i].id == group.invitations[k]) {
                            //invList.push(response.data[i]);
                            response.data.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                  }
                    //id is null? check if i is below 0 or something like that
                    //separate if requested
                    //console.log(response.data);

                  for (let i = 0; i < response.data.length; i++) {
                    for (let x = 0; x < group.requests.length; x++) {
                        if (response.data[i].id == group.requests[x]) {
                            invList.push(response.data[i]);
                            response.data.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                  }
                  setInvUsers(invList);
                  setUsers(response.data);
                  setCUsers(userList);
                  /*console.log(group.groupName);
                  console.log(invList);
                  console.log(userList);
                  console.log(group.requests);*/
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
                //get current manager list and possible choices
                for (let i = 0; i < response.data.length; i++) {
                //console.log(response.data[i], i);
                  /*if (response.data[i].id == getUser()) {
                      managersList.push(response.data[i]);
                      response.data.splice(i, 1);
                      i--;
                      continue;
                  }*/
                  for (let j = 0; j < group.managers.length; j++) {
                      if (response.data[i].id == group.managers[j]) {
                          managersList.push(response.data[i]);
                          response.data.splice(i, 1);
                          //console.log(response.data[i].name);
                          i--;
                          break;
                      }
                  }

                }
                //remove possible choices if not users
                //console.log(group.users);
                //console.log(group);
                for (let k = 0; k < response.data.length; k++) {
                    if(!group.users.includes(response.data[k].id)) {
                        //console.log(response.data[k].id);
                        response.data.splice(k, 1);
                        k--;
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
        //console.log(selectedFile);
        const groupData = {
          groupName: group.groupName,
          groupDescription: group.groupDescription,
          managers: group.managers,
          users: group.users,
          userCreating: getUser(),
          groupId: group.groupId,
          requests: group.requests,
          invitations: group.invitations,
        };
        console.log(groupData);
        formDataFull.append("group", new Blob([JSON.stringify(groupData)], {type: "application/json" } ));
        if (selectedFile) {
            //console.log("appended!!!")
            formDataFull.append("image", selectedFile);
            setSelectedFile(null);
        }
        //console.log(formDataFull);
        axios
          .post("http://localhost:8080/groups/" + getUser() + "/edit", formDataFull)
          .then((response) => {

              //console.log(response);
              //window.location.reload();
              //TODO figure out reload?? get request of specific group id to update group to?
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

    const deleteManager = (e) => {
        let newManagerGroup = managers;
        let newCurrentManagers = cmanagers;
        for (let i = 0; i < cmanagers.length; i++) {
            if (cmanagers[i].id == e.target.value) {
                newManagerGroup.push(cmanagers[i]);
                newCurrentManagers.splice(i, 1);
                break;
            }
        }
        console.log("delete manager", e.target.value);
        setCManagers(newCurrentManagers);
        setManagers(newManagerGroup);
        let managerIdList = [];
        for (let j = 0; j < newCurrentManagers.length; j++) {
            managerIdList.push(newCurrentManagers[j].id);
        }
        setGroup(group => ({...group, managers: managerIdList}));
    }


    const addManagers = (e) => {
        const result = document.getElementById("managersSelect").selectedOptions;
        //console.log("add manager button clicked");
        if (result.length == 0 || result[0].value === "IGNORE") {
            return;
        }
        //console.log(result);
        var newManagerGroup = group.managers;
        var newManagerList = cmanagers;
        var listPossibleManagers = managers;
        for (let i = 0; i < result.length; i++) {
            if (!group.managers.includes(+result[i].value)) {
                newManagerGroup.push(+result[i].value);
                //remove from possible choices
                for (let j = 0; j < listPossibleManagers.length; j++) {
                    if (listPossibleManagers[j].id == +result[i].value) {
                        newManagerList.push(listPossibleManagers[j]);
                        listPossibleManagers.splice(j, 1);
                        break;
                    }
                }
            }
        }
        console.log(newManagerList);
        setCManagers(newManagerList);
        setManagers(listPossibleManagers);
        setGroup(group => ({...group, managers: newManagerGroup}));
    }

    const deleteUser = (e) => {
        let newUserGroup = users;
        let newCurrentUsers = cusers;
        for (let i = 0; i < cmanagers.length; i++) {
            if (cmanagers[i].id == e.target.value) {
                deleteManager(e);
                break;
            }
        }
        //remove from possible managers list:

        let newManagerGroup = managers;
        for (let i = 0; i < managers.length; i++) {
            if (managers[i].id == e.target.value) {
                newManagerGroup.splice(i, 1);
                break;
            }
        }
        console.log(newManagerGroup);
        setManagers(newManagerGroup);


        for (let i = 0; i < cusers.length; i++) {
            if (cusers[i].id == e.target.value) {
                newUserGroup.push(cusers[i]);
                newCurrentUsers.splice(i, 1);
                break;
            }
        }
        //console.log(e.target.value, newCurrentManagers, newManagerGroup);
        setCUsers(newCurrentUsers);
        setUsers(newUserGroup);
        let userIdList = [];
        for (let j = 0; j < newCurrentUsers.length; j++) {
            userIdList.push(newCurrentUsers[j].id);
        }
        setGroup(group => ({...group, users: userIdList}));
    }

    const inviteUsers = (e) => {
        const result = document.getElementById("usersSelect").selectedOptions;
            if (result.length == 0 || result[0].value === "IGNORE") {
                //console.log("empty");
                return;
            }
            //want to remove from users
            //want to put into invitations in group
            var newInvList = group.invitations;
            var possibleUserList = users;
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < possibleUserList.length; j++) {
                    if (possibleUserList[j].id == +result[i].value) {
                        newInvList.push(possibleUserList[j].id);
                        possibleUserList.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }
            //console.log(newUserGroup);
            setUsers(possibleUserList);
            //setInvUsers(possibleUserList);
            //setManagers(possibleManagerList);
            //console.log(newInvList);
            setGroup(group => ({...group, invitations: newInvList}));
    }

    const addUsers = (e) => {

        const result = document.getElementById("usersRequest").selectedOptions;
        if (result.length == 0 || result[0].value === "IGNORE") {
            //console.log("empty");
            return;
        }
        //var values  = result[0].value;
        var newUserGroup = group.users;
        var newInvList = group.requests;
        var newUserList = cusers;
        var possibleUserList = invUsers;
        var possibleManagerList = managers;
        for (let i = 0; i < result.length; i++) {
            if (!group.users.includes(+result[i].value)) {
                newUserGroup.push(+result[i].value);
                newInvList.splice(newInvList.indexOf(+result[i].value), 1);
                for (let j = 0; j < possibleUserList.length; j++) {
                    if (possibleUserList[j].id == +result[i].value) {
                        newUserList.push(possibleUserList[j]);
                        possibleManagerList.push(possibleUserList[j]);
                        possibleUserList.splice(j, 1);
                        break;
                    }
                }
            }
        }
        console.log(newUserGroup);
        setCUsers(newUserList);
        setInvUsers(possibleUserList);
        setManagers(possibleManagerList);
        console.log(newInvList);
        setGroup(group => ({...group, users: newUserGroup, requests: newInvList}));
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
        //console.log("update group");
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
            <h5 style={{textAlign: "center"}}>Current Users</h5>
            {cusers ? cusers.map((iuser, index) => (
                <div key={index} style={{textAlign: "center"}}>
                <p style={{textAlign: "center", display: "inline-block"}}>{iuser.name} </p>
                {iuser.id == getUser() ? (<></>) : (<>
                 <button style={{textAlign: "center", display: "inline-block", padding: "1px", marginLeft: "5px"}} value={iuser.id} onClick={deleteUser}>X</button>
                </>)}
                </div>
            )) : (<></>)}
            <br/>
        </td>
        <td style={{width: "50%"}}>
            <h5 style={{textAlign: "center"}}>Invite Users</h5>
            <select id="usersSelect" name="users" multiple size="5" style={{height:"5em", width:"100%"}}>
                  {users && users.length != 0 ? users.map((u, index) => (
                     <option key={"u" + index} value={u.id}>{u.name}</option>
                 )) : (<><option value="IGNORE">All Users invited or in Group</option></>)}
                </select>
            <br/>
            <button style={{width:"100%"}} onClick={inviteUsers}>
                                Invite
                            </button>
        </td>
        </tr>
        <tr>
        <td colSpan="2">
            <br/>
        <div style={{margin: "auto", width: "65%"}}>
        <h5 style={{textAlign: "center"}}>Requests To Join From Users</h5>
                    <select id="usersRequest" name="usersRequest" multiple size="5" style={{height:"5em", width:"100%"}}>
                          {invUsers && invUsers.length != 0 ? invUsers.map((u, index) => (
                             <option key={"u" + index} value={u.id}>{u.name}</option>
                         )) : (<><option value="IGNORE">No Requests</option></>)}
                        </select>
                    <br/>
                    <button style={{width:"100%"}} onClick={addUsers}>
                            Accept
                        </button>
        </div>
        <br/>
        </td>
        </tr>
        <tr>
        <td>
        <h5 style={{textAlign: "center"}}> Current Managers</h5>
        {cmanagers ? cmanagers.map((imanager, index) => (
            <div key={index} style={{textAlign: "center"}}>
            <p style={{textAlign: "center", display: "inline-block"}}>{imanager.name}</p>
            {imanager.id == getUser() ? (<></>) : (<>
            <button style={{textAlign: "center", display: "inline-block", padding: "1px", marginLeft: "5px"}} value={imanager.id} onClick={deleteManager}>X</button>
            </>)}
            </div>
        )) : (<></>)}
        </td>
        <td style={{width: "50%"}}>
            <h5 style={{textAlign: "center"}}>Add Managers</h5>
            <select id="managersSelect" name="managers" multiple size="5" style={{height:"5em", width:"100%"}}>
                  {managers && managers.length != 0 ? managers.map((m, index) => (
                     <option key={"m" + index} value={m.id}>{m.name}</option>
                 )) : (<><option value="IGNORE">All Managers in Group</option></>)}
                </select>
            <br/>
            <button style={{width:"100%"}} onClick={addManagers}>
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

        <button style={{width:"50%"}} onClick={() => window.location.href = `group-chat/${group.groupId}`}>
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
                <p style={{textAlign: "center"}}>{iuser.name}</p>
                </div>
            )) : (<></>)}
            <br/>
        <h5 style={{textAlign: "center"}}>Managers</h5>
        {cmanagers ? cmanagers.map((imanager, index) => (
            <div key={index}>
            <p style={{textAlign: "center"}}>{imanager.name}</p>
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