import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateGroup.css";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';
import CaptureImageButton from "../Components/CaptureImageButton";

function CreateGroup() {

  const [data, setData] = useState({ groupName: "", groupDescription: "", managers: "", users: "" });
  const [users, setUsers] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

const handleChange = (e) => {
    const value = e.target.value;
    console.log(value + " " + e.target.name);
    setData({
      ...data,
      [e.target.name]: value,
    });
  };


const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      groupName: data.groupName,
      groupDescription: data.groupDescription,
      managers: data.managers,
      users: data.users,
    };
    console.log(userData);
    axios
      .post("http://localhost:8080/groups/" + getUser() + "/create", userData)
      .then((response) => {
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


//get users from db:
//exclude getUser()
  const getAllUsers = () => {

          axios.get("http://localhost:8080/api/users")
          .then(function (response) {
              setUsers(response.data);
              console.log()
          })
          .catch((error) => console.error(error));
  }

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      //const response = await axios.post(`http://localhost:8080/profile/${userID}/uploadProfilePicture`, formData, {
        //headers: { "Content-Type": "multipart/form-data" },
      //});

      //console.log("Profile picture uploaded successfully:", response.data.profilePicture);
      //setProfile({ ...profile, profilePicture: response.data.profilePicture });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };



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
                                                      <option value="12345">Test Name</option>
                                                      <option value="54321">Test Name 2</option>
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
                              <option value="12345">Test Name</option>
                              <option value="54321">Test Name 2</option>
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
                            <div className="profilePicContainer">
                                <img
                                  src={"https://via.placeholder.com/100"}
                                  alt="Profile"
                                  className="profilePic"
                                />
                              </div>
                              </td>
                      </tr>
                      <tr>
                        <td>
                            <div style={{marginLeft: "50%"}}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])}

                              />
                              </div>
                        </td>
                        <td>
                              <button onClick={handleProfilePictureUpload}>
                                Upload Profile Picture
                              </button>
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