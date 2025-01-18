import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./AcneSeverity.css";

function AcneSeverity() {
  const [severityLevel, setSeverityLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

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

        // Use server's response for severity level
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
        <div className="detection-result">
          {severityLevel ? severityLevel : "Detected Severity"}
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleCaptureAndSubmit} className="button camera-button">
          {loading ? "Processing..." : "Capture"}
        </button>
        <button className="button gallery-button">
          Upload from Gallery
        </button>
      </div>

      <footer>
        Acne Severity AI ©
      </footer>
    </div>
  );
}

export default AcneSeverity;
