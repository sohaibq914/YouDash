import React, { useState, useEffect, FormEvent } from "react";

const ChromeExtension = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Check session on mount
  useEffect(() => {
    chrome.storage.local.get(["session", "userId"], async (data) => {
      if (data.session && data.userId) {
        setIsLoggedIn(true);
        fetchBlockedCategories(data.userId);
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookies
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.json();
        chrome.storage.local.set({ session: true, userId: result.userId });
        setIsLoggedIn(true);
        fetchBlockedCategories(result.userId);
      } else {
        setLoginMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("An error occurred during login.");
    }
  };

  const fetchBlockedCategories = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/block-categories/${userId}/availableCategories`,
        { credentials: "include" }
      );

      if (response.ok) {
        const categories = await response.json();
        setBlockedCategories(categories);
      } else {
        console.error("Failed to fetch blocked categories.");
      }
    } catch (error) {
      console.error("Error fetching blocked categories:", error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Blocked Categories</h1>
          <ul>
            {blockedCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Login to YouDash</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>{loginMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ChromeExtension;