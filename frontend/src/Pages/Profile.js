import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Import the useNavigate hook
import CaptureImageButton from "../Components/CaptureImageButton";
import { FileText, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";

function Profile() {
  const { userID } = useParams(); // Get userID from URL parameters

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
  const [isBioValid, setIsBioValid] = useState(true); // New state to track bio validity
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [isExporting, setIsExporting] = useState({ csv: false, pdf: false });

  const generateCSV = (data) => {
    const sections = {
      userInfo: {
        headers: ["Name", "Email", "Bio"],
        data: [[data.name, data.email, data.bio]],
      },
      watchTimeGoals: {
        headers: ["Category", "Target Watch Time", "Current Progress", "Status"],
        data: data.wtgoals?.map((goal) => [goal.category, goal.targetWatchTime, goal.currentProgress, goal.status]) || [],
      },
      qualityGoals: {
        headers: ["Category", "Target Quality", "Current Progress", "Status"],
        data: data.qgoals?.map((goal) => [goal.category, goal.targetQuality, goal.currentProgress, goal.status]) || [],
      },
      timeOfDayGoals: {
        headers: ["Category", "Start Time", "End Time", "Status"],
        data: data.todgoals?.map((goal) => [goal.category, goal.startTime, goal.endTime, goal.status]) || [],
      },
      blockedCategories: {
        headers: ["Blocked Category"],
        data: data.blocked?.map((category) => [category]) || [],
      },
    };

    let csvContent = "";
    Object.entries(sections).forEach(([sectionName, section]) => {
      if (section.data.length > 0) {
        csvContent += `\n${sectionName.toUpperCase()}\n`;
        csvContent += `${section.headers.join(",")}\n`;
        csvContent += section.data.map((row) => row.join(",").replace(/,/g, ";")).join("\n");
        csvContent += "\n";
      }
    });

    return csvContent;
  };
  const handleExportCSV = async () => {
    try {
      setIsExporting((prev) => ({ ...prev, csv: true }));
      const userID = localStorage.getItem("userId") || "12345"; // Fallback to test ID if needed

      const response = await axios.get(`http://localhost:8080/profile/${userID}/full`, { withCredentials: true });
      const userData = response.data;

      const csvContent = generateCSV(userData);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `youdash_data_${userData.username}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Your data has been exported to CSV successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Please ensure you are logged in.");
      } else {
        alert("Failed to export data. Please try again.");
      }
    } finally {
      setIsExporting((prev) => ({ ...prev, csv: false }));
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting((prev) => ({ ...prev, pdf: true }));
      const userID = localStorage.getItem("userId") || "12345";

      const response = await axios.get(`http://localhost:8080/profile/${userID}/full`, { withCredentials: true });
      const userData = response.data;

      // Create PDF document
      const doc = new jsPDF();
      let yPos = 20;
      const lineHeight = 7;

      // Title
      doc.setFontSize(16);
      doc.text("YouDash User Data Export", 20, yPos);
      yPos += lineHeight * 2;

      // User Information
      doc.setFontSize(14);
      doc.text("User Information", 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      doc.text(`Name: ${userData.name}`, 20, yPos);
      yPos += lineHeight;
      doc.text(`Email: ${userData.email}`, 20, yPos);
      yPos += lineHeight;
      doc.text(`Bio: ${userData.bio || "No bio"}`, 20, yPos);
      yPos += lineHeight * 2;

      // Watch Time Goals
      doc.setFontSize(14);
      doc.text("Watch Time Goals", 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      if (userData.wtgoals?.length > 0) {
        userData.wtgoals.forEach((goal) => {
          doc.text(`Category: ${goal.category}`, 20, yPos);
          yPos += lineHeight;
          doc.text(`Target Watch Time: ${goal.targetWatchTime}`, 30, yPos);
          yPos += lineHeight;
          doc.text(`Current Progress: ${goal.currentProgress}`, 30, yPos);
          yPos += lineHeight;
          doc.text(`Status: ${goal.status}`, 30, yPos);
          yPos += lineHeight * 1.5;
        });
      } else {
        doc.text("No watch time goals set", 20, yPos);
        yPos += lineHeight;
      }
      yPos += lineHeight;

      // Quality Goals
      doc.setFontSize(14);
      doc.text("Quality Goals", 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      if (userData.qgoals?.length > 0) {
        userData.qgoals.forEach((goal) => {
          doc.text(`Category: ${goal.category}`, 20, yPos);
          yPos += lineHeight;
          doc.text(`Target Quality: ${goal.targetQuality}`, 30, yPos);
          yPos += lineHeight;
          doc.text(`Current Progress: ${goal.currentProgress}`, 30, yPos);
          yPos += lineHeight;
          doc.text(`Status: ${goal.status}`, 30, yPos);
          yPos += lineHeight * 1.5;
        });
      } else {
        doc.text("No quality goals set", 20, yPos);
        yPos += lineHeight;
      }

      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Time of Day Goals
      doc.setFontSize(14);
      doc.text("Time of Day Goals", 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      if (userData.todgoals?.length > 0) {
        userData.todgoals.forEach((goal) => {
          doc.text(`Category: ${goal.category}`, 20, yPos);
          yPos += lineHeight;
          doc.text(`Start Time: ${goal.startTime}`, 30, yPos);
          yPos += lineHeight;
          doc.text(`End Time: ${goal.endTime}`, 30, yPos);
          yPos += lineHeight;
          doc.text(`Status: ${goal.status}`, 30, yPos);
          yPos += lineHeight * 1.5;
        });
      } else {
        doc.text("No time of day goals set", 20, yPos);
        yPos += lineHeight;
      }

      // Blocked Categories
      doc.setFontSize(14);
      doc.text("Blocked Categories", 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      if (userData.blocked?.length > 0) {
        userData.blocked.forEach((category) => {
          doc.text(`• ${category}`, 20, yPos);
          yPos += lineHeight;
        });
      } else {
        doc.text("No blocked categories", 20, yPos);
      }

      // Footer
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);

      // Save PDF
      doc.save(`youdash_data_${userData.username}_${new Date().toISOString().split("T")[0]}.pdf`);
      alert("Your data has been exported to PDF successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Please ensure you are logged in.");
      } else {
        alert("Failed to export data. Please try again.");
      }
    } finally {
      setIsExporting((prev) => ({ ...prev, pdf: false }));
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/profile/${userID}`);
        const userData = response.data;

        const emailIsGmail = userData.email.endsWith("@gmail.com");
        setIsGmail(emailIsGmail);

        // Set the profile with the fetched data, including the profile picture
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

  // Helper function to validate bio (non-empty)
  const validateBio = (bio) => {
    return bio.trim() !== "";
  };

  const handleEditClick = (field) => {
    if ((field === "email" || field === "password") && isGmail) {
      // alert("Email and password cannot be edited for Gmail accounts.");
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

    // Check bio validity in real-time
    if (editField === "bio") {
      const valid = validateBio(value);
      setIsBioValid(valid);
    }
  };

  const handleSave = async () => {
    // Validate email, password, and bio before saving
    if (editField === "email" && !isEmailValid) {
      // alert("Please enter a valid email address.");
      return;
    }

    if (editField === "password" && !isPasswordValid) {
      // alert("Password must be at least 5 characters long.");
      return;
    }

    if (editField === "bio" && !isBioValid) {
      // alert("Bio cannot be empty.");
      return;
    }

    setEditField(null);
    try {
      // const userID = 12345; // Replace with the actual userID
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
      // const userID = 12345; // Replace with the actual userID
      const response = await axios.post(`http://localhost:8080/profile/${userID}/uploadProfilePicture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile picture uploaded successfully:", response.data.profilePicture);
      setProfile({ ...profile, profilePicture: response.data.profilePicture });
      setSelectedFile(null);
      // alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      // alert("Failed to upload profile picture.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate(`/${userID}/followers`)} style={styles.actionButton}>
          {" "}
          View Followers
        </button>

        <button onClick={handleExportCSV} disabled={isExporting.csv} style={styles.actionButton}>
          <FileSpreadsheet style={styles.buttonIcon} />
          {isExporting.csv ? "Exporting..." : "Export CSV"}
        </button>

        <button onClick={handleExportPDF} disabled={isExporting.pdf} style={styles.actionButton}>
          <FileText style={styles.buttonIcon} />
          {isExporting.pdf ? "Exporting..." : "Export PDF"}
        </button>
      </div>
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

      <button
        onClick={() => navigate("/followers")} // Use the useNavigate hook to redirect
        style={styles.followersButton}
      >
        View Followers
      </button>

      <CaptureImageButton />

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
                  borderColor: (key === "email" && !isEmailValid) || (key === "password" && !isPasswordValid) || (key === "bio" && !isBioValid) ? "red" : "initial",
                }}
                disabled={isGmail && (key === "email" || key === "password")}
              />
              {key === "email" && !isEmailValid && <span style={styles.errorText}>Invalid email format</span>}
              {key === "password" && !isPasswordValid && <span style={styles.errorText}>Password must be at least 5 characters long</span>}
              {key === "bio" && !isBioValid && <span style={styles.errorText}>Bio cannot be empty</span>}
            </>
          ) : (
            <div style={styles.fieldValue}>{value}</div>
          )}
          {editField === key ? (
            <button onClick={handleSave} style={styles.saveButton} disabled={(key === "email" && !isEmailValid) || (key === "password" && !isPasswordValid) || (key === "bio" && !isBioValid)}>
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
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "10px",
  },
  actionButton: {
    padding: "8px 16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flex: "1",
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
  },
};

export default Profile;
