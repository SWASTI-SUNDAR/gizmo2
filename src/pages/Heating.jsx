import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Lock,
  Unlock,
  Snowflake,
  Droplet,
  Cloud,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { ExperimentContext } from "../context/Context";
import QuizComponent from "../components/Quiz";
import { heatingQuestions } from "../data/QuestionsData";

const HeatingSubstancesSimulation = () => {
  // State variables
  const [temperature, setTemperature] = useState(0);
  const [heatLevel, setHeatLevel] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [isSealed, setIsSealed] = useState(true);
  const [substanceState, setSubstanceState] = useState("solid");
  const [weight, setWeight] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [dataPoints, setDataPoints] = useState([]);
  const [weightLossRate, setWeightLossRate] = useState(0);

  const [showRecordConfirmation, setShowRecordConfirmation] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const { heatingData, setHeatingData, setHeatingQuizResults } =
    useContext(ExperimentContext);
  // First, add this state near your other state variables in HeatingSubstancesSimulation
  const [activeTab, setActiveTab] = useState("status");

  // Then add this renderTabContent function
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    // Check if there's data to display in tables/graphs
    if ((tab === "table" || tab === "graph") && dataPoints.length === 0) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Start heating to see results.
        </div>
      );
    }

    switch (tab) {
      case "description":
        return (
          <div className="bg-white max-h-80 p-3 rounded-lg overflow-y-scroll shadow-lg">
            <h2 className="text-xl font-semibold mb-3">
              Laby’s Lab 1: Heating Substances – Conserving Weight
            </h2>
            <p className="mb-2">
              This simulation demonstrates how matter changes between solid,
              liquid, and gas states when heated or cooled.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Key Points:</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    Matter exists in three common states: solid, liquid, and gas
                  </li>
                  <li>Temperature affects the state of matter</li>
                  <li>
                    When water reaches 32°F (0°C), it melts from solid to liquid
                  </li>
                  <li>
                    When water reaches 212°F (100°C), it boils from liquid to
                    gas
                  </li>
                  <li>
                    In a sealed container, gas cannot escape and weight remains
                    constant
                  </li>
                  <li>
                    In an open container, gas escapes and weight decreases
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg">Experiment Variables:</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    Heat Level: Controls how quickly the temperature increases
                  </li>
                  <li>Container State: Sealed or open, affects weight loss</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Data Table</h2>
            <div className="max-h-80 overflow-y-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Time (s)
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Temp (°F)
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Weight (g)
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      State
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataPoints.map((point, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {point.time}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {point.temperature}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {point.weight}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {point.state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "graph":
        return (
          <div className="bg-white p-2 max-h-80 rounded-lg shadow-lg">
            <h2 className="text-md font-semibold mb-1">
              Temperature & Weight Over Time
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: "Time (seconds)",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[0, MAX_TEMP]}
                    label={{
                      value: "Temperature (°F)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    label={{
                      value: "Weight (g)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    name="Temperature"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    name="Weight"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const recordDataPoint = () => {
    // Create a new data point with current values
    const newDataPoint = {
      time: Math.floor(timeElapsed),
      temperature: Math.round(temperature),
      weight: Math.round(weight * 100) / 100,
      state: substanceState,
      recorded: true, // Add a flag to indicate this is a manually recorded point
    };

    // Add to the dataPoints array
    setDataPoints((prevData) => [...prevData, newDataPoint]);
    setHeatingData((prevData) => [...prevData, newDataPoint]);
    // Update record count and show confirmation message
    setRecordCount((prevCount) => prevCount + 1);
    setShowRecordConfirmation(true);
    setTimeout(() => setShowRecordConfirmation(false), 1500);
  };
  // Animation references
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // Constants for simulation
  const MELTING_POINT = 32; // Water melting point (°F) for simplicity
  const BOILING_POINT = 212; // Water boiling point (°F)
  const MAX_TEMP = 250;
  const HEATING_RATE = 0.1; // Base rate at which temperature increases
  const COOLING_RATE = 0.05; // Rate at which temperature decreases when not heating

  // Effect for animation loop
  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;

        // Update time elapsed
        setTimeElapsed((prevTime) => prevTime + deltaTime * 0.01);

        // Update temperature based on heating state and heat level
        if (isHeating && temperature < MAX_TEMP) {
          setTemperature((prevTemp) =>
            Math.min(
              prevTemp + HEATING_RATE * heatLevel * deltaTime * 0.01,
              MAX_TEMP
            )
          );
        } else if (!isHeating && temperature > 0) {
          setTemperature((prevTemp) =>
            Math.max(prevTemp - COOLING_RATE * deltaTime * 0.01, 0)
          );
        }

        // Determine substance state based on temperature
        if (temperature < MELTING_POINT) {
          setSubstanceState("solid");
        } else if (temperature < BOILING_POINT) {
          setSubstanceState("liquid");
        } else {
          setSubstanceState("gas");
        }

        // Calculate weight loss for unsealed container
        if (!isSealed && substanceState === "gas" && weight > 0) {
          // Much faster weight loss calculation based on heat level and temperature
          const baseRate = 0.05; // Increased from 0.01
          const temperatureFactor = Math.max(
            0,
            (temperature - BOILING_POINT) / 50
          );
          const newWeightLossRate =
            baseRate * (1 + temperatureFactor) * heatLevel;

          setWeightLossRate(newWeightLossRate);
          setWeight((prevWeight) => {
            // More dramatic weight loss
            const newWeight = Math.max(
              prevWeight - newWeightLossRate * deltaTime * 0.02,
              0
            );
            return newWeight;
          });
        } else {
          setWeightLossRate(0);
        }

        // Add data point every second
        // if (Math.floor(timeElapsed) > dataPoints.length) {
        //   setDataPoints((prevData) => [
        //     ...prevData,
        //     {
        //       time: Math.floor(timeElapsed),
        //       temperature: Math.round(temperature),
        //       weight: Math.round(weight * 100) / 100,
        //       state: substanceState,
        //     },
        //   ]);
        // }
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [
    isHeating,
    heatLevel,
    temperature,
    isSealed,
    substanceState,
    weightLossRate,
    timeElapsed,
    dataPoints,
  ]);

  // Reset simulation
  const resetSimulation = () => {
    setTemperature(0);
    setIsHeating(false);
    setSubstanceState("solid");
    setWeight(100);
    setTimeElapsed(0);
    setDataPoints([]);
    setWeightLossRate(0);
  };

  // Get color for substance based on state
  const getSubstanceColor = () => {
    switch (substanceState) {
      case "solid":
        return "bg-blue-200";
      case "liquid":
        return "bg-blue-400";
      case "gas":
        return "bg-blue-100 bg-opacity-50";
      default:
        return "bg-blue-200";
    }
  };

  // Render vapor particles for gas state
  const renderVaporParticles = () => {
    if (substanceState !== "gas") return null;

    const particles = [];
    const particleCount = Math.min(10, Math.floor(temperature / 20));

    for (let i = 0; i < particleCount; i++) {
      const randomLeft = Math.floor(Math.random() * 80) + 10;
      const randomTop = Math.floor(Math.random() * 100);
      const size = Math.floor(Math.random() * 6) + 4;
      const opacity = Math.random() * 0.3 + 0.2;

      particles.push(
        <div
          key={i}
          className="absolute rounded-full bg-blue-200"
          style={{
            left: `${randomLeft}%`,
            top: `${randomTop}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity,
            animation: `float ${Math.random() * 3 + 2}s linear infinite`,
          }}
        />
      );
    }

    return particles;
  };
  const handleQuizComplete = (results) => {
    console.log("Quiz completed with results:", results);
    const correctAnswers = results.filter((result) => result === true).length;
    console.log(`Score: ${correctAnswers}/${results.length}`);

    // Save quiz results to context
    setHeatingQuizResults(results);
  };
  return (
    <div
      style={{ backgroundImage: "url(page-first-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom overflow-hidden bg-cover h-screen "
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/* Control Panel Component */}
          <ControlPanel
            heatLevel={heatLevel}
            setHeatLevel={setHeatLevel}
            isHeating={isHeating}
            setIsHeating={setIsHeating}
            isSealed={isSealed}
            setIsSealed={setIsSealed}
            resetSimulation={resetSimulation}
            recordDataPoint={recordDataPoint} // Add this line
          />
          <QuizComponent
            title="Laby’s Lab 1: Heating Substances – Conserving Weight"
            questions={heatingQuestions}
            onComplete={handleQuizComplete}
            startIndex={0}
          />
          {/* Tabs */}
          <div className="md:absolute hidden md:block md:top-12 md:w-80 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
            {["description", "table", "graph"].map((tab) => (
              <div key={tab} className="border-b">
                <button
                  className="w-full text-left px-4 py-2 bg-blue-200 hover:bg-blue-300"
                  onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                >
                  {tab.toUpperCase()}
                </button>
                {renderTabContent(tab)}
              </div>
            ))}
          </div>
        </div>

        {/* Substance Container */}
        {/* Enhanced Container with Realistic Sealed Effect */}
        <div className="absolute left-0 right-0 mx-auto max-w-xl bottom-36 h-80 overflow-visible">
          {/* Laboratory Container */}
          <div className="left-0 right-0 mx-auto w-48 h-64 relative">
            {/* Lab-style lid with clamps */}
            {isSealed && (
              <div className="absolute -top-6 w-full z-20">
                <div className="relative left-1/2 transform -translate-x-1/2">
                  {/* Main cap */}
                  <div className="w-36 h-6 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 rounded-t-xl shadow-lg">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gray-500 rounded-full"></div>
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>

                    {/* Lid clamps */}
                    <div className="absolute -left-1 top-4 w-4 h-5 bg-gray-500 rounded-l-md shadow-md"></div>
                    <div className="absolute -right-1 top-4 w-4 h-5 bg-gray-500 rounded-r-md shadow-md"></div>
                  </div>

                  {/* Rubber gasket */}
                  <div className="w-34 h-1.5 bg-gradient-to-r from-gray-600 via-amber-900 to-gray-600 rounded-b-sm"></div>
                </div>
              </div>
            )}
            {/* Container glass with enhanced realism */}
            <div
              className={`relative ${
                isSealed
                  ? "rounded-lg overflow-hidden"
                  : "rounded-b-lg rounded-t-none overflow-hidden"
              } border-0`}
              style={{
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(230,240,255,0.4), rgba(255,255,255,0.5) 30%, rgba(230,240,255,0.3) 50%, rgba(255,255,255,0.4) 70%, rgba(230,240,255,0.4))",
                boxShadow:
                  "0 0 15px rgba(0,0,0,0.15), inset 0 0 30px rgba(255,255,255,0.25)",
              }}
            >
              {/* Container walls with enhanced glass effect */}
              <div
                className="absolute inset-0.5 border-2 border-blue-50 rounded-lg bg-opacity-5 bg-blue-50"
                style={{
                  backdropFilter: "blur(1px)",
                  boxShadow:
                    "inset 0 0 15px rgba(255,255,255,0.4), inset 0 0 5px rgba(255,255,255,0.6)",
                }}
              >
                {/* State indicator icon - enhanced with glow effect */}
                <div
                  className="absolute top-4 right-2 bg-white rounded-full p-1.5 z-30"
                  style={{
                    boxShadow: `0 0 5px rgba(${
                      substanceState === "solid"
                        ? "150,200,255"
                        : substanceState === "liquid"
                        ? "59,130,246"
                        : "200,230,255"
                    }, 0.5)`,
                    transition: "all 0.3s ease",
                  }}
                >
                  {substanceState === "solid" ? (
                    <Snowflake
                      className="text-blue-500"
                      size={20}
                      style={{ filter: "drop-shadow(0 0 1px #3b82f6)" }}
                    />
                  ) : substanceState === "liquid" ? (
                    <Droplet
                      className="text-blue-500"
                      size={20}
                      style={{ filter: "drop-shadow(0 0 1px #3b82f6)" }}
                    />
                  ) : (
                    <Cloud
                      className="text-blue-400"
                      size={20}
                      style={{ filter: "drop-shadow(0 0 1px #93c5fd)" }}
                    />
                  )}
                </div>
                {/* Measurement markings */}
                <div className="absolute left-2 inset-y-0 flex flex-col justify-between py-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-0.5 bg-black opacity-40"></div>
                      <div className="text-xs text-gray-600 ml-1 opacity-60">
                        {(5 - i) * 20}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Glass light reflections */}
                <div className="absolute top-5 left-6 w-1 h-24 bg-white opacity-50 rounded-full"></div>
                <div className="absolute top-10 left-10 w-0.5 h-16 bg-white opacity-40 rounded-full"></div>
                <div className="absolute top-2 right-8 w-0.5 h-20 bg-white opacity-30 rounded-full"></div>
                {/* Open container edge with meniscus effect */}
                {!isSealed && (
                  <div className="absolute top-0 inset-x-0">
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-2 rounded-b-full bg-white opacity-10"></div>
                  </div>
                )}
                {/* Sealed rubber gasket effect */}
                {isSealed && (
                  <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-gray-500 via-amber-800 to-gray-500 opacity-80 border-b border-gray-600"></div>
                )}
                {/* Container contents */}
                <div
                  className={`absolute  transition-all duration-1000 left-0 right-0 ${
                    weight > 0 ? getSubstanceColor() : "bg-transparent"
                  }`}
                  style={{
                    bottom: 0,
                    height:
                      weight <= 0
                        ? "0%" // Empty container when weight is 0
                        : substanceState === "gas"
                        ? "90%"
                        : substanceState === "liquid"
                        ? "60%"
                        : "40%",
                    boxShadow:
                      substanceState === "liquid" && weight > 0
                        ? "inset 0 10px 15px -5px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                >
                  {/* Empty container message - only shows when container is completely empty */}
                  {weight <= 0 && (
                    <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500 animate-fade-in py-2"></div>
                  )}
                  {/* State indicator icon - enhanced with glow effect */}

                  {/* State label - shows text description of current state */}

                  {/* Enhanced content rendering - only shows when there's substance left */}
                  {weight > 0 && (
                    <>
                      {substanceState === "liquid" && (
                        <div className="absolute top-0 inset-x-0 h-3 bg-blue-300 opacity-30">
                          <div className="absolute inset-x-0 top-0 h-1 bg-white opacity-40"></div>
                        </div>
                      )}

                      {substanceState === "solid" && (
                        <div className="relative w-full h-full">
                          {/* Existing solid state code */}
                          {[...Array(9)].map((_, i) => {
                            const row = Math.floor(i / 3);
                            const col = i % 3;
                            return (
                              <div
                                key={`cube-${i}`}
                                className="absolute bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-inner border border-blue-50"
                                style={{
                                  width: `${20 + Math.random() * 5}%`,
                                  height: `${20 + Math.random() * 5}%`,
                                  transform: `rotate(${
                                    Math.random() * 30 - 15
                                  }deg)`,
                                  left: `${15 + col * 25}%`,
                                  bottom: `${10 + row * 25}%`,
                                  boxShadow:
                                    "inset 2px 2px 4px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
                                <div className="absolute bottom-1 left-1 w-3 h-1 bg-white rounded-full opacity-50"></div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Only render vapor particles if there's substance left */}
                      {renderVaporParticles()}
                    </>
                  )}
                </div>
                {/* Condensation drops on container walls - keep your existing code */}
                {(substanceState === "liquid" || substanceState === "gas") &&
                  temperature > MELTING_POINT + 10 && (
                    <>
                      {[...Array(15)].map((_, i) => (
                        <div
                          key={`drop-${i}`}
                          className="absolute bg-gradient-to-b from-blue-200 to-blue-300 rounded-b-full opacity-70"
                          style={{
                            width: `${1 + Math.random() * 2}px`,
                            height: `${3 + Math.random() * 5}px`,
                            left: `${2 + Math.random() * 96}%`,
                            top: `${20 + Math.random() * 50}%`,
                            animation:
                              i % 4 === 0
                                ? `dropSlide ${3 + Math.random() * 5}s infinite`
                                : "",
                            animationDelay: `${i * 0.5}s`,
                          }}
                        ></div>
                      ))}
                    </>
                  )}
              </div>
            </div>

            {/* Improved container stand */}
            {/* Weighing scale with digital display */}
          </div>
          <div className="absolute bottom- left-0 right-0 mx-auto flex flex-col items-center">
            <img src="digital-meter.png" className="h-24" alt="" />
            {/* Digital weight display */}
            <div
              className="absolute top-7 left-1/2 transform -translate-x-1/2 
                flex items-center justify-center rounded-sm overflow-hidden"
            >
              <div
                className="text-sm font-mono"
                style={{
                  color: "#22c55e", // Digital green display color
                  textShadow: "0 0 5px rgba(34, 197, 94, 0.7)",
                }}
              >
                {weight.toFixed(2)}
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes dropSlide {
              0% {
                transform: translateY(0);
              }
              80% {
                transform: translateY(20px);
                opacity: 0.7;
              }
              100% {
                transform: translateY(25px);
                opacity: 0;
              }
            }

            @keyframes flameHeight {
              0% {
                height: ${10 + heatLevel / 3}px;
              }
              100% {
                height: ${12 + heatLevel / 2.5}px;
              }
            }

            @keyframes flameFlicker {
              0% {
                opacity: 0.7;
                transform: translateX(-50%) scaleX(0.9);
              }
              100% {
                opacity: 0.9;
                transform: translateX(-50%) scaleX(1.1);
              }
            }

            @keyframes heatRipple {
              0% {
                transform: translateX(-50%) scale(0.8);
                opacity: 0.2;
              }
              50% {
                transform: translateX(-50%) scale(1);
                opacity: 0.6;
              }
              100% {
                transform: translateX(-50%) scale(1.2);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </div>
      <img
        src="male-main.png"
        className="absolute hidden md:block h-[55vh] z-0 -bottom-0 right right-[20%]"
        alt=""
      />
    </div>
  );
};

export default HeatingSubstancesSimulation;

const ControlPanel = ({
  heatLevel,
  setHeatLevel,
  isHeating,
  setIsHeating,
  isSealed,
  setIsSealed,
  resetSimulation,
  recordDataPoint,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 px-8 md:px-16 z-50 text-white p-3 rounded-lg shadow-lg flex flex-wrap justify-center items-center md:gap-10 gap-5">
        {/* Heat Level Slider */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Heat Level
          </span>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={heatLevel}
              onChange={(e) => setHeatLevel(parseInt(e.target.value))}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          <span className="text-sm">{heatLevel}%</span>
        </div>

        {/* Container toggle */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">Container</span>
          <button
            onClick={() => setIsSealed(!isSealed)}
            className={`w-10 h-5 rounded-full relative transition-all ${
              isSealed ? "bg-blue-500" : "bg-gray-500"
            }`}
            aria-label="Toggle container seal"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                isSealed ? "left-6" : "left-1"
              }`}
            />
          </button>
          <span className="text-sm flex items-center gap-1">
            {isSealed ? (
              <>
                <Lock size={12} /> Sealed
              </>
            ) : (
              <>
                <Unlock size={12} /> Open
              </>
            )}
          </span>
        </div>

        {/* Action Buttons - All in a single row now */}
        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setIsHeating(!isHeating)}
              className={`flex items-center justify-center px-4 py-2 rounded ${
                isHeating
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isHeating ? (
                <>
                  <Pause size={18} className="mr-2" /> Stop
                </>
              ) : (
                <>
                  <Play size={18} className="mr-2" /> Start
                </>
              )}{" "}
              Heating
            </button>

            {/* Reset Button */}
            <button
              onClick={resetSimulation}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M3 2v6h6"></path>
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                <path d="M21 22v-6h-6"></path>
                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
              </svg>
              Reset
            </button>

            {/* Record Data Button - Now beside Reset with matching style */}
            <button
              onClick={recordDataPoint}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Record Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
