import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const AiWidget = ({ handleAiRequests, aiRecommendations, loading }: any) => {
  const { userId } = useParams();  // Extract the userId from the URL in the main body
  const navigate = useNavigate();   // Create the navigate function in the main body

  const handleViewHistory = () => {
    // Navigate to the prompt history page, including the userId in the URL
    navigate(`/ai/${userId}/promptHistory`);
  };

  return (
    <div className="ai-widget">
      <h2>AI Recommendations</h2>
      {loading ? (
        <p>Loading recommendations...</p> // Show loading text while fetching
      ) : aiRecommendations ? (
        <p>{aiRecommendations}</p> // Display the recommendations once fetched
      ) : (
        <p>No recommendations yet. Click the button to get recommendations.</p>
      )}

      {/* Button to trigger the AI recommendation request */}
      <button onClick={handleAiRequests}>Get AI Recommendations</button>

      {/* Button to navigate to Prompt History */}
      <button onClick={handleViewHistory} style={{ marginTop: "10px" }}>
        View Past Recommendations
      </button>
    </div>
  );
};

export default AiWidget;
