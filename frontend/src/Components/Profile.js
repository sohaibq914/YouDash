import React, { useState } from "react";

function Profile() {
  // State to handle the edit mode for each field
  const [editField, setEditField] = useState(null);
  const [profile, setProfile] = useState({
    name: "John Doe",
    bio: "I'm a software developer passionate about creating user-friendly applications.",
    email: "john.doe@example.com",
    password: "********",
  });

  const handleEditClick = (field) => {
    setEditField(field);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [editField]: e.target.value });
  };

  const handleSave = () => {
    setEditField(null);
    // aws stuff here
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
          {editField === key ? <input type={key === "password" ? "password" : "text"} value={profile[key]} onChange={handleChange} style={styles.input} /> : <div style={styles.fieldValue}>{value}</div>}
          {editField === key ? (
            <button onClick={handleSave} style={styles.saveButton}>
              Save
            </button>
          ) : (
            <button onClick={() => handleEditClick(key)} style={styles.editButton}>
              Edit
            </button>
          )}
        </div>
      ))}
      <button style={styles.changeProfileButton}>Change Profile Picture</button>
    </div>
  );
}

// Inline styles for simplicity
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
