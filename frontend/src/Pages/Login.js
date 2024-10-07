import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = { username, password };

    axios.post('http://localhost:8080/api/users/login', loginData)
      .then(response => {
        // If login is successful, you can store user data or redirect
        console.log('Login successful', response.data);
        setErrorMessage(''); // Clear error message on successful login
        // Add your logic here, like storing a token or redirecting the user
      })
      .catch(error => {
        // Handle error, display a message if login fails
        if (error.response && error.response.status === 401) {
          setErrorMessage('Invalid username or password.');
        } else {
          setErrorMessage('Something went wrong. Please try again later.');
        }
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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
      <p>Don't have an account? <a href="/signup">Sign up here</a></p>
    </div>
  );
}

export default Login;
