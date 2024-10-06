import React, { useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import axios from "axios";

function Profile() {
  const [editField, setEditField] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    password: "********", // Default value for display purposes
  });
  const [isGmail, setIsGmail] = useState(false); // State to track if the email is Gmail

  // Fetch the user profile data from the backend when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userID = 12345; // Replace with the actual userID
        const response = await axios.get(`http://localhost:8080/profile/${userID}`);
        const userData = response.data;

        // Check if the email is a Gmail address and set state accordingly
        const emailIsGmail = userData.email.endsWith("@gmail.com");
        setIsGmail(emailIsGmail);

        setProfile({
          name: userData.name || "",
          bio: userData.bio || "",
          email: userData.email || "",
          password: "********", // Do not fetch the actual password for security reasons
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this useEffect runs once on component mount

  const handleEditClick = (field) => {
    // Prevent editing of email and password fields if the email is Gmail
    if ((field === "email" || field === "password") && isGmail) {
      alert("Email and password cannot be edited for Gmail accounts.");
      return;
    }
    setEditField(field);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [editField]: e.target.value });
  };

  const handleSave = async () => {
    setEditField(null);

    try {
      const userID = 12345; // Replace with the actual userID
      const response = await axios.put(`http://localhost:8080/profile/${userID}/updateProfile`, {
        name: profile.name,
        bio: profile.bio,
        email: isGmail ? null : profile.email, // Send email only if not Gmail
        password: profile.password === "********" ? null : profile.password, // Send password only if changed
      });
      console.log(response.data); // Log success message
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      <div style={styles.profilePicContainer}>
        <div style={styles.profilePic}></div>
      </div>
      {Object.entries(profile).map(([key, value]) => (
        <div key={key} style={styles.fieldContainer}>
          <div style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
          {editField === key ? (
            <input
              type={key === "password" ? "password" : "text"}
              value={profile[key]}
              onChange={handleChange}
              style={styles.input}
              disabled={isGmail && (key === "email" || key === "password")} // Disable input if email is Gmail
            />
          ) : (
            <div style={styles.fieldValue}>{value}</div>
          )}
          {editField === key ? (
            <button onClick={handleSave} style={styles.saveButton}>
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEditClick(key)}
              style={styles.editButton}
              disabled={isGmail && (key === "email" || key === "password")} // Disable button if email is Gmail
            >
              Edit
            </button>
          )}
        </div>
      ))}
      <button style={styles.changeProfileButton}>Change Profile Picture</button>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  profilePicContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  profilePic: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  fieldLabel: {
    fontWeight: "bold",
    width: "20%",
  },
  fieldValue: {
    width: "60%",
  },
  input: {
    width: "60%",
    padding: "5px",
  },
  editButton: {
    padding: "5px 10px",
    cursor: "pointer",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "5px",
    disabled: { cursor: "not-allowed", opacity: 0.5 }, // Add disabled styles
  },
  saveButton: {
    padding: "5px 10px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  changeProfileButton: {
    width: "100%",
    padding: "10px",
    cursor: "pointer",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "5px",
    marginTop: "30px",
  },
};

export default Profile;
