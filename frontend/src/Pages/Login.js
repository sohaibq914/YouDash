import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password
      });
      navigate(`/${response.data.id}/home`);
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

   // Your login component code using the configured axios instance
   const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/users/google-login', {
        idToken: credentialResponse.credential
      });
      // Rest of your code
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to YouDash</h2>
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            style={{width: "25%"}}
            id="loginUsername"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button id="loginBtn" type="submit">Login</button>
      </form>

      <div className="divider">OR</div>

      <div className="google-login">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.error('Login Failed');
          }}
          useOneTap
        />
      </div>

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Login;