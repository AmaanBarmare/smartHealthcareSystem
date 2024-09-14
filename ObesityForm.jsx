import React, { useState } from "react";
import "./ObesityFormStyles.module.css"; // CSS file for styling
import PredictionChart from "../PredictionChart/PredictionChart";

const ObesityForm = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    physicalactivitylevel: "",
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
      !formData.weight ||
      !formData.height ||
      !formData.physicalactivitylevel
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: formData.gender === "Male" ? 1 : 0, // assuming '1' for male, '0' for female
          age: parseInt(formData.age),
          hypertension: parseFLoat(formData.weight),
          heart_disease: parseFloat(formData.height),
          bmi: parseFloat(formData.bmi),
          blood_glucose_level: parseFloat(formData.physicalactivitylevel),
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
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="weight">Weight:</label>
        <input
          type= "number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="height">Height:</label>
        <input
          type = "number"
          id="height"
          name="height"
          value={formData.height}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
          required
        />

        <label htmlFor="physicalactivitylevel">Physical Activity Level:</label>
        <input
          type="number"
          id="physicalactivitylevel"
          name="physicalactivitylevel"
          value={formData.physicalactivitylevel}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
          required
        />

        <button type="submit" style={{ margin: "10px 0" }}>
          Submit
        </button>
      </form>

      {result && <PredictionChart predictionData={[{label: "Diabetes", value: result, good: false}, {label: "No Diabetes", value: 1.0 - result, good: true}]} />}
    </div>
  );
};

export default ObesityForm;
