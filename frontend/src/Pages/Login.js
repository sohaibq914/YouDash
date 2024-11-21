import React, { useState, useEffect} from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import GoogleLoginButton from "../Components/GoogleLogin";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = () => {
    console.log("hello")
    navigate("/signup");
  };

  useEffect(() => {
    console.log("location is ");
    if (location.pathname === "/signup") {
      return;
    }
    // Check session validity

    axios
      .get("http://localhost:8080/api/users/session", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          // If session is valid, redirect to user's home page
          navigate(`/${response.data.userId}/home`);
        }
      })
      .catch(() => {
        // If session is invalid, stay on the login page
        console.log("No active session, user needs to log in.");
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password });
    try {
        const response = await axios.post(
            "http://localhost:8080/auth/login",
            { username, password },
            { withCredentials: true }
        );
        console.log("Response data:", response.data);
        const userId = response.data.userId;
        navigate(`/${userId}/home`);
        window.location.reload();
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please check your credentials.");
    }
};

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login to YouDash</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              id="loginUsername"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button id="loginBtn" type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>

        <div style={styles.divider}>OR</div>

        <div style={styles.googleLogin}>
          <GoogleLoginButton />
        </div>

        <button onClick={handleSignup} style={styles.signupButton}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  loginBox: {
    width: "500px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  loginButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  },
  loginButtonHover: {
    backgroundColor: "#45a049",
  },
  divider: {
    margin: "20px 0",
    fontSize: "14px",
    color: "#aaa",
    textTransform: "uppercase",
  },
  googleLogin: {
    marginBottom: "20px",
  },
  signupButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;
