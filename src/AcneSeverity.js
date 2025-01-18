import React, { useState } from "react";
import axios from "axios";
import "./AcneSeverity.css";

function AcneSeverity() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [severityLevel, setSeverityLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

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
      setLoading(false);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Error processing the image.");
      setLoading(false);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  return (
    <div className="app-container">
      <header>
        <h1>ACNE AI</h1>
      </header>

      <div className="upload-container">
        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          id="camera"
          capture="environment"
          onChange={handleCameraCapture}
        />
        <label htmlFor="camera" className="button">
          <span role="img" aria-label="camera">
            📷
          </span>
        </label>

        {/* Gallery Upload */}
        <input
          type="file"
          accept="image/*"
          id="gallery"
          onChange={handleImageUpload}
        />
        <label htmlFor="gallery" className="button">
          <span role="img" aria-label="gallery">
            🖼️
          </span>
        </label>

        <button onClick={handleSubmit} className="button">
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>

      {severityLevel && (
        <div className="result-card">
          <h2>Severity Level</h2>
          <p>{severityLevel}</p>
        </div>
      )}

      <footer>
        Acne Severity AI ©
      </footer>
    </div>
  );
}

export default AcneSeverity;
