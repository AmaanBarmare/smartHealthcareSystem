import React, { useState } from "react";
import "./BreastFormStyles.module.css"; // CSS file for styling
import PredictionChart from "../PredictionChart/PredictionChart";

const BreastForm = () => {
  const [formData, setFormData] = useState({
    radius_mean: "",
    texture_mean: "",
    smoothness_mean: "",
    compactness_mean: "",
    symmetry_mean: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform basic validation here (optional)
    if (
      !formData.radius_mean ||
      !formData.texture_mean ||
      !formData.smoothness_mean ||
      !formData.compactness_mean ||
      !formData.symmetry_mean
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/predict-breast-cancer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            radius_mean: parseFloat(formData.radius_mean),
            texture_mean: parseFloat(formData.texture_mean),
            smoothness_mean: parseFloat(formData.smoothness_mean),
            compactness_mean: parseFloat(formData.compactness_mean),
            symmetry_mean: parseFloat(formData.symmetry_mean),
          }),
        }
      );

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error in submitting the form: ", error);
    }
  };

  // Function to categorize based on result or BMI
  const categorizeResult = (result) => {
    console.log(result);

    if (result == 1) {
      return "Malignant";
    } else if (result == 0) {
      return "Benign";
    }
    return "Unknown"; // fallback
  };

  return (
    <div className="formContainer">
      <h1>Enter Patient Health Data</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          margin: "0 auto",
        }}
      >
        <label htmlFor="radius_mean">Radius mean (mm):</label>
        <input
          type="number"
          id="radius_mean"
          name="radius_mean"
          value={formData.radius_mean}
          onChange={handleChange}
          min="1"
          max="70"
          step="0.1"
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="texture_mean">Texture mean:</label>
        <input
          type="number"
          id="texture_mean"
          name="texture_mean"
          value={formData.texture_mean}
          onChange={handleChange}
          min="10"
          max="100"
          step="0.1"
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="smoothness_mean">Smoothness mean:</label>
        <input
          type="number"
          id="smoothness_mean"
          name="smoothness_mean"
          value={formData.smoothness_mean}
          onChange={handleChange}
          min="0.05"
          max="0.30"
          step="0.01"
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="compactness_mean">Compactness mean:</label>
        <input
          type="number"
          id="compactness_mean"
          name="compactness_mean"
          value={formData.compactness_mean}
          onChange={handleChange}
          min="0.02" // Minimum value
          max="0.50" // Maximum value
          step="0.01" // Allows small decimal precision
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="symmetry_mean">Symmetry mean:</label>
        <input
          type="number"
          id="symmetry_mean"
          name="symmetry_mean"
          value={formData.symmetry_mean}
          onChange={handleChange}
          min="0.1"
          max="0.5"
          step="0.01"
          style={{ margin: "5px 0" }}
          required
        />

        <button type="submit" style={{ margin: "10px 0" }}>
          Submit
        </button>
      </form>

      {result && (
        <div>
          <PredictionChart
            predictionData={[
              { label: "Benign", value: 1.0 - result, good: true },
              { label: "Malignant", value: result, good: false },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default BreastForm;
