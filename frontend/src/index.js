import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GoalCreate from "./Pages/GoalCreate";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <GoalCreate />
  </React.StrictMode>
);
