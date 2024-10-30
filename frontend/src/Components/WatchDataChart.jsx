import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./WatchTimeChart.css"; // Import the CSS file

function WatchTimeChart() {
  const { userId } = useParams();
  const [watchTimeData, setWatchTimeData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/block-categories/${userId}/availableCategories`
        );
        setAvailableCategories(response.data.availableCategories);
      } catch (error) {
        console.error("Error fetching available categories", error);
      }
    };
    fetchAvailableCategories();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const fetchWatchTimeData = async () => {
        try {
          const url = selectedCategory
            ? `http://localhost:8080/analytics/${userId}/watch-time-by-hour?category=${selectedCategory}`
            : `http://localhost:8080/analytics/${userId}/watch-time-by-hour`;

          const response = await axios.get(url);
          const formattedData = Object.keys(response.data).map(hour => ({
            hour,
            watchTime: response.data[hour]
          }));
          setWatchTimeData(formattedData);
        } catch (error) {
          console.error("Error fetching watch time data:", error);
        }
      };
      fetchWatchTimeData();
    }
  }, [userId, selectedCategory]);

  return (
    <div className="watch-time-chart-container"> {/* Apply CSS class for styling */}
      <h3>Watch Time Analysis</h3>
      <select 
        onChange={(e) => setSelectedCategory(e.target.value)} 
        value={selectedCategory} 
        className="category-select"  // Add class for styling
      >
        <option value="">All Categories</option>
        {availableCategories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={watchTimeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Watch Time (minutes)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="watchTime" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WatchTimeChart;
