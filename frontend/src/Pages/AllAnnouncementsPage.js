import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Store } from "react-notifications-component";

function AllAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupCounts, setGroupCounts] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  const fetchAllAnnouncements = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/groups/${userId}/all-announcements`
      );
      const data = response.data;
      setAnnouncements(data);
      setFilteredAnnouncements(data);

      // Calculate announcement counts per group
      const counts = data.reduce((acc, curr) => {
        acc[curr.groupName] = (acc[curr.groupName] || 0) + 1;
        return acc;
      }, {});
      setGroupCounts(counts);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      Store.addNotification({
        title: "Error",
        message: "Failed to fetch announcements",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: { duration: 5000, onScreen: true },
      });
    }
  };

  useEffect(() => {
    const filtered = announcements.filter(announcement =>
      announcement.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnnouncements(filtered);
  }, [searchTerm, announcements]);

  return (
    <div className="container" style={{ maxWidth: "1200px", margin: "auto", padding: "40px 20px" }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "40px",
        fontSize: "2.5rem",
        color: "#2c3e50",
        fontWeight: "600"
      }}>
        All Group Announcements
      </h1>

      {/* Search Bar */}
      <div style={{ 
        marginBottom: "30px",
        maxWidth: "600px",
        margin: "0 auto 30px"
      }}>
        <input
          type="text"
          placeholder="Search by group name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: "30px",
            border: "2px solid #e0e0e0",
            fontSize: "16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            outline: "none"
          }}
        />
      </div>

      {/* Group Counts */}
      <div style={{ 
        marginBottom: "30px",
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "center"
      }}>
        {Object.entries(groupCounts).map(([groupName, count]) => (
          <div
            key={groupName}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "25px",
              fontSize: "15px",
              border: "1px solid #e9ecef",
              color: "#495057",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
          >
            <span style={{ fontWeight: "600" }}>{groupName}:</span> {count} announcements
          </div>
        ))}
      </div>

      {/* Horizontal Scrolling Announcements */}
      <div style={{ 
        overflowX: "auto", 
        whiteSpace: "nowrap",
        padding: "20px 0",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "-ms-autohiding-scrollbar"
      }}>
        <div style={{ 
          display: "inline-flex", 
          gap: "20px", 
          paddingBottom: "20px" // Space for scrollbar
        }}>
          {filteredAnnouncements.map((announcement, index) => (
            <div
              key={index}
              style={{
                minWidth: "400px", // Fixed width for each card
                maxWidth: "400px",
                padding: "25px",
                borderRadius: "15px",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                display: "inline-block",
                verticalAlign: "top",
                whiteSpace: "normal", // Allow text to wrap inside cards
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
            >
              <div
                style={{
                  backgroundColor: "#4285f4",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  display: "inline-block",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.5px"
                }}
              >
                {announcement.groupName}
              </div>
              <h4 style={{ 
                margin: "0 0 15px 0", 
                fontSize: "22px",
                fontWeight: "600",
                color: "#1a1a1a",
                lineHeight: "1.3"
              }}>
                {announcement.title}
              </h4>
              <p style={{ 
                margin: "0 0 20px 0", 
                fontSize: "16px",
                color: "#4a4a4a",
                lineHeight: "1.6",
                height: "100px", // Fixed height for message
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {announcement.message}
              </p>
              <div style={{ 
                color: "#666",
                fontSize: "14px",
                borderTop: "1px solid #eee",
                paddingTop: "15px"
              }}>
                Posted on: {new Date(announcement.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
        
      {filteredAnnouncements.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          color: "#666", 
          marginTop: "60px",
          padding: "40px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          fontSize: "18px"
        }}>
          No announcements found
        </div>
      )}
    </div>
  );
}

export default AllAnnouncementsPage;