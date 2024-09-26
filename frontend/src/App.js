import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedPage from "./Pages/BlockedPages.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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
    <Router>
      <div className="App">
        <h1>Message from Spring Boot:</h1>

        {/* Routes holds each page */}
        <Routes>
          <Route path="/block-categories" element={<BlockedPage />} />
        </Routes>

        <p>{message}</p>
      </div>
    </Router>
  );
}

export default App;
