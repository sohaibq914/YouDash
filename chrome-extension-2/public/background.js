const categoryMap = {
    1: "Film & Animation",
    2: "Autos & Vehicles",
    10: "Music",
    15: "Pets & Animals" 
};

const userId = 12345;

function mapCategoryID(categoryId) {
    return categoryMap[categoryId] || "Unknown Category";
}

// Function to check if the category is blocked
function checkIfCategoryBlocked(categoryId) {
    const categoryName = mapCategoryID(categoryId);
    // Fetch the blocked categories from the backend
    fetch(`http://localhost:8080/block-categories/${userId}/blockedCategories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.text())
    .then(blockedCategories => {
      if (blockedCategories.includes(categoryName)) {
        
         // Send a message to the content script to display the popup
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "showBlockedPopup" });
      });
      } else {
        console.log(`The category ${categoryName} is allowed.`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

let lastUrl = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes('youtube.com/watch')) {
      // Extract the current YouTube video URL
      const videoUrl = changeInfo.url;
      if (lastUrl != videoUrl) {
        lastUrl = videoUrl;

         // Send a message to the content script to reset logic for the new video
        chrome.tabs.sendMessage(tabId, { action: "resetLogic" });

         // Send the YouTube URL to your backend using a GET request with query parameters
        fetch(`http://localhost:8080/youtube/video-category?url=${encodeURIComponent(videoUrl)}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(response => response.text())
        .then(data => {
            console.log('Response from backend:', data);
            
            // data = Category ID: 10 as example
            const splitData = data.split(": ");
            const categoryId = parseInt(splitData[1], 10);

            checkIfCategoryBlocked(categoryId);
        })
        .catch(error => {
            console.error('Error:', error);
        });
      }
    }
    else {
        lastUrl = '';
    }
  });
  


  