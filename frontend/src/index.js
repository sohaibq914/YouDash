import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GoalCreate from "./Pages/GoalCreate";
import GoalView from "./Pages/GoalView";
import Profile from "./components/Profile";
import navbar from "./Components/navbar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {
      /* <GoalCreate />
    <GoalView />

    */
      <App />
    }
  </React.StrictMode>
);
