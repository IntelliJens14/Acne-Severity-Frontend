import React, { useState } from "react";
import axios from "axios";
import "./AcneSeverity.css";

function AcneSeverity() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [severityLevel, setSeverityLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCameraCapture = (e) => {
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
      setError(null);  // Reset error message
      const response = await axios.post(
        "https://efdb-34-125-15-146.ngrok-free.app/api/predict", // Updated URL
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSeverityLevel(response.data.severityLevel);
      setLoading(false);
    } catch (error) {
      console.error("Error during prediction:", error);
      setError("Error processing the image.");
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Acne Severity Detection</h1>
        <p>Scan your skin or upload a photo to detect acne severity.</p>
      </header>

      <div className="upload-container">
        {/* Camera capture input */}
        <input
          type="file"
          accept="image/*"
          id="camera"
          capture="environment"
          onChange={handleCameraCapture}
        />
        <label htmlFor="camera" className="button">
          Use Camera
        </label>

        {/* Gallery upload input */}
        <input
          type="file"
          accept="image/*"
          id="gallery"
          onChange={handleImageUpload}
        />
        <label htmlFor="gallery" className="button">
          Upload from Gallery
        </label>

        {/* Submit button */}
        <button onClick={handleSubmit} className="submit-button">
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>

      {/* Display the result */}
      {severityLevel && (
        <div className="result-card">
          <h2>Severity Level</h2>
          <p>{severityLevel}</p>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default AcneSeverity;
