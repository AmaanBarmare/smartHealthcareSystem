import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";  // Import the Landing Page component
import HealthForm from "./HealthForm/HealthForm";    // Import the Health Form component
import ObesityForm from "./ObesityForm/ObesityForm";    // Import the Health Form component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />      {/* Landing Page route */}
        <Route path="health-form" element={<HealthForm />} />  {/* Health Form route */}
        <Route path="obesity-form" element={<ObesityForm />} />  {/* Health Form route */}
      </Routes>
    </Router>
  );
}

export default App;