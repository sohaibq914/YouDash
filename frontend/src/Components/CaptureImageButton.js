import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import BlockedPages from "../Pages/BlockedPages.tsx";
import Notification from "./Notification.js";

const CaptureComponent = () => {
  const captureAreaRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleCapture = async () => {
    const captureArea = captureAreaRef.current;

    // Temporarily show the capture area
    captureArea.style.display = "block";

    // Wait for a brief moment for the rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture the screenshot
    html2canvas(captureArea, {
      scale: 1,
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
    }).then((canvas) => {
      // Create the download link
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "screenshot.png";
      link.click();

      // Hide the capture area again
      captureArea.style.display = "none";
      // Show notification
      setShowNotification(true);
    });
  };

  return (
    <div>
      <button onClick={handleCapture}>Download Progress</button>

      {/* Show notification when image is downloaded */}
      {showNotification && (
        <Notification
          message="Image downloaded successfully!"
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Capture Area - Hidden by default */}
      <div
        id="capture-area"
        ref={captureAreaRef}
        style={{
          display: "none", // Hide by default
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "auto",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        {/* Content of the page you want to capture */}
       <BlockedPages />
      </div>
    </div>
  );
};

export default CaptureComponent;
