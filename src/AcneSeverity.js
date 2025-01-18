import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./AcneSeverity.css";

function AcneSeverity() {
  const [severityLevel, setSeverityLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera on component mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    };

    startCamera();
  }, []);

  const handleCaptureAndSubmit = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    // Capture current frame from the video feed
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a blob for submission
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      try {
        setLoading(true);
        const response = await axios.post(
          "https://9968-34-126-88-47.ngrok-free.app/api/predict",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setSeverityLevel(response.data.severityLevel);
      } catch (error) {
        console.error("Error during prediction:", error);
        alert("Error processing the image.");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="app-container">
      <header>
        <h1>ACNE AI</h1>
      </header>

      <div className="upload-container">
        <video ref={videoRef} autoPlay muted className="video-feed"></video>
        <canvas ref={canvasRef} className="hidden-canvas"></canvas>
        <div className="detection-banner">Detected Severity</div>
      </div>

      <button onClick={handleCaptureAndSubmit} className="button">
        {loading ? "Processing..." : "Detect"}
      </button>

      {severityLevel && (
        <div className="result-card">
          <h2>Severity Level</h2>
          <p>{severityLevel}</p>
        </div>
      )}

      <footer>
        Acne Severity AI © 2025
      </footer>
    </div>
  );
}

export default AcneSeverity;
