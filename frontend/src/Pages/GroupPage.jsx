import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs"; // Use Client instead of 'over'
import SockJS from "sockjs-client";
import axios from "axios";

let stompClient = null; // Define stompClient outside the component

const GroupChat = () => {
  // Hard-code the groupId and userId
  const groupId = "d5f0a7e2-9c3f-4b9d-9c4b-8764f9a17b5d"; // Replace with your group ID
  const userId = 12345; // Replace with your user ID

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);

  // Connect to WebSocket when the component mounts
  useEffect(() => {
    // Fetch past messages from the backend
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/group-chat/groups/${groupId}/messages`
        );
        setMessages(response.data); // Set past messages in state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

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

  const sendMessage = () => {
    if (newMessage.trim() && stompClient) {
      const message = {
        userId: userId,
        groupId: groupId,
        messageText: newMessage,
        timestamp: new Date(),
      };
      stompClient.publish({
        destination: `/app/chat/${groupId}`,
        body: JSON.stringify({
          userId: userId,
          messageText: newMessage,
          timestamp: new Date(),
        }),
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    console.log("Messages array updated:", messages);
  }, [messages]);

  return (
    <div className="group-chat">
      <div className="message-display-area" style={{ padding: "10px" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // Space between user, text, and timestamp
              padding: "8px 0", // Space between each message
              borderBottom: "1px solid #ddd", // Optional: adds a subtle divider
            }}
          >
            <span style={{ fontWeight: "bold", marginRight: "5px" }}>
              {msg.userId === userId ? "You" : `User ${msg.userId}`}:
            </span>
            <span style={{ flex: 1 }}>{msg.messageText}</span>
            <span style={{ fontSize: "0.9em", color: "gray" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="message-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={!connected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;