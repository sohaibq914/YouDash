import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";

interface PromptHistory {
  timestamp: string;
  response: string;
}

const PromptHistory = () => {
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchPromptHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ai/${userId}/prompt-history`);
        setPromptHistory(response.data);
      } catch (error) {
        console.error("Error fetching prompt history", error);
      }
    };
    fetchPromptHistory();
  }, [userId]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <div className="flex items-center space-x-2">
            {/* <MessageCircle className="w-6 h-6" /> */}
            <h1 className="history text-2xl font-bold p-5">AI Prompt History</h1>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-auto p-4">
          {promptHistory.length > 0 ? (
            <ul className="space-y-4 list-none">
              {promptHistory.map((prompt, index) => (
                <li key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg hover:bg-gray-100 transition duration-200">
                  <div className="flex flex-col space-y-2">
                    <span className="history text-sm text-gray-500 font-medium">{formatDate(prompt.timestamp)}</span>
                    <p className="history text-gray-700 leading-relaxed">{prompt.response}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">No prompt history available</p>
            </div>
          )}
        </div>

        {/* Scrollbar Styling */}
        <style jsx>{`
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: #a0aec0 #edf2f7;
          }
          .overflow-y-auto::-webkit-scrollbar {
            width: 8px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: #edf2f7;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: #a0aec0;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PromptHistory;
