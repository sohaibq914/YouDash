chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  var activeTabUrl = activeTab.url;
  document.getElementById("url").textContent = activeTabUrl;
});
