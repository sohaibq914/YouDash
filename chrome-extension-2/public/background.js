const categoryMap = {
  1: "Film & Animation",
  2: "Autos & Vehicles",
  10: "Music",
  15: "Pets & Animals",
};

const userId = 12345;

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
