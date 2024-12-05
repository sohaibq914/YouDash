console.log("Content script running");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`got to listener on content script`);

  if (request.action === "showBlockedPopup") {
    showBlockedPopup();
  }

  
  if (request.type === "GET_SESSION") {
    const authToken = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    const userId = localStorage.getItem("userId"); // If userId is stored too

    if (authToken && userId) {
      sendResponse({ authToken, userId });
    } else {
      sendResponse(null); // Return null if token or userId is missing
    }
  }
  return true; // Allow async responses
});


function showPopup() {
  // Create the popup container
  const popup = document.createElement("div");
  popup.classList.add("youdash-popup");

  // Inner HTML for the popup
  popup.innerHTML = `
    <div class="youdash-popup-header">
      <span>YouDash</span>
      <button class="close-btn">&times;</button>
    </div>
    <div class="youdash-popup-body">
      <p>This video category is blocked.</p>
    </div>
  `;

  // Append the popup to the body
  document.body.appendChild(popup);

  // Close button functionality
  const closeButton = popup.querySelector(".close-btn");
  closeButton.addEventListener("click", () => {
    popup.style.display = "none"; // Hide popup
  });
}

// Main function to show the popup and pause the video
function showBlockedPopup() {
  showPopup();

  const video = document.querySelector("video");
  if (video) {
    video.pause();

    // Re-add the event listener for playing the video
    video.addEventListener(
      "play",
      () => {
        const popup = document.querySelector(".youdash-popup");
        if (popup && popup.style.display === "none") {
          video.pause();
          showPopup();
        }
      },
      { once: true }
    ); // Use { once: true } to ensure the listener is added only once
  }
}


document.addEventListener("click", (e) => {
  if (e.target.matches("button#logout")) { // Adjust selector based on your site's DOM
    chrome.runtime.sendMessage({ action: "LOGOUT" });
  }
});

// Alternatively, listen for navigation to a logout route
if (window.location.pathname === "/logout") {
  chrome.runtime.sendMessage({ action: "LOGOUT" });
}

