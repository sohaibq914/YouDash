import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateGroup.css";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';
import CaptureImageButton from "../Components/CaptureImageButton";

function CreateGroup() {

  const [data, setData] = useState({ groupName: "", groupDescription: "", managers: "", users: "", picturePath: "" });
  const [users, setUsers] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

const handleChange = (e) => {
    const value = e.target.value;
    //console.log(value + " " + e.target.name);
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

const getGroupManagers = () => {
    console.log(document.getElementById("managersSelect").selectedOptions);
    const result = document.getElementById("managersSelect").selectedOptions;
    if (result.length == 0) {
        return "Empty";
    }
    var values  = result[0].value;
    for (let i = 1; i < result.length; i++) {
        values += "," + result[i].value;

    }
    return values;
};

const getGroupUsers = () => {
    console.log(document.getElementById("usersSelect").selectedOptions);
    const result = document.getElementById("usersSelect").selectedOptions;
    if (result.length == 0) {
        return "Empty";
    }
    var values  = result[0].value;
    for (let i = 1; i < result.length; i++) {
        values += "," + result[i].value;

    }
    return values;
};

const handleSubmit = (e) => {
    e.preventDefault();
    const formDataFull = new FormData();
    console.log(selectedFile);
    const groupData = {
      groupName: data.groupName,
      groupDescription: data.groupDescription,
      managers: getGroupManagers(),
      users: getGroupUsers(),
      userCreating: getUser(),
    };
    console.log(groupData);
    formDataFull.append("group", new Blob([JSON.stringify(groupData)], {type: "application/json" } ));
    if (selectedFile) {
        formDataFull.append("image", selectedFile);
        setSelectedFile(null);
    }
    axios
      .post("http://localhost:8080/groups/" + getUser() + "/create", formDataFull)
      .then((response) => {
            //TODO try to add picture here before success message
          Store.addNotification({
                                      title: "Goal Creation Success",
                                      message: "Group Created!",
                                      type: "success",
                                      insert: "top",
                                      container: "top-right",
                                        animationIn: ["animate__animated", "animate__fadeIn"],
                                        animationOut: ["animate__animated", "animate__fadeOut"],
                                        dismiss: {
                                          duration: 5000,
                                          onScreen: true
                                        }
                                  });
          console.log(response)

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
  };

  const getUser = () => {
              let theUrl = window.location.href;
              console.log(theUrl);
              if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
                  return null;
              }
              console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
              return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));

          }



    useEffect (() => {
        getAllUsers();

    }, []);


  const getAllUsers = () => {

          axios.get("http://localhost:8080/api/users")
          .then(function (response) {
              for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].id == getUser()) {
                    response.data.splice(i, 1);
                    break;
                }

              }
              setUsers(response.data);
          })
          .catch((error) => console.error(error));
  }




  return (
    <div className="CreateGroup">
        <h3 style={{textAlign: "center"}}>Create a Group</h3>

        <form onSubmit={handleSubmit}>
            <table className="CreateGroup" style={{width: "100%"}}>
                  <tbody style={{width: "100%"}}>
                    <tr>
                        <td style={{width: "40%"}}>
                            <h3 className="inputLabel">Group Name:</h3>

                        </td>
                        <td style={{width: "40%"}}>
                            <input type="text" id="groupName" name="groupName" autoCapitalize="words" required={true} onChange={handleChange} value={data.groupName} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 className="inputLabel">Managers:</h3>

                        </td>
                        <td>
                        <select id="managersSelect" name="managers" multiple>
                                <option value="Empty"></option>
                                {users ? users.map((u, index) => (
                                            <option key={"m" + index} value={u.id}>{u.username}</option>
                                        )) : (console.log("no users"))}
                                                    </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 className="inputLabel">Users:</h3>

                        </td>
                        <td>
                            <select id="usersSelect" name="users" multiple size="5" style={{height:"5em"}}>
                              <option value="Empty"></option>
                              {users ? users.map((u, index) => (
                                 <option key={"u" + index} value={u.id}>{u.username}</option>
                             )) : (console.log("no users"))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 className="inputLabel">Description:</h3>
                        </td>
                        <td>
                            <input type="text" id="groupDescription" name="groupDescription" autoCapitalize="words" required={true} onChange={handleChange} value={data.groupDescription} />

                        </td>
                    </tr>
                      <tr>
                        <td colSpan="2">
                        <h3 style={{textAlign: "center"}}>Upload Group Picture</h3>
                            <div style={{marginLeft: "40%"}}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])}

                              />
                              </div>
                        </td>
                    </tr>
                  </tbody>
            </table>
            <br/>
            <br/>
            <button style={{ width: "100%" }} className="responsiveGoalButton" type="submit" id="goalSubmit">
                              Create Group
                            </button>

            <br/>
            <br/>
            <br/>
            <br/>
        </form>
    </div>
  );
}



export default CreateGroup;