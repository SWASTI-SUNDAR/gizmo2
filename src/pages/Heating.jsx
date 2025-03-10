import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Lock, Unlock } from "lucide-react";
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

  // First, add this state near your other state variables in HeatingSubstancesSimulation
  const [activeTab, setActiveTab] = useState("status");

  // Then add this renderTabContent function
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    // Check if there's data to display in tables/graphs
    if ((tab === "table" || tab === "graph") && dataPoints.length <= 1) {
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
              States of Matter Simulation
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
        if (!isSealed && substanceState === "gas") {
          setWeightLossRate(heatLevel * 0.01);
          setWeight((prevWeight) =>
            Math.max(prevWeight - weightLossRate * deltaTime * 0.01, 0)
          );
        } else {
          setWeightLossRate(0);
        }

        // Add data point every second
        if (Math.floor(timeElapsed) > dataPoints.length) {
          setDataPoints((prevData) => [
            ...prevData,
            {
              time: Math.floor(timeElapsed),
              temperature: Math.round(temperature),
              weight: Math.round(weight * 100) / 100,
              state: substanceState,
            },
          ]);
        }
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

  // Get height for substance based on state
  const getSubstanceHeight = () => {
    switch (substanceState) {
      case "solid":
        return "h-24";
      case "liquid":
        return "h-20";
      case "gas":
        return "h-40";
      default:
        return "h-24";
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

  // Render ice cubes for solid state
  const renderIceCubes = () => {
    if (substanceState !== "solid") return null;

    const cubes = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cubes.push(
          <div
            key={`${i}-${j}`}
            className="absolute bg-blue-100 border border-blue-200 rounded-lg"
            style={{
              left: `${20 + i * 25}%`,
              top: `${20 + j * 25}%`,
              width: "20%",
              height: "20%",
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          />
        );
      }
    }

    return cubes;
  };

  return (
    <div
      style={{ backgroundImage: "url(page-three-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom bg-cover h-screen "
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
        <div className="absolute left-0 right-0 mx-auto max-w-xl bottom-20 h-80 overflow-hidden">
          {/* Container with substance */}
          <div className="left-0 right-0 mx-auto w-40 h-48">
            <div
              className={`relative ${
                isSealed ? "border-t-2" : ""
              } border-x-2 border-b-2 border-gray-400 rounded-lg bg-gray-50 h-full overflow-hidden ${
                isSealed ? "" : "rounded-t-none"
              }`}
            >
              {/* Substance */}
              <div
                className={`absolute bottom-0 left-0 right-0 ${getSubstanceColor()} ${getSubstanceHeight()} transition-all duration-500`}
              >
                {renderIceCubes()}
                {renderVaporParticles()}
              </div>

              {/* Heat visual */}
              {isHeating && (
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                  {[...Array(Math.ceil(heatLevel / 10))].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-8 bg-red-500 mx-1 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weighing scale */}
          <div className="absolute bottom- left-0 right-0 mx-auto flex flex-col items-center">
            <img src="digital-meter.png" className="h-24 " alt="" />
          </div>
        </div>
      </div>
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

        {/* Action Buttons */}
        <div className="flex gap-4 items-center justify-center">
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
          <button
            onClick={resetSimulation}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
