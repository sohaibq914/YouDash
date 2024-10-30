import React, { useEffect } from "react";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    // Automatically close after 3 seconds
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "80px 100px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      borderRadius: "8px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      fontSize: "18px",
      textAlign: "center",
    }}>
      {message}
    </div>
  );
};

export default Notification;
