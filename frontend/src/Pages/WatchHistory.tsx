import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import axios from "axios";

interface ListChildComponentProps<T = any> {
  index: number;
  style: React.CSSProperties;
  data: T[];
  isScrolling?: boolean;
  key?: string | number;
}

function WatchHistory() {
  const [watchHistoryList, setWatchHistoryList] = useState<string[]>([]); // Initialized to empty array

  useEffect(() => {

    const getUser = () => {
            let theUrl = window.location.href;
            console.log(theUrl);
            if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
                return null;
            }
            console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
            return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));

        }
    const userID = getUser();

    const fetchWatchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/watch-history/${userID}/historyList`);
        setWatchHistoryList(response.data.watchHistory);
        // If fetching the watch history is successful, show an alert
        //alert("Watch history loaded successfully!");
      } catch (error) {
        console.error("Error fetching watch history", error);
        // If there is an error, show an alert indicating the failure
        //alert("Failed to load watch history.");
      }
    };

    fetchWatchHistory();
  }, []);

  // Ensure that watchHistoryList is properly initialized and contains valid data
  if (!watchHistoryList || watchHistoryList.length === 0) {
    return <div style={{textAlign: "center"}}>You have no watch history. Watch some videos!</div>; // Show a loading message until data is fetched
  }

  console.log(watchHistoryList);

  // Render each row with the corresponding history URL
  function renderRow({ index, style }: { index: number; style: React.CSSProperties }) {
    return (
      <ListItem style={style} key={index} component="div"  id="watchHistory-list" sx={{ mb: 2 }}>
        <ListItemButton>
          <a href={watchHistoryList[index]} target="_blank" style={{color: "white"}}><ListItemText primary={watchHistoryList[index]} /></a>
        </ListItemButton>
      </ListItem>
    );
  }

  // Ensure that height and itemSize are valid numbers
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto", // Full viewport height to center vertically
        display: "flex",
        flexDirection: "column", // Align children in column (h1 above list)
        alignItems: "center", // Center horizontally
        justifyContent: "center", // Center vertically
        bgcolor: "background.black",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Watch History</h1> {/* Margin to create space below heading */}
      <Box
        sx={{
          backgroundColor: "#787878", // Background color for the list
          padding: "10px", // Optional padding
          borderRadius: "8px", // Optional border radius for rounded corners
          height: "520px",
        }}
      >
        <FixedSizeList
          height={500}
          width={700}
          itemSize={50}
          overscanCount={5}
          itemCount={200}
          style={{ backgroundColor: "#787878", color: "white" }} // Background for the list
        >
          {renderRow}
        </FixedSizeList>
      </Box>
    </Box>
  );
}

export default WatchHistory;
