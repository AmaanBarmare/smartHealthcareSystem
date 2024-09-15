import React, { useState } from "react";
import "./ObesityFormStyles.module.css"; // CSS file for styling
import ObesityChart from "../ObesityChart/ObesityChart";

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
      const response = await fetch("http://localhost:5000/predict-obesity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: formData.gender === "Male" ? 1 : 0, // assuming '1' for male, '0' for female
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          bmi: parseFloat(formData.bmi),
          physicalactivitylevel: parseFloat(formData.physicalactivitylevel),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error in submitting the form: ", error);
    }
  };

  // Function to categorize based on result or BMI
  const categorizeResult = (result) => {
    console.log(result);

    if (result == 3) {
      return "Obese";
    } else if (result == 0) {
      return "Under Weight";
    } else if (result == 2) {
      return "Over Weight";
    } else if (result == 1) {
      return "Normal Weight";
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

      {result && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>Prediction Result</h2>
          <p>{categorizeResult(result.result)}</p>
          <p>BMI: {parseFloat(result.bmi).toFixed(2)}</p>
          <ObesityChart bmi={result.bmi} />
        </div>
      )}
    </div>
  );
};

export default ObesityForm;
