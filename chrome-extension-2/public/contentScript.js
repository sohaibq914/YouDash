

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`got to listener on content script`);
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
      popup.style.display = 'none'; // Hide popup
  });
}


// Main function to show the popup and pause the video
function showBlockedPopup() {
  showPopup();

  const video = document.querySelector('video');
  if (video) {
    video.pause();

    // Re-add the event listener for playing the video
    video.addEventListener('play', () => {
      const popup = document.querySelector('.youdash-popup');
      if (popup && popup.style.display === 'none') {
        video.pause();
        showPopup();
      }
    }, { once: true }); // Use { once: true } to ensure the listener is added only once
  }
}
