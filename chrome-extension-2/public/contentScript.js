// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showBlockedPopup") {
    showBlockedPopup();
  }
});

function showPopup() {
// Create the popup container
const popup = document.createElement('div');
popup.classList.add('youdash-popup');

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
const closeButton = popup.querySelector('.close-btn');
closeButton.addEventListener('click', () => {
  popup.style.display = 'none';  // Hide popup
});
}

// Main function to show the popup and pause the video
function showBlockedPopup() {
showPopup();

// Pause the video
const video = document.querySelector('video');
if (video) {
  video.pause();

  // Add an event listener for playing the video
  video.addEventListener('play', function() {
    // Check if the popup is hidden
    if (document.querySelector('.youdash-popup').style.display === 'none') {
      video.pause();  // Pause the video again
      showPopup();  // Show the popup again
    }
  });
}
}
