import React, { useState } from "react";
import "./HealthFormStyles.module.css";

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

    try {
      const response = await fetch("http://localhost:5000/predict", {
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
        <input
          type="text"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="age">Age:</label>
        <input
          type="text"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="hypertension">Hypertension:</label>
        <input
          type="text"
          id="hypertension"
          name="hypertension"
          value={formData.hypertension}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="heartdisease">Heart Disease:</label>
        <input
          type="text"
          id="heartdisease"
          name="heartdisease"
          value={formData.heartdisease}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="bmi">BMI:</label>
        <input
          type="text"
          id="bmi"
          name="bmi"
          value={formData.bmi}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="bloodglucose">Blood Glucose Level:</label>
        <input
          type="text"
          id="bloodglucose"
          name="bloodglucose"
          value={formData.bloodglucose}
          onChange={handleChange}
          style={{ margin: "5px 0" }}
        />

        <button type="submit" style={{ margin: "10px 0" }}>
          Submit
        </button>
      </form>

      {result && <h2>Diabetes Risk: {result}</h2>}
    </div>
  );
};

export default HealthForm;
