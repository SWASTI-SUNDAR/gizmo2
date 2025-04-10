import React, { createContext, useState, useEffect } from "react";

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

  // Add userResponse state for tracking quiz responses globally
  const [userResponse, setUserResponse] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const updateResponse = (startIndex, questionIndex, isCorrect) => {
    const globalIndex = startIndex + questionIndex;
    const newResponses = [...userResponse];
    newResponses[globalIndex] = isCorrect ? 1 : 2;
    setUserResponse(newResponses);

    // Call the function to send to LMS
    changeValueAndSendToLMS(newResponses);
  };
  // Function to handle sending to LMS
  const changeValueAndSendToLMS = (responses = userResponse) => {
    const responseString = responses.join(",");
    console.log("setSus" + responseString);
    // You might want to save to localStorage here as well
    localStorage.setItem("quizResponses", responseString);
  };
  useEffect(() => {
    // Try to get from localStorage first
    const savedResponses = localStorage.getItem("quizResponses");
    console.log("savedResponses", savedResponses);
    let suspendData = savedResponses || "0,0,0,0,0,0,0,0,0"; // default value if nothing in storage

    console.log("getSus");
    console.log(suspendData);

    if (suspendData && suspendData !== "") {
      try {
        const parsedData = suspendData.split(",").map(Number);
        if (Array.isArray(parsedData) && parsedData.length === 9) {
          setUserResponse(parsedData);
          console.log(parsedData + "==========");
        }
      } catch (e) {
        console.error("Error restoring data on load:", e);
      }
    }
  }, []);
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
        userResponse,
        updateResponse,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};
