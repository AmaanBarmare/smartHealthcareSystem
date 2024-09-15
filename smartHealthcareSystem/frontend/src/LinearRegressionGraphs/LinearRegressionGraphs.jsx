import React, { useState, useEffect } from "react";
import styles from "./LinearRegressionGraphsStyles.module.css";

const LinearRegressionGraphs = () => {
    const [obesityImageSrc, setObesityImageSrc] = useState(null);

    // Fetch the model plot from the backend
    useEffect(() => {
      fetch("http://localhost:5000/get_model_plot_obesity")
        .then((response) => response.blob())
        .then((blob) => {
          // Create an object URL for the image
          const imageUrl = URL.createObjectURL(blob);
          setObesityImageSrc(imageUrl);
        })
        .catch((error) => console.error("Error fetching model plot:", error));
    }, []);

    const [diabetesImageSrc, setDiabetesImageSrc] = useState(null);

    // Fetch the model plot from the backend
    useEffect(() => {
      fetch("http://localhost:5000/get_model_plot_diabetes")
        .then((response) => response.blob())
        .then((blob) => {
          // Create an object URL for the image
          const imageUrl = URL.createObjectURL(blob);
          setDiabetesImageSrc(imageUrl);
        })
        .catch((error) => console.error("Error fetching model plot:", error));
    }, []);
  
    return (
      <div>
        <h1>Linear Regression Model Plot</h1>
        <h2>Obesity Linear Regression Model Graphs</h2>
        <div className={styles.chartContainer}>
            {obesityImageSrc ? (
            <img src={obesityImageSrc} alt={"Obesity Model Plot"} />
            ) : (
            <p>Loading first plot...</p>
            )}
        </div>
        {/* <h2>Diabetes Linear Regression Model Graphs</h2>
        <div className={styles.chartContainer}>
        {diabetesImageSrc ? (
          <img src={diabetesImageSrc} alt={"Diabetes Model Plot"} />
        ) : (
          <p>Loading second plot...</p>
        )}
        </div> */}
      </div>
    );
};

export default LinearRegressionGraphs;
