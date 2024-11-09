import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { Loader2, MessageSquare, UserPlus, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DirectMessage = () => {
  // Get currentUserId from URL parameters
  const { currentUserId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startNewChat, setStartNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [userCache, setUserCache] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  // Validate currentUserId on component mount
  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${currentUserId}`);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Invalid user ID:", error);
        navigate("/");
        toast.error("Invalid user ID");
      }
    };

    if (currentUserId) {
      validateUser();
    }
  }, [currentUserId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
      connectWebSocket();
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [currentUserId]);

  useEffect(() => {
    const loadUserDetails = async () => {
      for (const userId of conversations) {
        if (!userCache[userId]) {
          try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
            setUserCache((prev) => ({ ...prev, [userId]: response.data }));
          } catch (error) {
            console.error(`Error loading user ${userId}:`, error);
          }
        }
      }
    };

    loadUserDetails();
  }, [conversations]);

  const connectWebSocket = () => {
    try {
      const socket = new SockJS("http://localhost:8080/ws");
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        onConnect: onConnected,
        onStompError: onError,
      });
      stompClient.current.activate();
    } catch (error) {
      setError("Failed to connect to chat server");
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/direct-messages/conversations/${currentUserId}`);
      setConversations(response.data);
    } catch (error) {
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserByName = async (name) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users`);
      const users = response.data;
      const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
      return user || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const onConnected = () => {
    setConnected(true);
    stompClient.current.subscribe(`/topic/dm/${currentUserId}`, onMessageReceived);
  };

  const onError = (error) => {
    setConnected(false);
    setError("Connection error. Messages may not be delivered in real-time.");
  };

  const onMessageReceived = (payload) => {
    try {
      const message = JSON.parse(payload.body);
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some((m) => m.messageText === message.messageText && m.senderId === message.senderId && m.receiverId === message.receiverId);
        if (!isDuplicate) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });

      scrollToBottom();

      if (!conversations.includes(message.senderId) && message.senderId !== parseInt(currentUserId)) {
        setConversations((prev) => [...prev, message.senderId]);
      }

      if (!userCache[message.senderId]) {
        fetchUserDetails(message.senderId);
      }
    } catch (error) {
      console.error("Error processing received message:", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      setUserCache((prev) => ({ ...prev, [userId]: response.data }));
    } catch (error) {
      console.error(`Error fetching user details for ${userId}:`, error);
    }
  };

  const fetchMessages = async (targetUserId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/direct-messages/history/${currentUserId}/${targetUserId}`);
      setMessages(response.data || []);
      scrollToBottom();
    } catch (error) {
      setError("Failed to load message history");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async () => {
    if (!newChatName.trim()) return;

    try {
      const user = await fetchUserByName(newChatName.trim());

      if (!user) {
        setError("User does not exist");
        toast.error("User does not exist");
        return;
      }

      if (user.id === parseInt(currentUserId)) {
        setError("You cannot start a conversation with yourself");
        toast.error("You cannot start a conversation with yourself");
        return;
      }

      setSelectedUser(user.id);
      setUserCache((prev) => ({ ...prev, [user.id]: user }));
      setMessages([]);
      setStartNewChat(false);
      setNewChatName("");

      if (!conversations.includes(user.id)) {
        setConversations((prev) => [...prev, user.id]);
      }

      fetchMessages(user.id);
    } catch (error) {
      setError("Failed to start conversation");
      toast.error("Failed to start conversation");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !stompClient.current || !selectedUser) return;

    try {
      const message = {
        senderId: parseInt(currentUserId),
        receiverId: selectedUser,
        messageText: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, message]);

      stompClient.current.publish({
        destination: `/app/dm/${currentUserId}`,
        body: JSON.stringify(message),
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      setError("Failed to send message");
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Validating user...</span>
      </div>
    );
  }

  if (loading && !selectedUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading conversations...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Conversations sidebar */}
      <div className="w-1/4 border-r border-gray-200 bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Conversations</h2>
            <button onClick={() => setStartNewChat(true)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full" title="Start new conversation">
              <UserPlus size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          {startNewChat && (
            <div className="mb-4">
              <input type="text" value={newChatName} onChange={(e) => setNewChatName(e.target.value)} placeholder="Enter user's name" className="w-full p-2 border rounded-lg mb-2" />
              <div className="flex gap-2">
                <button onClick={startNewConversation} className="flex-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                  Start Chat
                </button>
                <button
                  onClick={() => {
                    setStartNewChat(false);
                    setNewChatName("");
                    setError(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No conversations yet</p>
              <button onClick={() => setStartNewChat(true)} className="mt-2 text-blue-500 hover:text-blue-600">
                Start a new conversation
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((userId) => (
                <div
                  key={userId}
                  className={`p-3 cursor-pointer rounded-lg transition-colors ${selectedUser === userId ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => {
                    setSelectedUser(userId);
                    fetchMessages(userId);
                  }}
                >
                  <div className="font-medium">{userCache[userId]?.name || `Loading...`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-medium">Chat with {userCache[selectedUser]?.name || "Loading..."}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-4 flex ${msg.senderId === parseInt(currentUserId) ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg max-w-[70%] ${msg.senderId === parseInt(currentUserId) ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
                    <div className="text-xs font-medium mb-1">{msg.senderId === parseInt(currentUserId) ? currentUser.name : userCache[msg.senderId]?.name || "Loading..."}</div>
                    <div className="text-sm">{msg.messageText}</div>
                    <div className="text-xs mt-1 opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500" rows="2" />
                <button onClick={sendMessage} disabled={!connected || !newMessage.trim()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>Select a conversation to start messaging</p>
              <button onClick={() => setStartNewChat(true)} className="mt-2 text-blue-500 hover:text-blue-600">
                or start a new conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessage;
