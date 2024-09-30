import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import Navbar from "./components/navbar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {
      /* <GoalCreate />
    <GoalView />
    
    */
      <Navbar />
    }
  </React.StrictMode>
);
