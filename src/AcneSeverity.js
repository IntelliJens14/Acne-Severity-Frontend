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
      const response = await axios.post("https://acne-severity.onrender.com/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
        <h1>Acne Severity Detection</h1>
        <p>Scan your skin or upload a photo to detect acne severity.</p>
      </header>

      <div className="upload-container">
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

        <input
          type="file"
          accept="image/*"
          id="gallery"
          onChange={handleImageUpload}
        />
        <label htmlFor="gallery" className="button">
          Upload from Gallery
        </label>

        <button onClick={handleSubmit} className="submit-button">
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>

      {severityLevel && (
        <div className="result-card">
          <h2>Severity Level</h2>
          <p>{severityLevel}</p>
        </div>
      )}
    </div>
  );
}

export default AcneSeverity;
