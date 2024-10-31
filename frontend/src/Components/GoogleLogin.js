import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  // Define the callback function
  const handleLoginSuccess = async (response) => {
    console.log("Login Success:", response);

    try {
      const result = await axios.post(
        "http://localhost:8080/auth/google-login",
        { tokenId: response.credential } // Include tokenId in the request body
      );
      console.log("Login Successful:", result.data);

      const userId = result.data.id;
      console.log(userId);
      // Redirect to main page
      navigate(`/${userId}/home`); 
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    // Attach handleLoginSuccess to the window as handleCredentialResponse for Google to use as a callback
    window.handleCredentialResponse = handleLoginSuccess;

    // Clean up the global variable on unmount
    return () => {
      delete window.handleCredentialResponse;
    };
  }, []);

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="682668393207-okhgksrvqn1ulvc9rlspeuose1opaimq.apps.googleusercontent.com"
        data-login_uri="http://localhost:8080/auth/google-login"
        data-auto_prompt="false"
        data-callback="handleCredentialResponse"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};

export default GoogleLoginButton;
