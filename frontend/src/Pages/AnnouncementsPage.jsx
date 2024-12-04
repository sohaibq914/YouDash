import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "react-notifications-component";

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const { userId, groupId } = useParams();

  useEffect(() => {
    fetchAnnouncements();
    checkManagerStatus();
  }, []);

  const fetchAnnouncements = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8080/groups/announcements/${groupId}`
        );
        setAnnouncements(response.data);
    } catch (error) {
        console.error(error);
    }
};

  const checkManagerStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/groups/${userId}/view`);
      const group = response.data.find(g => g.groupId === groupId);
      setIsManager(group?.managers.includes(Number(userId)));
    } catch (error) {
      console.error(error);
    }
  };

  const postAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/groups/${userId}/announcement/${groupId}`, {
        title: newTitle,
        message: newMessage
      });
      setNewTitle("");
      setNewMessage("");
      fetchAnnouncements();
      Store.addNotification({
        title: "Success",
        message: "Announcement posted successfully",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: { duration: 5000, onScreen: true }
      });
    } catch (error) {
      Store.addNotification({
        title: "Error",
        message: "Failed to post announcement",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: { duration: 5000, onScreen: true }
      });
    }
  };

  const deleteAnnouncement = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/groups/${groupId}/announcements/${index}`, {
        params: { userId }
      });
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (announcement, index) => {
    setEditingIndex(index);
    setEditTitle(announcement.title);
    setEditMessage(announcement.message);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditTitle("");
    setEditMessage("");
  };

  const updateAnnouncement = async (index) => {
    try {
      await axios.put(`http://localhost:8080/groups/${userId}/announcement/${groupId}/${index}`, {
        title: editTitle,
        message: editMessage
      });
      setEditingIndex(null);
      fetchAnnouncements();
      Store.addNotification({
        title: "Success",
        message: "Announcement updated successfully",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: { duration: 5000, onScreen: true }
      });
    } catch (error) {
      Store.addNotification({
        title: "Error",
        message: "Failed to update announcement",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: { duration: 5000, onScreen: true }
      });
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Group Announcements</h2>

      {isManager && (
        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>Post New Announcement</h3>
          <form onSubmit={postAnnouncement}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Announcement Title"
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
              required
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Announcement Message"
              style={{ width: "100%", marginBottom: "10px", padding: "8px", minHeight: "100px" }}
              required
            />
            <button
              type="submit"
              style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
            >
              Post Announcement
            </button>
          </form>
        </div>
      )}

      <div>
        {announcements.map((announcement, index) => (
          <div key={index} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: "60%", padding: "4px" }}
                  />
                  {isManager && (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => updateAnnouncement(index)}
                        style={{ padding: "4px 8px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(index)}
                        style={{ padding: "4px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h4 style={{ margin: 0 }}>{announcement.title}</h4>
                  {isManager && (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => startEdit(announcement, index)}
                        style={{ padding: "4px 8px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(index)}
                        style={{ padding: "4px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            {editingIndex === index ? (
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "8px", minHeight: "100px" }}
              />
            ) : (
              <p style={{ margin: 0 }}>{announcement.message}</p>
            )}
            <small style={{ color: "#666" }}>
              Posted on: {new Date(announcement.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementsPage;