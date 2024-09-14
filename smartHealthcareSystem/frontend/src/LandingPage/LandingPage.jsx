import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPageStyles.module.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/health-form");
  };

  const obesityButton = () => {
    navigate("/obesity-form");
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>Welcome to Smart Healthcare System</h1>
        <p className={styles.subheading}>Your health, our priority.</p>
        <p className={styles.text}>
          Predict the risk of diabetes with our advanced health prediction tool.
        </p>
        <button className={styles.primaryButton} onClick={handleStart}>
          Diabetes Prediction Form
        </button>
        <p className={styles.text}>Learn more about your obesity status.</p>
        <button className={styles.secondaryButton} onClick={obesityButton}>
          Obesity Status Form
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
