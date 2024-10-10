import React, { useEffect, useState, useId } from "react";
import axios from "axios";

import "./GoalEditComponent.css";

function GoalEditComponent(props) {
    const uniqueId = useId();
    const goal = props.goal;
    const maxWT = 2459;
    let originalGoalName = props.goal.goalName;

    useEffect (() => {

        if (!goal.hasOwnProperty("multiplier")) {
            if (goal.watchLessThanGoal) {
                document.getElementById('aimAboveGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
                document.getElementById('aimBelowGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
            } else {
              document.getElementById('aimAboveGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
              document.getElementById('aimBelowGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
            }
        }
    }, []);

    const updateName = (e) => {
        goal.goalName = document.getElementById('goalName' + uniqueId).value;
        submitChange(e);
      };

    const updateDescription = (e) => {
        goal.goalDescription = document.getElementById('goalDescription' + uniqueId).value;
        submitChange(e);
      };

    const updateCategory = (e) => {
        goal.theCategory = document.getElementById('category' + uniqueId).value;
        submitChange(e);
      };

    const updateCategoryToWatch = (e) => {
          goal.categoryToWatch = document.getElementById('categoryToWatch' + uniqueId).value;
          submitChange(e);
        };

    const updateCategoryToAvoid = (e) => {
            goal.categoryToAvoid = document.getElementById('categoryToAvoid' + uniqueId).value;
            submitChange(e);
          };

    const updateGoalWatchTime = (e) => {
        const newWT =  document.getElementById('goalWatchTime' + uniqueId).value;
        if (newWT <= maxWT) {
            goal.goalWatchTime = newWT;
            submitChange(e);
        } else {
            document.getElementById('goalWatchTime' + uniqueId).value = maxWT;
            goal.goalWatchTime = maxWT;
            submitChange(e);
        }
      };

      const updateMultiplier = (e) => {
              const mult =  document.getElementById('multiplier' + uniqueId).value;
              if (mult > 0) {
                  goal.multiplier = mult;
                  submitChange(e);
              } else {
                  alert("Invalid Multiplier! Must be greater than 0.");
                  document.getElementById('multiplier' + uniqueId).value = goal.multiplier;
              }
            };

    const aimForLessBtn = (e) => {
        goal.watchLessThanGoal = "true";
        if (!goal.hasOwnProperty("multiplier")) {
            document.getElementById('aimAboveGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
            document.getElementById('aimBelowGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
        }
        submitChange(e);
      };

    const aimForMoreBtn = (e) => {
      goal.watchLessThanGoal = "false";
      if (!goal.hasOwnProperty("multiplier")) {
        document.getElementById('aimAboveGoal' + uniqueId).classList.add("selectedAimAboveBelowButton");
        document.getElementById('aimBelowGoal' + uniqueId).classList.remove("selectedAimAboveBelowButton");
      }
      submitChange(e);
    };

    const submitChange = (e) => {
        e.preventDefault();

        if (!goal.hasOwnProperty("multiplier")) {
            goal["@type"] = "WatchTimeGoal";
        } else {
            goal["@type"] = "QualityGoal";
        }
        const goalUpdate = {
            originalName: originalGoalName,
            g: goal
        };
        console.log(goal);
        originalGoalName = goal.goalName;
        console.log(originalGoalName);
        axios
          .post("http://localhost:8080/goals/thename/edit", goalUpdate)
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      };

    const deleteGoal = (e) => {
        console.log('deleted');
        if (!goal.hasOwnProperty("multiplier")) {
            goal["@type"] = "WatchTimeGoal";
        } else {
            goal["@type"] = "QualityGoal";
        }
        axios
                  .post("http://localhost:8080/goals/thename/delete", goal)
                  .then((response) => console.log(response))
                  .catch((error) => console.error(error));
        window.location.reload();
    };

  return (
    <div className="GoalEditComponent goalEditField">
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <button type="button" className="deleteBtn" id={'delete' + uniqueId} name="deleteGoal" onClick={deleteGoal}>
                                     Delete
                                    </button></div>
        <table className="tableGoalView" style={{width: "90%"}}>
        <tbody>
        <tr>
        <td style={{width: "30%"}}>
            <h3 style={{marginTop: "0.5rem"}}>Name: </h3>
        </td>
        <td style={{width: "70%"}}>
            <input type="text" id={'goalName' + uniqueId} defaultValue={goal?.goalName || "ERROR"} onBlur={updateName} />
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Description: </h3>
        </td>
        <td>
            <input type="text" id={'goalDescription' + uniqueId} defaultValue={goal?.goalDescription || "None"} onBlur={updateDescription} />
        </td>
        </tr>
        {(!goal?.multiplier || false) ? (
        <>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Category: </h3>
        </td>
        <td>
            <select id={'category' + uniqueId} defaultValue={goal.theCategory} name="theCategory" onChange={updateCategory}>
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
            <h3 style={{marginTop: "0.5rem"}}>Current Watch Time: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.currentWatchTime || "0"} minutes</h3>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Goal Watch Time: </h3>
        </td>
        <td>
            <input type="number" id={'goalWatchTime' + uniqueId} defaultValue={goal?.goalWatchTime || "0"} onBlur={updateGoalWatchTime} />
        </td>
        </tr>
        <tr>
        <td>
        <button type="button" style={{ width: "100%" }} className="responsiveGoalButton" id={'aimAboveGoal' + uniqueId} name="watchLessThanGoal" value={false} onClick={aimForMoreBtn}>
                         Aim Above
                        </button>
        </td>
        <td>
                        <button type="button" style={{ width: "100%" }} className="responsiveGoalButton" id={'aimBelowGoal' + uniqueId} name="watchLessThanGoal" value={true} onClick={aimForLessBtn}>
                          Aim Below
                        </button>
        </td>
        </tr>
        </>
        ) : (
        <>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Category To Avoid: </h3>
        </td>
        <td>
            <select id={'categoryToAvoid' + uniqueId} defaultValue={goal.categoryToAvoid} name="categoryToAvoid" onChange={updateCategoryToAvoid}>
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
            <h3 style={{marginTop: "0.5rem"}}>Time in Category: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.progressAvoid || "0"}</h3>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Category To Watch: </h3>
        </td>
        <td>
            <select id={'categoryToWatch' + uniqueId} defaultValue={goal.categoryToWatch} name="categoryToWatch" onChange={updateCategoryToWatch}>
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
            <h3 style={{marginTop: "0.5rem"}}>Time in Category: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.progressWatch || "0"}</h3>
        </td>
        </tr>
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Multiplier: </h3>
        </td>
        <td>
            <input type="number" id={'multiplier' + uniqueId} defaultValue={goal?.multiplier || "0"} onBlur={updateMultiplier} />
        </td>
        </tr>
        </>
        )}
        <tr>
        <td>
            <h3 style={{marginTop: "0.5rem"}}>Goal Progress: </h3>
        </td>
        <td>
            <h3 style={{textAlign: "left", marginTop: "0.5rem"}}>{goal?.goalProgress*100 || "N/A"}%</h3>
        </td>
        </tr>
        </tbody>
        </table>
    </div>
  );
}

export default GoalEditComponent;
