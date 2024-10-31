import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./WatchTimeChart.css"; // Import the CSS file

function WatchTimeChartCustom(props) {
    const timeFrame = props.timeFrame;
    const timeFrameSelection = props.timeFrameSelection;
  const { userId } = props.userId;
  const [watchTimeData, setWatchTimeData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      try {
        console.log(props.userId);
        const response = await axios.get(
          `http://localhost:8080/block-categories/${props.userId}/availableCategories`
        );
        setAvailableCategories(response.data.availableCategories);
      } catch (error) {
        console.error("Error fetching available categories", error);
      }
    };
    //console.log("reloaded");
    fetchAvailableCategories();
  }, [userId, timeFrame, timeFrameSelection]);

  useEffect(() => {
    if (props.userId) {
      const fetchWatchTimeData = async () => {
        try {
          const url = selectedCategory
            ? `http://localhost:8080/analytics/${props.userId}/watch-time-by-hour-custom?category=${selectedCategory}&timeFrame=${timeFrame}&timeFrameSelection=${timeFrameSelection}`
            : `http://localhost:8080/analytics/${props.userId}/watch-time-by-hour-custom?timeFrame=${timeFrame}&timeFrameSelection=${timeFrameSelection}`;

          const response = await axios.get(url);
          const formattedData = Object.keys(response.data).map(hour => ({
            hour: response.data[hour],
            watchTime: response.data[hour]
          }));
          console.log(response.data)
          const hourData = [];
          let has0 = false;
          for (const [key, value] of Object.entries(response.data)) {
            if (parseInt(key) == 0) {
                has0 = true;
            }

          }
          if (!has0) {
            hourData.push({hour: 0, watchTime: 0});
          }
          let has23 = false;
          for (const [key, value] of Object.entries(response.data)) {
            hourData.push({hour: parseInt(key), watchTime: value});
            if (parseInt(key) == 23) {
                has23 = true;
            }
          }
          if (!has23) {
              hourData.push({hour: 23, watchTime: 0});
            }
          console.log(hourData);
          setWatchTimeData(hourData);
        } catch (error) {
          console.error("Error fetching watch time data:", error);
        }
      };
      fetchWatchTimeData();
      console.log(watchTimeData);
    }
  }, [userId, selectedCategory, timeFrame, timeFrameSelection]);

    function formatXAxis(value: hour) {
      return +hour;
    }

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

export default WatchTimeChartCustom;
