import React, { useState, useEffect } from "react";
import "./DeleteCategoriesButton.css";
import { DeleteCategoriesButton } from "./DeleteCategoriesButton.tsx";

const ChromeExtension = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]); // To track available categories
  const [loginMessage, setLoginMessage] = useState("");

  // Check session on mount
  useEffect(() => {
    chrome.storage.local.get(["authToken", "userId"], (data) => {
      if (data.authToken && data.userId) {
        console.log("Found session data in local storage:", data);
        setIsLoggedIn(true);
        fetchBlockedCategories(data.userId, data.authToken);
      } else {
        console.log("No session data found, sending message to content script");
        sendMessageToContentScript();
      }
    });
  }, []);

  // Send a message to the content script to retrieve session data
  const sendMessageToContentScript = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "GET_SESSION" },
          (response) => {
            if (response && response.authToken && response.userId) {
              console.log(
                "Received session data from content script:",
                response
              );
              const { authToken, userId } = response;

              chrome.storage.local.set({ authToken, userId }, () => {
                console.log("Session data saved in local storage.");
              });

              setIsLoggedIn(true);
              fetchBlockedCategories(userId, authToken);
            } else {
              console.error("Failed to retrieve session from content script.");
              setLoginMessage("Please log in on the main website.");
            }
          }
        );
      }
    });
  };

  // Fetch blocked categories using the userId and authToken
  const fetchBlockedCategories = async (userId: string, authToken: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/block-categories/${userId}/blockedCategories`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include", // Include cookies if necessary
        }
      );

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        if (data.blockedCategories && Array.isArray(data.blockedCategories)) {
          setBlockedCategories(data.blockedCategories);
        } else {
          console.error(
            "Expected blockedCategories to be an array, but got:",
            data.blockedCategories
          );
          setBlockedCategories([]); // Fallback to an empty array
        }
      } else {
        console.error(
          "Failed to fetch blocked categories. Status:",
          response.status
        );
        setLoginMessage("Failed to fetch blocked categories.");
      }
    } catch (error) {
      console.error("Error fetching blocked categories:", error);
      setLoginMessage("An error occurred while fetching blocked categories.");
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    // Remove the category from blocked categories
    const updatedBlockedCategories = blockedCategories.filter(
      (blockedCategory) => blockedCategory !== categoryName
    );

    // Add the deleted category back to available categories
    setAvailableCategories([...availableCategories, categoryName]);

    // Update blocked categories
    setBlockedCategories(updatedBlockedCategories);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <ul className="category-list">
            {blockedCategories.map((category, index) => (
              <li className="category-item" key={index}>
                <span>{category}</span>
                <DeleteCategoriesButton
                  categoryName={category}
                  onDeleteCategory={handleDeleteCategory}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>YouDash</h1>
          <p>{loginMessage || "Checking session..."}</p>
        </div>
      )}
    </div>
  );
};

export default ChromeExtension;
