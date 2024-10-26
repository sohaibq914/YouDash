import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TODGoalCreate.css";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';
import 'animate.css/animate.min.css';
// import navbar from "../Components/navbar";

function TODGoalCreate() {
  const [data, setData] = useState({ goalName: "", goalDescription: "", startWatchHour: 0, startWatchMinute: 0, endWatchHour: 0, endWatchMinute: 0, startAvoidHour: 0, startAvoidMinute: 0, endAvoidHour: 0, endAvoidMinute: 0, categoryWatch: "", categoryAvoid: "", multiplier: 0 });

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
    const categoryWatch = document.getElementById("categoryWatch").value;
    const categoryAvoid = document.getElementById("categoryAvoid").value;
    if (+data.multiplier <= 0) {
      Store.addNotification({
                  title: "Goal Creation Error",
                  message: "Invalid multiplier! Must be greater than 0.",
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
      return;
    }
    const userData = {
      "@type": "TimeOfDayGoal",
      goalName: data.goalName,
      goalDescription: data.goalDescription,
      categoryWatch: categoryWatch,
      categoryAvoid: categoryAvoid,
      startAvoidMinute: +data.startAvoidMinute,
      startAvoidHour: +data.startAvoidHour,
      startWatchHour: +data.startWatchHour,
      startWatchMinute: +data.startWatchMinute,
      endAvoidHour: +data.endAvoidHour,
      endAvoidMinute: +data.endAvoidMinute,
      endWatchHour: +data.endWatchHour,
      endWatchMinute: +data.endWatchMinute,
      multiplier: +data.multiplier,
    };
    console.log(userData);
    axios
      .post("http://localhost:8080/goals/" + getUser() + "/create", userData)
      .then((response) => {
        Store.addNotification({
                                    title: "Goal Creation Success",
                                    message: "Goal Created!",
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
                                title: "Goal Creation Error",
                                message: "No duplicate goal names!",
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

  return (
    <div className="TODGoalCreate">
      <form onSubmit={handleSubmit}>
        <table className="tableGoal">
          <tbody>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Name:</h3>
              </td>
              <td>
                <input type="text" id="goalNameTOD" name="goalName" autoCapitalize="words" required={true} onChange={handleChange} value={data.goalName} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Description:</h3>
              </td>
              <td>
                <input type="text" id="goalDescriptionTOD" name="goalDescription" required={true} onChange={handleChange} value={data.goalDescription} />
              </td>
            </tr>
            <tr>
                <td>
                    <h3 className="inputLabel">Time to Watch Start:</h3>
                </td>
                <td>

                    <input type="number" style={{ width: "20%" }} id="startWatchHour" name="startWatchHour" min="0" max="23" required={true} onChange={handleChange} value={data.startWatchHour} />
                    :
                    <input type="number" style={{ width: "40%" }} id="startWatchMinute" name="startWatchMinute" min="0" max="59" required={true} onChange={handleChange} value={data.startWatchMinute} />
                </td>

            </tr>
            <tr>
                <td>
                    <h3 className="inputLabel">Time to Watch End:</h3>
                </td>
                <td>

                    <input type="number" style={{ width: "20%" }} id="endWatchHour" name="endWatchHour" min="0" max="23" required={true} onChange={handleChange} value={data.endWatchHour} />
                    :
                    <input type="number" style={{ width: "40%" }} id="endWatchMinute" name="endWatchMinute" min="0" max="59" required={true} onChange={handleChange} value={data.endWatchMinute} />
                </td>

            </tr>

            <tr>
                <td>
                    <h3 className="inputLabel">Time to Avoid Start:</h3>
                </td>
                <td>

                    <input type="number" style={{ width: "20%" }} id="startAvoidHour" name="startAvoidHour" min="0" max="23" required={true} onChange={handleChange} value={data.startAvoidHour} />
                    :
                    <input type="number" style={{ width: "40%" }} id="startAvoidMinute" name="startAvoidMinute" min="0" max="59" required={true} onChange={handleChange} value={data.startAvoidMinute} />
                </td>

            </tr>
            <tr>
                <td>
                    <h3 className="inputLabel">Time to Avoid End:</h3>
                </td>
                <td>

                    <input type="number" style={{ width: "20%" }} id="endAvoidHour" name="endAvoidHour" min="0" max="23" required={true} onChange={handleChange} value={data.endAvoidHour} />
                    :
                    <input type="number" style={{ width: "40%" }} id="endAvoidMinute" name="endAvoidMinute" min="0" max="59" required={true} onChange={handleChange} value={data.endAvoidMinute} />
                </td>

            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Category To Watch:</h3>
              </td>
              <td>
                <select id="categoryWatch" defaultValue="ALL" name="categoryWatch">
                  <option value="ALL">All Categories</option>
                                  <option value="Film & Animation">Film & Animation</option>
                                  <option value="Autos & Vehicles">Autos & Vehicles</option>
                                  <option value="Music">Music</option>
                                  <option value="Pets & Animals">Pets & Animals</option>
                                  <option value="Sports">Sports</option>
                                  <option value="Short Movies">Short Movies</option>
                                  <option value="Travel & Events">Travel & Events</option>
                                  <option value="Gaming">Gaming</option>
                                  <option value="Videoblogging">Videoblogging</option>
                                  <option value="People & Blogs">People & Blogs</option>
                                  <option value="Comedy">Comedy</option>
                                  <option value="Entertainment">Entertainment</option>
                                  <option value="News & Politics">News & Politics</option>
                                  <option value="Howto & Style">Howto & Style</option>
                                  <option value="Education">Education</option>
                                  <option value="Science & Technology">Science & Technology</option>
                                  <option value="Nonprofits & Activism">Nonprofits & Activism</option>
                                  <option value="Movies">Movies</option>
                                  <option value="Anime/Animation">Anime/Animation</option>
                                  <option value="Action/Adventure">Action/Adventure</option>
                                  <option value="Classics">Classics</option>
                                  <option value="Comedy">Comedy</option>
                                  <option value="Documentary">Documentary</option>
                                  <option value="Drama">Drama</option>
                                  <option value="Family">Family</option>
                                  <option value="Foreign">Foreign</option>
                                  <option value="Horror">Horror</option>
                                  <option value="Sci-Fi/Fantasy">Sci-Fi/Fantasy</option>
                                  <option value="Thriller">Thriller</option>
                                  <option value="Shorts">Shorts</option>
                                  <option value="Shows">Shows</option>
                                  <option value="Trailers">Trailers</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Category To Avoid:</h3>
              </td>
              <td>
                <select id="categoryAvoid" defaultValue="ALL" name="categoryAvoid">
                  <option value="ALL">All Categories</option>
                                  <option value="Film & Animation">Film & Animation</option>
                                  <option value="Autos & Vehicles">Autos & Vehicles</option>
                                  <option value="Music">Music</option>
                                  <option value="Pets & Animals">Pets & Animals</option>
                                  <option value="Sports">Sports</option>
                                  <option value="Short Movies">Short Movies</option>
                                  <option value="Travel & Events">Travel & Events</option>
                                  <option value="Gaming">Gaming</option>
                                  <option value="Videoblogging">Videoblogging</option>
                                  <option value="People & Blogs">People & Blogs</option>
                                  <option value="Comedy">Comedy</option>
                                  <option value="Entertainment">Entertainment</option>
                                  <option value="News & Politics">News & Politics</option>
                                  <option value="Howto & Style">Howto & Style</option>
                                  <option value="Education">Education</option>
                                  <option value="Science & Technology">Science & Technology</option>
                                  <option value="Nonprofits & Activism">Nonprofits & Activism</option>
                                  <option value="Movies">Movies</option>
                                  <option value="Anime/Animation">Anime/Animation</option>
                                  <option value="Action/Adventure">Action/Adventure</option>
                                  <option value="Classics">Classics</option>
                                  <option value="Comedy">Comedy</option>
                                  <option value="Documentary">Documentary</option>
                                  <option value="Drama">Drama</option>
                                  <option value="Family">Family</option>
                                  <option value="Foreign">Foreign</option>
                                  <option value="Horror">Horror</option>
                                  <option value="Sci-Fi/Fantasy">Sci-Fi/Fantasy</option>
                                  <option value="Thriller">Thriller</option>
                                  <option value="Shorts">Shorts</option>
                                  <option value="Shows">Shows</option>
                                  <option value="Trailers">Trailers</option>
                </select>
              </td>
            </tr>



            <tr>
              <td>
                <h3 className="inputLabel">Multiplier:</h3>
              </td>
              <td>
                <input type="number" style={{ width: "100%" }} id="multiplierTOD" name="multiplier" required={true} onChange={handleChange} value={data.multiplier} />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <p>Your goal is 'Category To Watch' x Multiplier = 'Category To Avoid'</p>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button style={{ width: "100%" }} className="responsiveGoalButton" type="submit" id="goalSubmitTOD">
                  Create Goal
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default TODGoalCreate;
