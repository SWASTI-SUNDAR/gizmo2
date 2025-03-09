import React, { useState, useEffect } from "react";

const HeatingSimulation = () => {
  // State variables
  const [isHeating, setIsHeating] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [heatLevel, setHeatLevel] = useState(20);
  const [containerSealed, setContainerSealed] = useState(true);
  const [weight, setWeight] = useState(100);
  const [initialWeight, setInitialWeight] = useState(100);
  const [state, setState] = useState("Solid");
  const [time, setTime] = useState(0);
  const [dataPoints, setDataPoints] = useState([
    { time: 0, temperature: 0, weight: 100 },
  ]);
  const [escapedVapor, setEscapedVapor] = useState(0);

  // Constants for state changes
  const MELTING_POINT = 32;
  const BOILING_POINT = 100;

  // Effect to handle heating simulation
  useEffect(() => {
    let interval;
    if (isHeating) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setTemperature((prevTemp) => {
          const newTemp = Math.min(prevTemp + heatLevel / 20, 150);
          return newTemp;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHeating, heatLevel]);

  // Effect to update state based on temperature
  useEffect(() => {
    if (temperature < MELTING_POINT) {
      setState("Solid");
    } else if (temperature >= MELTING_POINT && temperature < BOILING_POINT) {
      setState("Liquid");
    } else {
      setState("Gas");
    }
  }, [temperature]);

  // Effect to handle weight changes if container is not sealed
  useEffect(() => {
    if (state === "Gas" && !containerSealed) {
      // Reduce weight over time if in gas state and container open
      const escape = Math.min(0.5, initialWeight - weight + escapedVapor);
      if (escape > 0) {
        setWeight((prevWeight) => Math.max(prevWeight - escape, 0));
        setEscapedVapor((prev) => prev + escape);
      }
    }
  }, [state, containerSealed, time]);

  // Effect to update data points
  useEffect(() => {
    setDataPoints((prev) => [...prev, { time, temperature, weight }]);
  }, [time, temperature, weight]);

  // Reset simulation
  const resetSimulation = () => {
    setIsHeating(false);
    setTemperature(0);
    setHeatLevel(20);
    setContainerSealed(true);
    setWeight(initialWeight);
    setEscapedVapor(0);
    setState("Solid");
    setTime(0);
    setDataPoints([{ time: 0, temperature: 0, weight: initialWeight }]);
  };

  // Get color for material based on state
  const getMaterialColor = () => {
    if (state === "Solid") return "bg-blue-300";
    if (state === "Liquid") return "bg-blue-500";
    return "bg-blue-200 opacity-70";
  };

  // Render the graph
  const renderGraph = () => {
    const maxTime = Math.max(10, time);
    const filteredPoints = dataPoints.slice(-20); // Show last 20 points

    return (
      <div className="relative h-64 w-full">
        <div className="absolute left-0 bottom-0 h-full w-full border-l border-b border-gray-400">
          {/* Y-axis labels */}
          <div className="absolute -left-8 bottom-0 text-xs">0°C</div>
          <div className="absolute -left-8 top-1/4 text-xs">50°C</div>
          <div className="absolute -left-8 top-1/2 text-xs">100°C</div>
          <div className="absolute -left-8 top-3/4 text-xs">150°C</div>

          {/* Temperature line */}
          <div className="absolute left-0 bottom-0 w-full h-full">
            {filteredPoints.map((point, i) => {
              if (i === 0) return null;
              const prevPoint = filteredPoints[i - 1];
              const x1 = (prevPoint.time / maxTime) * 100 + "%";
              const y1 = 100 - (prevPoint.temperature / 150) * 100 + "%";
              const x2 = (point.time / maxTime) * 100 + "%";
              const y2 = 100 - (point.temperature / 150) * 100 + "%";

              return (
                <svg
                  key={`temp-${i}`}
                  className="absolute left-0 top-0 w-full h-full overflow-visible"
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="red"
                    strokeWidth="2"
                  />
                </svg>
              );
            })}
          </div>

          {/* Weight line */}
          <div className="absolute left-0 bottom-0 w-full h-full">
            {filteredPoints.map((point, i) => {
              if (i === 0) return null;
              const prevPoint = filteredPoints[i - 1];
              const x1 = (prevPoint.time / maxTime) * 100 + "%";
              const y1 = 100 - (prevPoint.weight / initialWeight) * 100 + "%";
              const x2 = (point.time / maxTime) * 100 + "%";
              const y2 = 100 - (point.weight / initialWeight) * 100 + "%";

              return (
                <svg
                  key={`weight-${i}`}
                  className="absolute left-0 top-0 w-full h-full overflow-visible"
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="blue"
                    strokeWidth="2"
                  />
                </svg>
              );
            })}
          </div>

          {/* State change markers */}
          <div className="absolute left-0 bottom-0 h-full w-full">
            <div
              className="absolute left-0 bottom-0 border-t border-dashed border-gray-400"
              style={{ height: `${100 - (MELTING_POINT / 150) * 100}%` }}
            >
              <span className="absolute -top-6 -left-2 text-xs">
                Melting Point
              </span>
            </div>
            <div
              className="absolute left-0 bottom-0 border-t border-dashed border-gray-400"
              style={{ height: `${100 - (BOILING_POINT / 150) * 100}%` }}
            >
              <span className="absolute -top-6 -left-2 text-xs">
                Boiling Point
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-0 right-0 flex flex-col text-xs bg-white p-1 border border-gray-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-1"></div>
            <span>Temperature</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span>Weight</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Heating Substances: Conserving Weight
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Simulation */}
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-lg shadow relative h-64 flex items-center justify-center">
            {/* Container */}
            <div
              className={`relative ${
                containerSealed
                  ? "border-2 border-gray-400 rounded-lg"
                  : "border-b-2 border-gray-400"
              } h-48 w-48`}
            >
              {/* Material */}
              <div
                className={`absolute bottom-0 w-full ${getMaterialColor()} transition-all duration-500`}
                style={{
                  height:
                    state === "Gas"
                      ? "90%"
                      : state === "Liquid"
                      ? "60%"
                      : "40%",
                }}
              >
                {/* Vapor particles */}
                {state === "Gas" && (
                  <>
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-blue-200 rounded-full opacity-70"
                        style={{
                          width: "10px",
                          height: "10px",
                          left: `${Math.random() * 90}%`,
                          bottom: `${Math.random() * 100}%`,
                          animation: `float ${
                            2 + Math.random() * 3
                          }s infinite ease-in-out`,
                        }}
                      ></div>
                    ))}
                  </>
                )}
              </div>

              {/* Escaping vapor */}
              {!containerSealed && state === "Gas" && (
                <div className="absolute -top-16 left-0 w-full h-16 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-blue-200 rounded-full opacity-70"
                      style={{
                        width: "8px",
                        height: "8px",
                        left: `${20 + Math.random() * 60}%`,
                        bottom: `${Math.random() * 100}%`,
                        animation: `escape ${
                          1 + Math.random() * 2
                        }s infinite linear`,
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Heat source */}
              {isHeating && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    {[...Array(Math.ceil(heatLevel / 10))].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-6 bg-gradient-to-t from-red-600 to-yellow-300"
                        style={{ animation: "flicker 0.5s infinite alternate" }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Digital scale */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-2 rounded-lg border-2 border-gray-600 w-32 text-center">
              <div className="text-xs">WEIGHT</div>
              <div className="text-lg font-mono">{weight.toFixed(1)} g</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col space-y-4">
              {/* Heat slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heat Level: {heatLevel}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heatLevel}
                  onChange={(e) => setHeatLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Start/Stop button */}
              <button
                onClick={() => setIsHeating(!isHeating)}
                className={`px-4 py-2 rounded-md ${
                  isHeating
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {isHeating ? "Stop Heating" : "Start Heating"}
              </button>

              {/* Sealed container toggle */}
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Container:
                </span>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={containerSealed}
                    onChange={() => setContainerSealed(!containerSealed)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    className={`toggle-label block overflow-hidden h-6 rounded-full ${
                      containerSealed ? "bg-green-400" : "bg-gray-300"
                    } cursor-pointer`}
                  ></label>
                </div>
                <span className="text-sm text-gray-700">
                  {containerSealed ? "Sealed" : "Open"}
                </span>
              </div>

              {/* Reset button */}
              <button
                onClick={resetSimulation}
                className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
              >
                Reset Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Data and Graphs */}
        <div className="flex flex-col space-y-4">
          {/* Data table */}
          <div className="bg-white p-4 rounded-lg shadow overflow-auto h-48">
            <h3 className="text-lg font-semibold mb-2">Data Table</h3>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 py-1 border text-left text-xs font-semibold text-gray-700">
                    Time (s)
                  </th>
                  <th className="px-2 py-1 border text-left text-xs font-semibold text-gray-700">
                    Temp (°C)
                  </th>
                  <th className="px-2 py-1 border text-left text-xs font-semibold text-gray-700">
                    State
                  </th>
                  <th className="px-2 py-1 border text-left text-xs font-semibold text-gray-700">
                    Weight (g)
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.slice(-5).map((point, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-2 py-1 border text-xs">{point.time}</td>
                    <td className="px-2 py-1 border text-xs">
                      {point.temperature.toFixed(1)}
                    </td>
                    <td className="px-2 py-1 border text-xs">
                      {point.temperature < MELTING_POINT
                        ? "Solid"
                        : point.temperature < BOILING_POINT
                        ? "Liquid"
                        : "Gas"}
                    </td>
                    <td className="px-2 py-1 border text-xs">
                      {point.weight.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graph */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">
              Temperature vs. State Change
            </h3>
            {renderGraph()}
          </div>

          {/* Stats */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Current Status</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Temperature:
                </span>
                <span className="text-sm ml-2">{temperature.toFixed(1)}°C</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  State:
                </span>
                <span className="text-sm ml-2">{state}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Current Weight:
                </span>
                <span className="text-sm ml-2">{weight.toFixed(1)} g</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Container:
                </span>
                <span className="text-sm ml-2">
                  {containerSealed ? "Sealed" : "Open"}
                </span>
              </div>
              {!containerSealed && (
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Escaped Vapor:
                  </span>
                  <span className="text-sm ml-2">
                    {escapedVapor.toFixed(1)} g
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }

        @keyframes escape {
          0% {
            transform: translateY(0);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }

        @keyframes flicker {
          0% {
            opacity: 0.8;
            height: 6px;
          }
          100% {
            opacity: 1;
            height: 7px;
          }
        }

        .toggle-checkbox:checked {
          right: 0;
          border-color: #68d391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68d391;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #d1d5db;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
};

export default HeatingSimulation;
