import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";  // Import the Landing Page component
import HealthForm from "./HealthForm/HealthForm";    // Import the Health Form component
import ObesityForm from "./ObesityForm/ObesityForm";    // Import the Obesity Form component
import BreastForm from "./BreastForm/BreastForm";    // Import the Breast Form component
import Graphs from "./LinearRegressionGraphs/LinearRegressionGraphs";    // Import the LinearRegression Graphs component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />      {/* Landing Page route */}
        <Route path="health-form" element={<HealthForm />} />  {/* Health Form route */}
        <Route path="obesity-form" element={<ObesityForm />} />  {/* Obesity Form route */}
        <Route path="breast-form" element={<BreastForm />} />  {/* Breast Form route */}
        <Route path="graphs" element={<Graphs />} />  {/* Graph route */}
      </Routes>
    </Router>
  );
}

export default App;