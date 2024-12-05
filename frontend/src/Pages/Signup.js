import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const youtubeCategories = [
    "Film & Animation",
    "Autos & Vehicles",
    "Music",
    "Pets & Animals",
    "Sports",
    "Travel & Events",
    "Gaming",
    "People & Blogs",
    "Comedy",
    "Entertainment",
    "News & Politics",
    "Howto & Style",
    "Education",
    "Science & Technology",
    "Nonprofits & Activism",
  ];

  const halfCategories = youtubeCategories.slice(
    0,
    Math.ceil(youtubeCategories.length / 2)
  );

  const handleSignup = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      username,
      password,
      phoneNumber,
      registered: true,
      goals: [],
      blocked: [],
      availableCategories: halfCategories,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/signup", // Correct endpoint
        newUser,
        { withCredentials: true } // Required to send cookies for the session
      );

      // Handle successful sign-up
      console.log("Sign-up successful", response.data);

      // Extract the userId from the response
      const { id: userId } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("session", "true");
      // Navigate to {userId}/home
      navigate(`/login`);
    } catch (error) {
      // Handle errors during sign-up
      if (error.response?.status === 409) {
        Store.addNotification({
          title: "Account Creation Error",
          message: "Username already taken",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else {
        console.error("Sign-up failed", error);
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <table style={{ width: "40%", marginLeft: "24%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "right", width: "30%" }}>
                <h5>Name: </h5>
              </td>
              <td style={{ width: "70%" }}>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right" }}>
                <h5>Email: </h5>
              </td>
              <td>
                <input
                  type="email"
                  style={{
                    width: "100%",
                    backgroundColor: "#BCBCBC",
                    border: "none",
                    borderBottom: "2px solid #121212",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right" }}>
                <h5>Username: </h5>
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right" }}>
                <h5>Password: </h5>
              </td>
              <td>
                <input
                  type="password"
                  style={{
                    width: "100%",
                    backgroundColor: "#BCBCBC",
                    border: "none",
                    borderBottom: "2px solid #121212",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right" }}>
                <h5>Phone Number: </h5>
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div style={{ width: "25%", margin: "auto" }}>
          <button style={{ width: "100%" }} type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
