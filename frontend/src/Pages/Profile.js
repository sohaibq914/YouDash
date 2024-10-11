import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

function Profile() {
  const [editField, setEditField] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    password: "",
    profilePicture: "", // New field for storing profile picture URL
  });
  const [isGmail, setIsGmail] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // New state to track the selected file
  const [isEmailValid, setIsEmailValid] = useState(true); // New state to track email validity
  const [isPasswordValid, setIsPasswordValid] = useState(true); // New state to track password validity
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userID = 12345; // Replace with the actual userID
        const response = await axios.get(`http://localhost:8080/profile/${userID}`);
        const userData = response.data;

        const emailIsGmail = userData.email.endsWith("@gmail.com");
        setIsGmail(emailIsGmail);

        // Set the profile with the fetched data, including the profile picture
        console.log("SUPPPPP" + userData.profilePicture);
        setProfile({
          name: userData.name || "",
          bio: userData.bio || "",
          email: userData.email || "",
          password: "",
          profilePicture: "https://profilepicture12.s3.us-east-2.amazonaws.com/" + userData.profilePictureKey || "", // Set profile picture from user data
        });

        console.log("Profile data fetched:", userData); // Check the fetched profile data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Helper function to validate email format using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to validate password length (min 5 characters)
  const validatePassword = (password) => {
    return password.length >= 5;
  };

  const handleEditClick = (field) => {
    if ((field === "email" || field === "password") && isGmail) {
      alert("Email and password cannot be edited for Gmail accounts.");
      return;
    }
    setEditField(field);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setProfile({ ...profile, [editField]: value });

    // Check email validity in real-time
    if (editField === "email") {
      const valid = validateEmail(value);
      setIsEmailValid(valid);
    }

    // Check password validity in real-time
    if (editField === "password") {
      const valid = validatePassword(value);
      setIsPasswordValid(valid);
    }
  };

  const handleSave = async () => {
    // Validate email and password before saving
    if (editField === "email" && !isEmailValid) {
      alert("Please enter a valid email address.");
      return;
    }

    if (editField === "password" && !isPasswordValid) {
      alert("Password must be at least 5 characters long.");
      return;
    }

    setEditField(null);
    try {
      const userID = 12345; // Replace with the actual userID
      const response = await axios.put(`http://localhost:8080/profiles/${userID}/updateProfile`, {
        name: profile.name,
        bio: profile.bio,
        email: isGmail ? null : profile.email,
        password: profile.password === "********" ? null : profile.password,
        profilePicture: profile.profilePicture, // Include profile picture URL if changed
      });
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Method to handle profile picture upload
  const handleProfilePictureUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const userID = 12345; // Replace with the actual userID
      const response = await axios.post(`http://localhost:8080/profile/${userID}/uploadProfilePicture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile picture uploaded successfully:", response.data.profilePicture);
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
        {console.log(profile.profilePicture)}
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

      <button
        onClick={() => navigate("/followers")} // Use the useNavigate hook to redirect
        style={styles.followersButton}
      >
        View Followers
      </button>

      {Object.entries(profile).map(([key, value]) => (
        <div key={key} style={styles.fieldContainer}>
          <div style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
          {editField === key ? (
            <>
              <input
                type={key === "password" ? "password" : "text"}
                value={profile[key]}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  borderColor: (key === "email" && !isEmailValid) || (key === "password" && !isPasswordValid) ? "red" : "initial",
                }}
                disabled={isGmail && (key === "email" || key === "password")}
              />
              {key === "email" && !isEmailValid && <span style={styles.errorText}>Invalid email format</span>}
              {key === "password" && !isPasswordValid && <span style={styles.errorText}>Password must be at least 5 characters long</span>}
            </>
          ) : (
            <div style={styles.fieldValue}>{value}</div>
          )}
          {editField === key ? (
            <button onClick={handleSave} style={styles.saveButton} disabled={(key === "email" && !isEmailValid) || (key === "password" && !isPasswordValid)}>
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
  errorText: {
    color: "red",
    fontSize: "12px",
    marginLeft: "10px",
  },
};

export default Profile;
