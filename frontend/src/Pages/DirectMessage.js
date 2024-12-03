import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { Loader2, MessageSquare, UserPlus, AlertCircle, Ban, Unlock, Wand2, Check, X, Edit } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DirectMessage = () => {
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

  // AI reformatting states
  const [isReformatting, setIsReformatting] = useState(false);
  const [reformattedMessage, setReformattedMessage] = useState("");
  const [isEditingReformatted, setIsEditingReformatted] = useState(false);

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

  const isUserBlocked = (userId) => {
    return currentUser?.blockedUsers?.includes(userId) || false;
  };

  const isBlockedByUser = (userId) => {
    const otherUser = userCache[userId];
    return otherUser?.blockedUsers?.includes(parseInt(currentUserId)) || false;
  };

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

  const handleBlock = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/users/${currentUserId}/block/${userId}`);

      // Update current user in state
      const updatedUser = await axios.get(`http://localhost:8080/api/users/${currentUserId}`);
      setCurrentUser(updatedUser.data);

      toast.success("User blocked successfully");

      // If currently chatting with blocked user, clear the chat
      if (selectedUser === userId) {
        setSelectedUser(null);
        setMessages([]);
      }
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/users/${currentUserId}/unblock/${userId}`);

      // Update current user in state
      const updatedUser = await axios.get(`http://localhost:8080/api/users/${currentUserId}`);
      setCurrentUser(updatedUser.data);

      toast.success("User unblocked successfully");
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  const handleReformat = async () => {
    if (!newMessage.trim()) return;

    setIsReformatting(true);
    try {
      const response = await axios.post("http://localhost:8080/ai/reformat-message", {
        message: newMessage,
      });

      setReformattedMessage(response.data);
      setIsEditingReformatted(false);
    } catch (error) {
      toast.error("Failed to reformat message");
      console.error("Reformatting error:", error);
    } finally {
      setIsReformatting(false);
    }
  };

  const applyReformattedMessage = () => {
    setNewMessage(reformattedMessage);
    setReformattedMessage("");
  };

  const cancelReformatting = () => {
    setReformattedMessage("");
    setIsEditingReformatted(false);
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

    if (isBlockedByUser(selectedUser)) {
      toast.error("You cannot send messages to this user as they have blocked you");
      return;
    }

    if (isUserBlocked(selectedUser)) {
      toast.error("You cannot send messages to users you have blocked");
      return;
    }

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

  const renderMessageInput = () => (
    <div className="dm border-t border-gray-200 p-4 bg-white w-full">
      {reformattedMessage && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-blue-700">AI Suggested Message:</span>
            <div className="flex gap-2 w-full">
              {!isEditingReformatted ? (
                <>
                  <button onClick={() => setIsEditingReformatted(true)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Edit suggestion">
                    <Edit size={16} />
                  </button>
                  <button onClick={applyReformattedMessage} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Apply suggestion">
                    <Check size={16} />
                  </button>
                  <button onClick={cancelReformatting} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Cancel">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditingReformatted(false);
                      applyReformattedMessage();
                    }}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                    title="Save edits"
                  >
                    <Check size={16} />
                  </button>
                  <button onClick={() => setIsEditingReformatted(false)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Cancel editing">
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
          {isEditingReformatted ? <textarea value={reformattedMessage} onChange={(e) => setReformattedMessage(e.target.value)} className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:border-blue-500" rows="3" /> : <p className="text-sm text-blue-800">{reformattedMessage}</p>}
        </div>
      )}

      <div className="flex gap-2">
        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder={isBlockedByUser(selectedUser) ? "You cannot send messages to this user as they have blocked you" : isUserBlocked(selectedUser) ? "You have blocked this user" : "Type a message..."} disabled={isUserBlocked(selectedUser) || isBlockedByUser(selectedUser)} className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" rows="2" />
        <div className="flex flex-col gap-2">
          <button onClick={handleReformat} disabled={!newMessage.trim() || isReformatting} className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" title="AI Reformat">
            {isReformatting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
          </button>
          <button onClick={sendMessage} disabled={!connected || !newMessage.trim() || isUserBlocked(selectedUser) || isBlockedByUser(selectedUser)} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  );

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
      {/* Sidebar */}
      <div className="w-[250px] min-w-[250px] border-r border-gray-200 bg-gray-50">
        <div className="p-4 dm">
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
              {conversations.map((userId, index) => (
                <div key={userId} className="p-3 rounded-lg transition-colors hover:bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div
                      className={`font-medium cursor-pointer ${selectedUser === userId ? "text-blue-700" : ""}`}
                      onClick={() => {
                        if (!isBlockedByUser(userId)) {
                          setSelectedUser(userId);
                          fetchMessages(userId);
                        }
                      }}
                    >
                      {userCache[userId]?.name || `Loading...`}
                      {isBlockedByUser(userId) && <span className="ml-2 text-xs text-red-500">(You are blocked)</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserBlocked(userId) ? (
                        <button onClick={() => handleUnblock(userId)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Unblock user">
                          <Unlock size={16} />
                        </button>
                      ) : (
                        <button onClick={() => handleBlock(userId)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Block user">
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="dm p-4 border-b border-gray-200 bg-white w-full">
              <div className="flex items-center justify-center">
                <h3 className="font-medium text-center">
                  Chat with {userCache[selectedUser]?.name || "Loading..."}
                  <div className="flex justify-center gap-2 mt-1">
                    {isBlockedByUser(selectedUser) && <span className="text-sm text-red-500">(This user has blocked you)</span>}
                    {isUserBlocked(selectedUser) && <span className="text-sm text-red-500">(You have blocked this user)</span>}
                  </div>
                </h3>
              </div>
            </div>

            {/* Messages Area */}
            <div className="dm flex-1 p-4 overflow-y-auto w-full">
              <div className=" mx-auto w-full">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-4 flex ${msg.senderId === parseInt(currentUserId) ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-lg ${msg.senderId === parseInt(currentUserId) ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
                      <div className="text-xs font-medium mb-1">{msg.senderId === parseInt(currentUserId) ? currentUser.name : userCache[msg.senderId]?.name || "Loading..."}</div>
                      <div className="text-sm">{msg.messageText}</div>
                      <div className="text-xs mt-1 opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input Area */}
            {/* Message Input Area */}
            <div className="dm border-t border-gray-200 bg-white w-full">
              <div className="px-4 py-4 w-full">
                {reformattedMessage && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg w-full">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-blue-700">AI Suggested Message:</span>
                      <div className="flex gap-2">
                        {!isEditingReformatted ? (
                          <>
                            <button onClick={() => setIsEditingReformatted(true)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Edit suggestion">
                              <Edit size={16} />
                            </button>
                            <button onClick={applyReformattedMessage} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Apply suggestion">
                              <Check size={16} />
                            </button>
                            <button onClick={cancelReformatting} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Cancel">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setIsEditingReformatted(false);
                                applyReformattedMessage();
                              }}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                              title="Save edits"
                            >
                              <Check size={16} />
                            </button>
                            <button onClick={() => setIsEditingReformatted(false)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Cancel editing">
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditingReformatted ? <textarea value={reformattedMessage} onChange={(e) => setReformattedMessage(e.target.value)} className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:border-blue-500" rows="3" /> : <p className="text-sm text-blue-800">{reformattedMessage}</p>}
                  </div>
                )}

                <div className="flex w-full items-center gap-2">
                  <div className="flex-grow">
                    <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder={isBlockedByUser(selectedUser) ? "You cannot send messages to this user as they have blocked you" : isUserBlocked(selectedUser) ? "You have blocked this user" : "Type a message..."} disabled={isUserBlocked(selectedUser) || isBlockedByUser(selectedUser)} className="w-full resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" rows="2" />
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={handleReformat} disabled={!newMessage.trim() || isReformatting} className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" title="AI Reformat">
                      {isReformatting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                    </button>
                    <button onClick={sendMessage} disabled={!connected || !newMessage.trim() || isUserBlocked(selectedUser) || isBlockedByUser(selectedUser)} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="dm text-center">
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
