import React, { useState } from "react";
import "./Home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AIWidget from "../Components/AIWidget.tsx";

function Home() {
  const navigate = useNavigate();

  const [aiRecommendations, setAIRecommendations] = useState("");
  const userId = 12345;
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    // Perform any logout operations here, like clearing tokens or user data
    navigate("/login");
  };

  const handleAiRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/ai/${userId}/recommendations`
      );
      // store AI recommendations
      setAIRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching AI recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Home">
      <h1>Home page: In Progress</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* AI Widget to display recommendations */}
      <AIWidget
        handleAiRequests={handleAiRequests}
        aiRecommendations={aiRecommendations}
        loading={loading}
      />
    </div>
  );
}

export default Home;
