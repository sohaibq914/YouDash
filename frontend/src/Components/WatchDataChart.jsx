import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function WatchTimeChart() {
  const { userId } = useParams(); // Get userId from route params
  const [watchTimeData, setWatchTimeData] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchWatchTimeData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/analytics/${userId}/watch-time-by-hour`);
          console.log("Fetched Data:", response.data);

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
    } else {
      console.log("User ID is undefined");
    }
  }, [userId]);

  return (
    <div>
      <h3>Watch Time Analysis</h3>
      <ResponsiveContainer width="100%" height={400}>
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
