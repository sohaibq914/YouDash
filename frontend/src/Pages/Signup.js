import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

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
      availableCategories: [],
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

      // Navigate to {userId}/home
      navigate(`/${userId}/home`);
    } catch (error) {
      // Handle errors during sign-up
      if (error.response?.status === 409) {
        alert("Username already taken");
      } else {
        console.error("Sign-up failed", error);
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;