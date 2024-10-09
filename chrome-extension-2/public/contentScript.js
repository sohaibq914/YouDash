let popupClosed = false; 

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showBlockedPopup") {
        popupClosed = false; // Reset when a new popup is shown
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
      popup.style.display = 'none'; // Hide popup
      popupClosed = true; // Mark the popup as closed
  });
}


// Main function to show the popup and pause the video
function showBlockedPopup() {
  showPopup();

  // Pause the video
  const video = document.querySelector('video');
  if (video) {
      video.pause();

      // Add event listener for playing the video
      video.addEventListener('play', function onVideoPlay() {
          if (popupClosed) {
              // If the popup was closed and the user tries to play the video, show it again
              showPopup();
              video.pause(); // Pause the video again

              // Prevent multiple event listeners from stacking
              video.removeEventListener('play', onVideoPlay);
          }
      });
  }
}
