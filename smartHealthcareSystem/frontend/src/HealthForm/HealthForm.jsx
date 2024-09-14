import React, { useState } from "react";
import "./HealthFormStyles.module.css";

const HealthForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    heartRate: "",
    bloodPressure: "",
    glucoseLevel: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  return (
    <div className="formContainer">
      <h1>Enter Patient Health Data</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          margin: "0 auto",
        }}
      >
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" style={{ margin: "5px 0" }} />

        <label htmlFor="gender">Gender:</label>
        <input
          type="text"
          id="gender"
          name="gender"
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="age">Age:</label>
        <input type="text" id="age" name="age" style={{ margin: "5px 0" }} />

        <label htmlFor="hypertension">Hypertension:</label>
        <input
          type="text"
          id="hypertension"
          name="hypertension"
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="heartdisease">Heart Disease:</label>
        <input
          type="text"
          id="heartdisease"
          name="heartdisease"
          style={{ margin: "5px 0" }}
        />

        <label htmlFor="bmi">BMI:</label>
        <input type="text" id="bmi" name="bmi" style={{ margin: "5px 0" }} />

        <label htmlFor="bloodglucose">Blood Glucose Level:</label>
        <input
          type="text"
          id="bloodglucose"
          name="bloodglucose"
          style={{ margin: "5px 0" }}
        />

        <button type="submit" style={{ margin: "10px 0" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default HealthForm;
