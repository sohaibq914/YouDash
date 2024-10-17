import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [aiRecommendations, setAIRecommendations] = useState("");
  const userId = 12345;
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    // Perform any logout operations here, like clearing tokens or user data
    // Example: localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  const handleAiRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/ai/${userId}/recommendations`,
        userId
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
      {/* AI Recommendations Widget */}
      <div className="ai-widget">
        <h2>AI Recommendations</h2>
        {loading ? (
          <p>Loading recommendations...</p> // Show loading text while fetching
        ) : aiRecommendations ? (
          <p>{aiRecommendations}</p> // Display the recommendations once fetched
        ) : (
          <p>
            No recommendations yet. Click the button to get recommendations.
          </p>
        )}

        {/* Button to trigger the AI recommendation request */}
        <button onClick={handleAiRequests}>Get AI Recommendations</button>
      </div>
    </div>
  );
}

export default Home;
