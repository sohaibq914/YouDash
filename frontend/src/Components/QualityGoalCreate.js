import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QualityGoalCreate.css";
// import navbar from "../Components/navbar";

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
      alert("Invalid Multiplier! Must be greater than 0.");
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
      .post("http://localhost:8080/goals/thename/create", userData)
      .then((response) => console.log(response))
      .catch((error) => {
        if (error.response.status == "409") {
          alert("No duplicate goals!");
        } else {
          console.error(error);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
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
                <input type="text" id="goalDescriptionQ" name="goalDescription" required={false} onChange={handleChange} value={data.goalDescription} />
              </td>
            </tr>
            <tr>
              <td>
                <h3 className="inputLabel">Category To Watch:</h3>
              </td>
              <td>
                <select id="categoryToWatch" defaultValue="ALL" name="categoryToWatch">
                  <option value="ALL">All Categories</option>
                  <option value="SPORTS">Sports</option>
                  <option value="BLOG">Blog</option>
              <option value="DOCUMENTARY">Documentary</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
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
                  <option value="SPORTS">Sports</option>
                  <option value="BLOG">Blog</option>
              <option value="DOCUMENTARY">Documentary</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
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
