import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QualityGoalCreate.css";
// import navbar from "../Components/navbar";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';
import 'animate.css/animate.min.css';

function QualityGoalCreate() {
  const [data, setData] = useState({ goalName: "", goalDescription: "", categoryToWatch: "", categoryToAvoid: "", multiplier: 0 });

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
    const categoryToWatch = document.getElementById("categoryToWatch").value;
    const categoryToAvoid = document.getElementById("categoryToAvoid").value;
    if (+data.multiplier <= 0) {
      Store.addNotification({
                            title: "Goal Creation Error",
                            message: "Invalid Multiplier! Must be greater than 0.",
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
      "@type": "QualityGoal",
      goalName: data.goalName,
      goalDescription: data.goalDescription,
      categoryToWatch: categoryToWatch,
      categoryToAvoid: categoryToAvoid,
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
    console.log("YEEE " + theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
    return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));
  };

  return (
    <div className="QualityGoalCreate">
      <form onSubmit={handleSubmit}>
        <table className="tableGoal">
          <tbody>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Name:</h3>
              </td>
              <td>
                <input type="text" id="goalNameQ" name="goalName" autoCapitalize="words" required={true} onChange={handleChange} value={data.goalName} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Goal Description:</h3>
              </td>
              <td>
                <input type="text" id="goalDescriptionQ" name="goalDescription" required={true} onChange={handleChange} value={data.goalDescription} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Category To Watch:</h3>
              </td>
              <td>
                <select id="categoryToWatch" defaultValue="ALL" name="categoryToWatch">
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
                <select id="categoryToAvoid" defaultValue="ALL" name="categoryToAvoid">
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
                <h3 className="inputLabel">Multiplier</h3>
              </td>
              <td>
                <input type="number" style={{ width: "100%" }} id="multiplier" name="multiplier" required={true} onChange={handleChange} value={data.multiplier} />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <p>Your goal is 'Category To Watch' x Multiplier = 'Category To Avoid'</p>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button style={{ width: "100%" }} className="responsiveGoalButton" type="submit" id="goalSubmitQ">
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

export default QualityGoalCreate;
