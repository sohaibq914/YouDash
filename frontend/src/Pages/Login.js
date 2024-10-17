import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const handleSignup = (e) => {
        navigate("/signup");
    }

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = { username, password };

    axios.post('http://localhost:8080/api/users/login', loginData)
      .then(response => {
        // Handle successful login
        console.log('Login successful', response.data);
        navigate("/" + response.data.id + "/home");
        window.location.reload();
      })
      .catch(error => {
        // Handle login error
        console.error('Login failed', error);

      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <br/>

      <button onClick={handleSignup}>Sign Up</button>

    </div>
  );
}

export default Login;