import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface PromptHistory {
  timestamp: string;
  response: string;
}

const PromptHistory = () => {
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  //const userId = 12345;
  const { userId } = useParams<{ userId: string }>(); 

  useEffect(() => {
    // fetch prompt history from backend
    const fetchPromptHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/ai/${userId}/prompt-history`
        );
        setPromptHistory(response.data);
      } catch (error) {
        console.error("error fetching prompt history", error);
      }
    };
    fetchPromptHistory();
  }, []);

  return (
    <div>
      <h1>AI Prompt History</h1>
      <ul>
        {promptHistory.map((prompt, index) => (
          <li key={index}>
            <strong>{prompt.timestamp}:</strong> {prompt.response}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptHistory;
