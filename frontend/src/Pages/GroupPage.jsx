import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs"; // Use Client instead of 'over'
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "@fortawesome/fontawesome-free/css/all.min.css";

let stompClient = null;

const GroupChat = () => {
  const { userId, groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});

  // Create a ref for the message container
  const messageEndRef = useRef(null);

  // Helper function to check for a valid YouTube URL
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Utility function to detect and validate timestamps in (hh:mm:ss) format
  function extractTimestamp(text) {
    const timestampPattern = /\b(\d{1,2}):(\d{2}):(\d{2})\b/;
    const match = text.match(timestampPattern);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      return hours * 3600 + minutes * 60 + seconds; // Convert to seconds
    }
    return null;
  }

  // Function to fetch user profile and add to state
  const fetchUserProfile = async (userId) => {
    if (userProfiles[userId]) return; // Skip if profile is already cached

    try {
      const response = await axios.get(
        `http://localhost:8080/profile/${userId}`
      );
      const userData = response.data;
      const profile = {
        name: userData.name || "",
        profilePicture: `https://profilepicture12.s3.us-east-2.amazonaws.com/${userData.profilePictureKey}`,
      };

      setUserProfiles((prevProfiles) => ({
        ...prevProfiles,
        [userId]: profile,
      }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch past messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/group-chat/groups/${groupId}/messages`
      );
      setMessages(response.data); // Set past messages in state
      // Fetch profiles for all users in the messages
      response.data.forEach((msg) => fetchUserProfile(msg.userId));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Connect to WebSocket when the component mounts
  useEffect(() => {
    fetchMessages();
    // Create a new Stomp Client
    stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"), // SockJS client
      onConnect: onConnected,
      onStompError: onError,
    });

    stompClient.activate(); // Connect the client

    return () => {
      if (stompClient) {
        stompClient.deactivate(); // Clean up when component unmounts
      }
    };
  }, []);

  const onConnected = () => {
    setConnected(true);
    console.log("Connected to WebSocket");

    // Subscribe to the group chat topic
    stompClient.subscribe(`/topic/group/${groupId}`, onMessageReceived);
  };

  const onError = (error) => {
    console.error("WebSocket connection error:", error);
  };

  const onMessageReceived = (payload) => {
    console.log("Received message payload:", payload);
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleVote = async (messageId, voteType) => {
    try {
      await axios.post(
        `http://localhost:8080/group-chat/groups/${groupId}/messages/${messageId}/vote`,
        null, // No request body is needed in this case
        {
          params: {
            userId, // This adds userId as a query parameter
            voteType, // Add voteType as well if the backend expects it as a query parameter
          },
        }
      );
      await fetchMessages();
    } catch (error) {
      console.error("Error voting on message:", error);
    }
  };

  const sendMessage = () => {
    const timestamp = new Date().toISOString();
    const messageId = uuidv4(); // Generates a universally unique identifier

    const messageParts = newMessage.trim().split(" ");
    const urlPart = messageParts[0];
    const timestampPart = messageParts[1];

    const isYouTube = isValidYouTubeUrl(urlPart);
    const videoTimestamp = isYouTube ? extractTimestamp(timestampPart) : null;
    const isValidTimestamp = /^\d{2}:\d{2}:\d{2}$/.test(timestampPart);

    if (!isYouTube) {
      alert("Invalid YouTube link. Please check the URL format.");
      return;
    }

    if (timestampPart && !isValidTimestamp) {
      alert("Invalid timestamp format. Please use hh:mm:ss.");
      return;
    }

    if (newMessage.trim() && stompClient) {
      const message = {
        messageId: messageId, // Add the messageId here
        userId: userId,
        groupId: groupId,
        messageText: newMessage,
        timeStamp: timestamp,
        isYouTube: isYouTube,
        videoTimestamp: videoTimestamp,
      };

      console.log("Sending message:", message);
      stompClient.publish({
        destination: `/app/chat/${groupId}`,
        body: JSON.stringify(message), // Now sends the full message with messageId
      });

      setNewMessage("");
    }
  };

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => {
          const profile = userProfiles[msg.userId] || {};
          const isYouTube = isValidYouTubeUrl(msg.messageText);
          const videoId = isYouTube
            ? msg.messageText.split("v=")[1]?.split("&")[0]
            : null;
          const videoUrlWithTimestamp =
            videoId && msg.videoTimestamp
              ? `https://www.youtube.com/embed/${videoId}?start=${msg.videoTimestamp}`
              : `https://www.youtube.com/embed/${videoId}`;
          const timestampSeconds = extractTimestamp(msg.messageText);
          const upvotes = Object.values(msg.userVotes || {}).filter(
            (v) => v === "upvote"
          ).length;
          const downvotes = Object.values(msg.userVotes || {}).filter(
            (v) => v === "downvote"
          ).length;
          const netVotes = upvotes - downvotes;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <img
                src={profile.profilePicture || "default-profile-picture.png"}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                    {msg.userId === userId
                      ? "You"
                      : profile.name || `User ${msg.userId}`}
                    :
                  </span>

                  {/* Render the message text or the embedded video iframe */}
                  {isYouTube && videoId ? (
                    <iframe
                      width="400"
                      height="225"
                      src={videoUrlWithTimestamp}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ marginTop: "8px" }}
                    ></iframe>
                  ) : (
                    <span>{msg.messageText}</span>
                  )}

                  {/* Clickable timestamp if exists */}
                  {timestampSeconds !== null && (
                    <span
                      onClick={() =>
                        window.open(
                          `https://www.youtube.com/watch?v=${videoId}&t=${timestampSeconds}s`,
                          "_blank"
                        )
                      }
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        marginLeft: "8px",
                      }}
                    >
                      (Jump to{" "}
                      {msg.messageText.match(/\b(\d{1,2}:\d{2}:\d{2})\b/)[0]})
                    </span>
                  )}
                </div>

                {/* Upvote/Downvote arrows with vote counter */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                    gap: "5px",
                  }}
                >
                  <button
                    onClick={() => handleVote(msg.messageId, "upvote")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "blue",
                      fontSize: "18px",
                      padding: 0,
                    }}
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <button
                    onClick={() => handleVote(msg.messageId, "downvote")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "blue",
                      fontSize: "18px",
                      padding: 0,
                    }}
                  >
                    <i className="fas fa-arrow-down"></i>
                  </button>
                  <span style={{ fontSize: "1em", marginLeft: "5px" }}>
                    {netVotes}
                  </span>
                </div>
              </div>
              <span
                style={{ fontSize: "0.9em", color: "gray", marginLeft: "10px" }}
              >
                {msg.timeStamp}
              </span>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px",
          backgroundColor: "white",
          borderTop: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, marginRight: "10px" }}
        />
        <button onClick={sendMessage} disabled={!connected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
