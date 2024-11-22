import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter from react-router-dom
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "react-hot-toast"; 


const root = ReactDOM.createRoot(document.getElementById("root"));
const GOOGLE_CLIENT_ID = "682668393207-okhgksrvqn1ulvc9rlspeuose1opaimq.apps.googleusercontent.com";
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
