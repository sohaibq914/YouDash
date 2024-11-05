import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./WatchTimeChart.css"; // Import the CSS file

function WatchTimeChart(props) {
  const userId = props.userId;
  const [goals, setGoals] = useState([]);
  const timeFrame = props.timeFrame;
  const timeFrameSelection = props.timeFrameSelection;
  const [watchTimeData, setWatchTimeData] = useState([]);


  useEffect(() => {
    if (userId) {
      const fetchWatchTimeData = async () => {
        try {
          const url = "http://localhost:8080/goals/" + userId + "/" + timeFrame + "/" + timeFrameSelection + "/bar"

          const response = await axios.get(url);
          const hourData = [];
            for (const [key, value] of Object.entries(response.data)) {
              hourData.push({goalName: key, progress: (value*100)});
            }
            //console.log(hourData);
            setWatchTimeData(hourData);
        } catch (error) {
          console.error("Error fetching watch time data:", error);
        }
      };
      fetchWatchTimeData();
    }
  }, [userId, timeFrameSelection, timeFrame]);

  return (
    <div className="watch-time-chart-container"> {/* Apply CSS class for styling */}
      <h3>Goal Progress Over Time Frame</h3>
      <ResponsiveContainer width="90%" height={400}>
        <BarChart data={watchTimeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="goalName" label={{ value: "Goal Name", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Progress %", angle: -90, position: "insideLeft" }} domain={[0, 100]}/>
          <Tooltip />
          <Bar dataKey="progress" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WatchTimeChart;
