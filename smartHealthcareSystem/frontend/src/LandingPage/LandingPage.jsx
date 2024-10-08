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

  const breastButton = () => {
    navigate("/breast-form");
  };

  const graphsButton = () => {
    navigate("/graphs");
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
          Diabetes Prediction
        </button>
        <p className={styles.text}>Learn more about your obesity status.</p>
        <button className={styles.secondaryButton} onClick={obesityButton}>
          Obesity Status
        </button>
        <p className={styles.text}>
          Predicting which type of breast cancer you have.
        </p>
        <button className={styles.primaryButton} onClick={breastButton}>
          Breast Cancer
        </button>
        <p className={styles.text}>
          Look at our plotted linear regression best fit line graphs.
        </p>
        <button className={styles.secondaryButton} onClick={graphsButton}>
          Graphs
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
