import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PrivacySettings() {
  const { userID } = useParams();
  const [isPublic, setIsPublic] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
    fetchPendingRequests();
    fetchNotifications();
  }, [userID]);

  const fetchPrivacySettings = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userID}`);
      setIsPublic(response.data.publicAccount);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userID}/pending-requests`);
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userID}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handlePrivacyChange = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/users/${userID}/privacy?isPublic=${!isPublic}`);
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      await axios.post(`http://localhost:8080/api/users/${userID}/accept-follow/${requesterId}`);
      fetchPendingRequests();
      fetchNotifications();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDeclineRequest = async (requesterId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userID}/follow-request/${requesterId}`);
      fetchPendingRequests();
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2>Privacy Settings</h2>
        <div style={styles.privacyToggle}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={handlePrivacyChange}
              disabled={loading}
              style={styles.toggleInput}
            />
            <span style={styles.toggleText}>
              {isPublic ? 'Public Account' : 'Private Account'}
            </span>
          </label>
          <p style={styles.description}>
            {isPublic 
              ? 'Anyone can view your profile and follow you' 
              : 'Only approved followers can view your profile'}
          </p>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Follow Requests</h2>
        {pendingRequests.length === 0 ? (
          <p style={styles.emptyMessage}>No pending follow requests</p>
        ) : (
          <div style={styles.requestsList}>
            {pendingRequests.map(request => (
              <div key={request.id} style={styles.requestItem}>
                <div style={styles.requestInfo}>
                  <img 
                    src={request.profilePicture || "https://via.placeholder.com/40"} 
                    alt="" 
                    style={styles.requestAvatar}
                  />
                  <span style={styles.requestName}>{request.name}</span>
                </div>
                <div style={styles.requestActions}>
                  <button 
                    onClick={() => handleAcceptRequest(request.id)}
                    style={{...styles.actionButton, ...styles.acceptButton}}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleDeclineRequest(request.id)}
                    style={{...styles.actionButton, ...styles.declineButton}}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p style={styles.emptyMessage}>No new notifications</p>
        ) : (
          <div style={styles.notificationsList}>
            {notifications.map((notification, index) => (
              <div key={index} style={styles.notificationItem}>
                <span style={styles.notificationType}>
                  {notification.type === 'FOLLOW_REQUEST' && '🔔 New follow request'}
                  {notification.type === 'REQUEST_ACCEPTED' && '✅ Follow request accepted'}
                </span>
                <span style={styles.notificationTime}>
                  {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  privacyToggle: {
    marginTop: '15px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  toggleInput: {
    marginRight: '10px',
  },
  toggleText: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: '8px',
    color: '#666',
    fontSize: '14px',
  },
  requestsList: {
    marginTop: '15px',
  },
  requestItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  requestInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  requestAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '12px',
  },
  requestName: {
    fontWeight: 'bold',
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  declineButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  notificationsList: {
    marginTop: '15px',
  },
  notificationItem: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationType: {
    fontWeight: 'bold',
  },
  notificationTime: {
    color: '#666',
    fontSize: '14px',
  },
  emptyMessage: {
    color: '#666',
    textAlign: 'center',
    padding: '20px',
  },
};

export default PrivacySettings;