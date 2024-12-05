import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter from react-router-dom
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
const GOOGLE_CLIENT_ID =
  "682668393207-okhgksrvqn1ulvc9rlspeuose1opaimq.apps.googleusercontent.com";

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        {/* Add the ToastContainer here */}
        <ToastContainer
          position="top-right"
          autoClose={3000} // Automatically close the toast after 3 seconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // Change to "dark" if you prefer dark theme
        />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
