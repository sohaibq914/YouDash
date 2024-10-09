import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedPage from "./Pages/BlockedPages.tsx";
import GoalCreate from "./Pages/GoalCreate";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Navbar } from "./Components/Navbar.jsx";
import RouterPages from "./RouterPages.js";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/message")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="App" style={{ width: "100%", overflow: "hidden" }}>
        <div style={{ marginTop: "56px" }}>
          {" "}
          {/* Adjust this value based on your Navbar height */}
          <RouterPages />
        </div>
      </div>
    </>
  );
}

export default App;
