import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AIWidget from "../Components/AIWidget.tsx";

function Home() {
  const navigate = useNavigate();
  const [aiRecommendations, setAIRecommendations] = useState("");
  const [userId, setUserId] = useState(null); // Fetch userId from session
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/session", { withCredentials: true });
        setUserId(response.data.userId); // Set userId from session
      } catch (error) {
        console.error("No active session:", error);
        navigate("/login"); // Redirect to login if no session
      }
    };
    fetchSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });
      setAIRecommendations("");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleAiRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/ai/${userId}/recommendations`
      );
      setAIRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching AI recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  if (userId === null) {
    return <div>Loading...</div>; // Show a loading state while fetching session
  }

  return (
    <div className="Home">
      <h1>Home page: User {userId}</h1>
      <button onClick={handleLogout}>Logout</button>
      <AIWidget
        handleAiRequests={handleAiRequests}
        aiRecommendations={aiRecommendations}
        loading={loading}
      />
    </div>
  );
}

export default Home;