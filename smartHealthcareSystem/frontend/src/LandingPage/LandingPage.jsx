import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPageStyles.module.css"; // You can create a separate CSS file for styling.

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/health-form");  // Redirect to the health form
  };

  const obesityButton = () => {
    navigate("/obesity-form");  // Redirect to the health form
  };

  return (
    <div className="landingContainer" style={styles.container}>
      <h1 style={styles.heading}>Welcome to Smart Healthcare System</h1>
      <p style={styles.text}>
        Predict the risk of diabetes with our simple health prediction tool.
      </p>
      <button style={styles.button} onClick={handleStart}>
        Diabetes Prediction Form
      </button>
      <p style={styles.text}>
        Know about your obesity status.
      </p>
      <button style={styles.button} onClick={obesityButton}>
        Obesity Status Form
      </button>
    </div>
  );
};

export default LandingPage;
