import React, { useState } from "react";
import "./HealthFormStyles.module.css"; // CSS file for styling
import PredictionChart from "../PredictionChart/PredictionChart";

const HealthForm = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: "",
    heartdisease: "",
    bmi: "",
    bloodglucose: "",
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
      !formData.gender ||
      !formData.age ||
      !formData.bmi ||
      !formData.bloodglucose
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/predict-diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: formData.gender === "Male" ? 1 : 0, // assuming '1' for male, '0' for female
          age: parseInt(formData.age),
          hypertension: parseInt(formData.hypertension),
          heart_disease: parseInt(formData.heartdisease),
          bmi: parseFloat(formData.bmi),
          blood_glucose_level: parseFloat(formData.bloodglucose),
        }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error in submitting the form: ", error);
    }
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
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="0"
          max="120"
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="hypertension">Hypertension:</label>
        <select
          id="hypertension"
          name="hypertension"
          value={formData.hypertension}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
          required
        >
          <option value="">Select</option>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>

        <label htmlFor="heartdisease">Heart Disease:</label>
        <select
          id="heartdisease"
          name="heartdisease"
          value={formData.heartdisease}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
          required
        >
          <option value="">Select</option>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>

        <label htmlFor="bmi">BMI:</label>
        <input
          type="number"
          step="0.01"
          id="bmi"
          name="bmi"
          value={formData.bmi}
          onChange={handleChange}
          min="10"
          max="80"
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="bloodglucose">Blood Glucose Level:</label>
        <input
          type="number"
          id="bloodglucose"
          name="bloodglucose"
          value={formData.bloodglucose}
          onChange={handleChange}
          min="30"
          max="600" // Practical upper limit
          step="1"
          style={{ margin: "5px 0" }}
          required
        />

        <button type="submit" style={{ margin: "10px 0" }}>
          Submit
        </button>
      </form>

      {result && (
        <PredictionChart
          predictionData={[
            { label: "Diabetes", value: result, good: false },
            { label: "No Diabetes", value: 1.0 - result, good: true },
          ]}
        />
      )}
    </div>
  );
};

export default HealthForm;
