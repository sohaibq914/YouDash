import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [editField, setEditField] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    password: "********",
    profilePicture: "", // New field for storing profile picture URL
  });
  const [isGmail, setIsGmail] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // New state to track the selected file

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userID = 12345; // Replace with the actual userID
        const response = await axios.get(`http://localhost:8080/profile/${userID}`);
        const userData = response.data;

        const emailIsGmail = userData.email.endsWith("@gmail.com");
        setIsGmail(emailIsGmail);

        setProfile({
          name: userData.name || "",
          bio: userData.bio || "",
          email: userData.email || "",
          password: "********",
          profilePicture: userData.profilePicture || "", // Set profile picture from user data
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = (field) => {
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
        email: isGmail ? null : profile.email,
        password: profile.password === "********" ? null : profile.password,
        profilePicture: profile.profilePicture, // Include profile picture URL if changed
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // New method to handle profile picture upload
  const handleProfilePictureUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const userID = 12345; // Replace with the actual userID
      const response = await axios.post(`http://localhost:8080/profile/${userID}/uploadProfilePicture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile({ ...profile, profilePicture: response.data.profilePicture });
      setSelectedFile(null);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      <div style={styles.profilePicContainer}>
        <img
          src={profile.profilePicture || "https://via.placeholder.com/100"} // Display profile picture if available
          alt="Profile"
          style={styles.profilePic}
        />
      </div>
      <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} style={styles.fileInput} />
      <button onClick={handleProfilePictureUpload} style={styles.uploadButton}>
        Upload Profile Picture
      </button>
      {Object.entries(profile).map(([key, value]) => (
        <div key={key} style={styles.fieldContainer}>
          <div style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
          {editField === key ? <input type={key === "password" ? "password" : "text"} value={profile[key]} onChange={handleChange} style={styles.input} disabled={isGmail && (key === "email" || key === "password")} /> : <div style={styles.fieldValue}>{value}</div>}
          {editField === key ? (
            <button onClick={handleSave} style={styles.saveButton}>
              Save
            </button>
          ) : (
            <button onClick={() => handleEditClick(key)} style={styles.editButton} disabled={isGmail && (key === "email" || key === "password")}>
              Edit
            </button>
          )}
        </div>
      ))}
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
    objectFit: "cover", // Ensure image fits the circular shape
  },
  fileInput: {
    margin: "10px 0",
  },
  uploadButton: {
    padding: "5px 10px",
    cursor: "pointer",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "5px",
    marginBottom: "20px",
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
};

export default Profile;
