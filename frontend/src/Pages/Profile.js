import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CaptureImageButton from "../Components/CaptureImageButton";
import { FileText, FileSpreadsheet, Lock, Unlock } from "lucide-react";
import jsPDF from "jspdf";

function Profile() {
  const { userID } = useParams();
  const [editField, setEditField] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    password: "",
    profilePicture: "",
    isPrivate: false
  });
  const [isGmail, setIsGmail] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isBioValid, setIsBioValid] = useState(true);
  const [isExporting, setIsExporting] = useState({ csv: false, pdf: false });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [privacySuccess, setPrivacySuccess] = useState(null);
  const [privacyError, setPrivacyError] = useState(null);
  const navigate = useNavigate();

  // Privacy-related useEffect
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/privacy/${userID}/pending-requests`);
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();
  }, [userID]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/profile/${userID}`);
        const userData = response.data;

        const emailIsGmail = userData.email.endsWith("@gmail.com");
        setIsGmail(emailIsGmail);

        setProfile({
          name: userData.name || "",
          bio: userData.bio || "",
          email: userData.email || "",
          password: "",
          profilePicture: "https://profilepicture12.s3.us-east-2.amazonaws.com/" + userData.profilePictureKey || "",
          isPrivate: userData.isPrivate || false
        });

        console.log("Profile data fetched:", userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

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
      const response = await axios.get(`http://localhost:8080/profile/${userID}/full`, { withCredentials: true });
      const userData = response.data;

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

      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

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

      // Time of Day Goals
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 5;
  };

  const validateBio = (bio) => {
    return bio.trim() !== "";
  };

  const handlePrivacyToggle = async () => {
    try {
      await axios.post(`http://localhost:8080/api/privacy/${userID}/toggle?isPrivate=${!profile.isPrivate}`);
      setProfile({ ...profile, isPrivate: !profile.isPrivate });
      setPrivacySuccess("Privacy settings updated successfully");
      setTimeout(() => setPrivacySuccess(null), 3000);
    } catch (error) {
      setPrivacyError("Failed to update privacy settings");
      console.error("Error:", error);
      setTimeout(() => setPrivacyError(null), 3000);
    }
  };

  const handleFollowRequest = async (requesterId, accept) => {
    try {
      await axios.post(`http://localhost:8080/api/privacy/${userID}/handle-request`, {
        requesterId,
        accept
      });
      const response = await axios.get(`http://localhost:8080/api/privacy/${userID}/pending-requests`);
      setPendingRequests(response.data);
      setPrivacySuccess(accept ? "Follow request accepted" : "Follow request rejected");
      setTimeout(() => setPrivacySuccess(null), 3000);
    } catch (error) {
      setPrivacyError("Failed to handle follow request");
      console.error("Error:", error);
      setTimeout(() => setPrivacyError(null), 3000);
    }
  };

  const handleEditClick = (field) => {
    if ((field === "email" || field === "password") && isGmail) {
      return;
    }
    setEditField(field);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setProfile({ ...profile, [editField]: value });

    if (editField === "email") {
      setIsEmailValid(validateEmail(value));
    }

    if (editField === "password") {
      setIsPasswordValid(validatePassword(value));
    }

    if (editField === "bio") {
      setIsBioValid(validateBio(value));
    }
  };

  const handleSave = async () => {
    if (editField === "email" && !isEmailValid) {
      return;
    }

    if (editField === "password" && !isPasswordValid) {
      return;
    }

    if (editField === "bio" && !isBioValid) {
      return;
    }

    setEditField(null);
    try {
      const response = await axios.put(`http://localhost:8080/profiles/${userID}/updateProfile`, {
        name: profile.name,
        bio: profile.bio,
        email: isGmail ? null : profile.email,
        password: profile.password === "********" ? null : profile.password,
        profilePicture: profile.profilePicture,
      });
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`http://localhost:8080/profile/${userID}/uploadProfilePicture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile picture uploaded successfully:", response.data.profilePicture);
      setProfile({ ...profile, profilePicture: response.data.profilePicture });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate(`/${userID}/followers`)} style={styles.actionButton}>
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
  
      {/* Privacy Settings Section */}
      <div style={styles.privacySection}>
        <h2 style={styles.sectionTitle}>Privacy Settings</h2>
        <div style={styles.privacyToggle}>
          <span style={styles.privacyLabel}>
            {profile.isPrivate ? <Lock size={20} /> : <Unlock size={20} />}
            {profile.isPrivate ? "Private Account" : "Public Account"}
          </span>
          <button
            onClick={handlePrivacyToggle}
            style={{
              ...styles.privacyButton,
              backgroundColor: profile.isPrivate ? "#dc3545" : "#28a745"
            }}
          >
            {profile.isPrivate ? "Make Public" : "Make Private"}
          </button>
        </div>
        {privacySuccess && <div style={styles.successMessage}>{privacySuccess}</div>}
        {privacyError && <div style={styles.errorMessage}>{privacyError}</div>}
      </div>
  
      {/* Pending Follow Requests Section */}
      {pendingRequests.length > 0 && (
        <div style={styles.requestsSection}>
          <h2 style={styles.sectionTitle}>Pending Follow Requests</h2>
          <div style={styles.requestsList}>
            {pendingRequests.map((request) => (
              <div key={request.requesterId} style={styles.requestItem}>
                <span style={styles.requesterName}>{request.requesterName}</span>
                <div style={styles.requestButtons}>
                  <button
                    onClick={() => handleFollowRequest(request.requesterId, true)}
                    style={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleFollowRequest(request.requesterId, false)}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
  
      <div style={styles.profilePicContainer}>
        <img
          src={profile.profilePicture || "https://via.placeholder.com/100"}
          alt="Profile"
          style={styles.profilePic}
        />
      </div>
  
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        style={styles.fileInput}
      />
      <button onClick={handleProfilePictureUpload} style={styles.uploadButton}>
        Upload Profile Picture
      </button>
  
      <CaptureImageButton />
  
      {/* Profile Fields */}
      {Object.entries(profile).map(([key, value]) => {
        // Skip the isPrivate field as it's handled separately
        if (key === 'isPrivate') return null;
        
        return (
          <div key={key} style={styles.fieldContainer}>
            <div style={styles.fieldLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
            {editField === key ? (
              <>
                <input
                  type={key === "password" ? "password" : "text"}
                  value={value}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    borderColor: 
                      (key === "email" && !isEmailValid) ||
                      (key === "password" && !isPasswordValid) ||
                      (key === "bio" && !isBioValid)
                        ? "red"
                        : "initial",
                  }}
                  disabled={isGmail && (key === "email" || key === "password")}
                />
                {key === "email" && !isEmailValid && (
                  <span style={styles.errorText}>Invalid email format</span>
                )}
                {key === "password" && !isPasswordValid && (
                  <span style={styles.errorText}>Password must be at least 5 characters</span>
                )}
                {key === "bio" && !isBioValid && (
                  <span style={styles.errorText}>Bio cannot be empty</span>
                )}
              </>
            ) : (
              <div style={styles.fieldValue}>
                {key === "password" ? "********" : value}
              </div>
            )}
            {editField === key ? (
              <button
                onClick={handleSave}
                style={styles.saveButton}
                disabled={
                  (key === "email" && !isEmailValid) ||
                  (key === "password" && !isPasswordValid) ||
                  (key === "bio" && !isBioValid)
                }
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEditClick(key)}
                style={styles.editButton}
                disabled={isGmail && (key === "email" || key === "password")}
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#333'
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#4338CA'
    },
    ':disabled': {
      backgroundColor: '#6B7280',
      cursor: 'not-allowed'
    }
  },
  buttonIcon: {
    width: '1.25rem',
    height: '1.25rem'
  },
  privacySection: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#111827'
  },
  privacyToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  privacyLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#4B5563'
  },
  privacyButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s'
  },
  successMessage: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    borderRadius: '0.25rem',
    fontSize: '0.875rem'
  },
  errorMessage: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    borderRadius: '0.25rem',
    fontSize: '0.875rem'
  },
  requestsSection: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  requestItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.375rem'
  },
  requesterName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#111827'
  },
  requestButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  acceptButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#047857'
    }
  },
  rejectButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#DC2626',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#B91C1C'
    }
  },
  profilePicContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  profilePic: {
    width: '128px',
    height: '128px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #E5E7EB'
  },
  fileInput: {
    display: 'none'
  },
  uploadButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#4338CA'
    }
  },
  fieldContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  fieldLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: '0.5rem'
  },
  fieldValue: {
    fontSize: '1rem',
    color: '#111827'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #E5E7EB',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    ':focus': {
      outline: 'none',
      borderColor: '#4F46E5',
      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)'
    }
  },
  errorText: {
    color: '#DC2626',
    fontSize: '0.75rem',
    marginTop: '0.25rem'
  },
  saveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#047857'
    },
    ':disabled': {
      backgroundColor: '#6B7280',
      cursor: 'not-allowed'
    }
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#4338CA'
    },
    ':disabled': {
      backgroundColor: '#6B7280',
      cursor: 'not-allowed'
    }
  }
};



export default Profile;
