import React, { createContext, useState } from "react";

// Create Context
export const ExperimentContext = createContext();

// Provider Component
export const ExperimentProvider = ({ children }) => {
  const [heatingData, setHeatingData] = useState([]);
  const [coolingData, setCoolingData] = useState([]);
  const [mixingData, setMixingData] = useState([]);

  // Add states for quiz results
  const [heatingQuizResults, setHeatingQuizResults] = useState([]);
  const [coolingQuizResults, setCoolingQuizResults] = useState([]);
  const [mixingQuizResults, setMixingQuizResults] = useState([]);
  return (
    <ExperimentContext.Provider
      value={{
        heatingData,
        setHeatingData,
        coolingData,
        setCoolingData,
        mixingData,
        setMixingData,
        heatingQuizResults,
        setHeatingQuizResults,
        coolingQuizResults,
        setCoolingQuizResults,
        mixingQuizResults,
        setMixingQuizResults,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};
