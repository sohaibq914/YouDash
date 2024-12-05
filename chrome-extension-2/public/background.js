const categoryMap = {
  1: "Film & Animation",
  2: "Autos & Vehicles",
  10: "Music",
  15: "Pets & Animals",
  17: "Sports",
  19: "Travel & Events",
  20: "Gaming",
  22: "People & Blogs",
  23: "Comedy",
  24: "Entertainment",
  25: "News & Politics",
  26: "Howto & Style",
  27: "Education",
  28: "Science & Technology",
  29: "Nonprofits & Activism",
};


// Function to extract userId from the localhost URL
function extractUserIdFromLocalhost(url) {
  const match = url.match(/localhost:3000\/(\d+)/); // Regex to extract userId
  return match ? match[1] : null; // Return userId or null if not found
}

// Function to fetch the current tab's URL and extract the userId
function getUserIdFromCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url) {
      console.log("Current tab URL:", tabs[0].url);

      // Check if the current tab is localhost
      if (tabs[0].url.includes("localhost:3000")) {
        const extractedUserId = extractUserIdFromLocalhost(tabs[0].url);
        if (extractedUserId) {
          console.log("Extracted userId from localhost:", extractedUserId);
          userId = extractedUserId; // Set global userId

          // Optionally, store userId in Chrome storage for persistence
          chrome.storage.local.set({ userId }, () => {
            console.log("UserId saved to Chrome storage:", userId);
          });
        } else {
          console.error("Failed to extract userId from localhost URL.");
        }
      } else {
        console.log("Current tab is not localhost:3000.");
      }
    } else {
      console.error("No URL found for the current tab.");
    }
  });
}

getUserIdFromCurrentTab();

function mapCategoryID(categoryId) {
  return categoryMap[categoryId] || "Unknown Category";
}

// Function to check if the category is blocked
function checkIfCategoryBlocked(categoryId) {
  console.log("the category is " + categoryId);
  const categoryName = mapCategoryID(categoryId);
  // Fetch the blocked categories from the backend
  fetch(`http://localhost:8080/block-categories/${userId}/blockedCategories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((blockedCategories) => {
      if (blockedCategories.includes(categoryName)) {
        console.log(`got to blockedcategories`);

        // Send a message to the content script to display the popup
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "showBlockedPopup" });
            console.log(`got to after blocked`);
          }
        );
      } else {
        console.log(`The category ${categoryName} is allowed.`);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

let lastUrl = "";

function blockVideo(url) {
  // Send the YouTube URL to the backend
  console.log("before fetch");

  trackWatchHistory(url);
  fetch(
    `http://localhost:8080/youtube/video-category?url=${encodeURIComponent(
      url
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.text())
    .then((data) => {
      const splitData = data.split(": ");
      const categoryId = parseInt(splitData[1], 10);
      console.log(splitData);

      checkIfCategoryBlocked(categoryId);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab update detected");
  getUserIdFromCurrentTab();

  // Check if the URL has changed to a YouTube video
  if (changeInfo.url && changeInfo.url.includes("youtube.com/watch")) {
    console.log("Tab ID is " + tabId);

    const videoUrl = changeInfo.url;

    // Check if the URL is different from the last one
    if (lastUrl !== videoUrl) {
      // Inject the content script using chrome.scripting.executeScript (Manifest V3)
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId }, // Use tabId provided in listener
          files: ["contentScript.js"],
        },
        () => {
          console.log("Content script injected for new video");
          // Call blockVideo after script injection
          blockVideo(videoUrl);
        }
      );

      // Update lastUrl
      lastUrl = videoUrl;
    } else {
      console.log("Same video as last time, still blocking");
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId }, // Use tabId provided in listener
          files: ["contentScript.js"],
        },
        () => {
          console.log("Content script injected again for same video");
          blockVideo(videoUrl);
        }
      );
    }
  } else {
    console.log("Not a YouTube video or URL has changed to something else.");
    lastUrl = ""; // Reset the lastUrl if not on a valid YouTube video
  }

  console.log("End of onUpdated listener");
});

function trackWatchHistory(videoUrl) {
  console.log("Saving video URL to watch history: " + videoUrl);

  // Send the YouTube URL to your backend to save in the user's watch history
  fetch(`http://localhost:8080/watch-history/${userId}/addVideo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: videoUrl }), // Send the video URL in the request body
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Watch history update response:", data);
    })
    .catch((error) => {
      console.error("Error saving watch history:", error);
    });
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "LOGOUT") {
    chrome.storage.local.remove(["authToken", "userId"], () => {
      console.log("Session data cleared on logout.");
    });
    sendResponse({ status: "success" });
  }
});

