import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WTGoalCreate.css";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';
import 'animate.css/animate.min.css';
// import navbar from "../Components/navbar";

function WTGoalCreate() {
  const [data, setData] = useState({ goalName: "", goalDescription: "", goalWatchTime: "", theCategory: "", watchLessThanGoal: "false" });
  let minutes = 0;
  let hours = 0;
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value + " " + e.target.name);
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const handleAboveGoalBtn = (e) => {
    handleChange(e);
    document.getElementById("aimAboveGoal").classList.add("selectedAimAboveBelowButton");
    document.getElementById("aimBelowGoal").classList.remove("selectedAimAboveBelowButton");
  };

  const handleBelowGoalBtn = (e) => {
    handleChange(e);
    document.getElementById("aimAboveGoal").classList.remove("selectedAimAboveBelowButton");
    document.getElementById("aimBelowGoal").classList.add("selectedAimAboveBelowButton");
  };

  const minuteRangeChange = (e) => {
    minutes = e.target.value;
    const minutesInput = document.getElementById("minutesInput");
    minutesInput.value = minutes;
  };

  const minuteInputChange = (e) => {
    minutes = e.target.value;
    const minutesRange = document.getElementById("minutesRange");
    minutesRange.value = minutes;
  };

  const hourRangeChange = (e) => {
    hours = e.target.value;
    const hoursInput = document.getElementById("hoursInput");
    hoursInput.value = hours;
  };

  const hourInputChange = (e) => {
    hours = e.target.value;
    const hoursRange = document.getElementById("hoursRange");
    hoursRange.value = hours;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    minutes = document.getElementById("minutesInput").value;
    hours = document.getElementById("hoursInput").value;
    if (+minutes + +hours * 60 == 0) {
        Store.addNotification({
            title: "Goal Creation Error",
            message: "Goal watch time must be above 0!",
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
    const theCategory = document.getElementById("category").value;
    const userData = {
      "@type": "WatchTimeGoal",
      goalName: data.goalName,
      goalDescription: data.goalDescription,
      goalWatchTime: +minutes + +hours * 60,
      theCategory: theCategory,
      watchLessThanGoal: data.watchLessThanGoal,
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
    <div className="WTGoalCreate">
      <form onSubmit={handleSubmit}>
        <table className="tableGoal">
          <tbody>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Name:</h3>
              </td>
              <td>
                <input type="text" id="goalName" name="goalName" autoCapitalize="words" required={true} onChange={handleChange} value={data.goalName} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Description:</h3>
              </td>
              <td>
                <input type="text" id="goalDescription" name="goalDescription" required={true} onChange={handleChange} value={data.goalDescription} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Watchtime Limit:</h3>
              </td>
              <td>
                <table className="tableTime">
                  <tbody>
                    <tr>
                      <td>
                        <h4 style={{ fontSize: "calc(0.9rem + .3vw)" }}>Hours:</h4>
                      </td>
                      <td className="disappearWhenSmall">
                        <input type="range" style={{ width: "100%" }} min="0" max="40" id="hoursRange" name="hoursRange" step="1" onChange={hourRangeChange} />
                      </td>
                      <td>
                        <input type="number" style={{ width: "100%" }} id="hoursInput" name="hoursInput" required={true} min="0" max="40" onChange={hourInputChange} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h4 style={{ fontSize: "calc(0.9rem + .3vw)" }}>Minutes:</h4>
                      </td>
                      <td className="disappearWhenSmall">
                        <input type="range" style={{ width: "100%" }} min="0" max="55" id="minutesRange" name="minutesRange" step="5" onChange={minuteRangeChange} />
                      </td>
                      <td>
                        <input type="number" style={{ width: "100%" }} id="minutesInput" name="minutesInput" required={true} min="0" max="59" onChange={minuteInputChange} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Aim Above or Below Limit:</h3>
              </td>
              <td>
                <button type="button" style={{ width: "50%" }} className="selectedAimAboveBelowButton responsiveGoalButton" id="aimAboveGoal" name="watchLessThanGoal" value={false} onClick={handleAboveGoalBtn}>
                  Above
                </button>
                <button type="button" style={{ width: "50%" }} className="responsiveGoalButton" id="aimBelowGoal" name="watchLessThanGoal" value={true} onClick={handleBelowGoalBtn}>
                  Below
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Category:</h3>
              </td>
              <td>
                <select id="category" defaultValue="ALL" name="theCategory">
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
              <td colSpan="2">
                <button style={{ width: "100%" }} className="responsiveGoalButton" type="submit" id="goalSubmit">
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

export default WTGoalCreate;
