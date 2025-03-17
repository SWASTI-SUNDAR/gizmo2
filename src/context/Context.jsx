import React, { createContext, useState } from "react";

// Create Context
export const ExperimentContext = createContext();

// Provider Component
export const ExperimentProvider = ({ children }) => {
  const [heatingData, setHeatingData] = useState([]);
  const [coolingData,setCoolingData] = useState([]);
  const [mixingData, setMixingData] = useState([]);

  return (
    <ExperimentContext.Provider
      value={{
        heatingData,
        setHeatingData,
        coolingData,
        setCoolingData,
        mixingData,
        setMixingData
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};
