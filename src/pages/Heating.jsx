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
  const [activeTab, setActiveTab] = useState("description");

  const [prevState, setPrevState] = useState("Solid");
  const [showTransition, setShowTransition] = useState(false);
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
  
  useEffect(() => {
    if (state !== prevState) {
      setShowTransition(true);
      const timer = setTimeout(() => {
        setPrevState(state);
        setShowTransition(false);
      }, 2000); // transition duration
      return () => clearTimeout(timer);
    }
  }, [state, prevState]);
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
  
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    if ((tab === "table" || tab === "graph") && dataPoints.length <= 1) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Start heating to see results.
        </div>
      );
    }
    switch (tab) {
      case "table":
        return (
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
        );

      case "graph":
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">
              Temperature vs. State Change
            </h3>
            {renderGraph()}
          </div>
        );

      case "status":
        return (
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
        );

      case "description":
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Heating Simulation</h3>
            <p className="text-sm mb-2">
              This simulation demonstrates how matter changes states when
              heated. The three states of matter shown are:
            </p>
            <ul className="list-disc pl-5 text-sm">
              <li>Solid: Matter has a fixed shape and volume</li>
              <li>Liquid: Matter has a variable shape but fixed volume</li>
              <li>Gas: Matter has variable shape and volume</li>
            </ul>
            <p className="text-sm mt-2">
              Notice how the material changes state at specific temperatures
              (melting and boiling points) and how the weight changes when the
              container is unsealed.
            </p>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div
      className="w-full bg-no-repeat bg-center bg-cover h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('page-first-bg.png')",
      }}
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/* Control Panel */}
          <ControlPanel
            heatLevel={heatLevel}
            setHeatLevel={setHeatLevel}
            containerSealed={containerSealed}
            setContainerSealed={setContainerSealed}
            isHeating={isHeating}
            setIsHeating={setIsHeating}
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
          {/* Simulation */}
          <div className="absolute max-w-xl  p-4 bottom-36 left-0 right-0 mx-auto">
            <div className="p-6 rounded-lg relative h-80 flex items-center justify-center">
              {/* Improved Digital Scale */}
              <div className="relative">
                {/* Scale platform */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-10 bg-gradient-to-b from-gray-300 to-gray-400 rounded-md shadow-md"></div>

                {/* Scale base with screen */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-72">
                  <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg p-3 shadow-lg">
                    <div className="bg-gray-800 p-2 rounded border-2 border-gray-600">
                      <div className="bg-green-900 p-2 rounded flex flex-col items-center">
                        <div className="text-xs text-green-400">WEIGHT (g)</div>
                        <div className="font-mono text-2xl text-green-500 font-bold tracking-wider">
                          {weight.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Container */}
                <div className="relative mb-8">
                  {/* Container lid */}
                  {containerSealed && (
                    <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-t-lg shadow-sm z-10">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Container walls */}
                  <div
                    className={`relative w-56 h-56 ${
                      containerSealed
                        ? "bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-lg border border-gray-400 shadow-inner"
                        : "bg-gradient-to-r from-gray-200 via-white to-gray-200 border-b-2 border-l-2 border-r-2 border-gray-400 rounded-b-lg shadow-inner"
                    }`}
                  >
                    {/* Material inside container */}
                    <div
                      className="absolute bottom-0 w-full transition-all duration-500 rounded-b-lg overflow-hidden"
                      style={{
                        height:
                          state === "Gas"
                            ? "90%"
                            : state === "Liquid"
                            ? "60%"
                            : "40%",
                      }}
                    >
                      {/* Solid state (ice cubes) */}
                      {(state === "Solid" ||
                        (prevState === "Solid" && showTransition)) && (
                        <div
                          className={`relative w-full h-full ${
                            prevState === "Solid" &&
                            state === "Liquid" &&
                            showTransition
                              ? "solid-to-liquid"
                              : ""
                          }`}
                        >
                          {/* Multiple ice cubes with shadows and highlights */}
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-inner border border-blue-50 ice-cube"
                              style={{
                                width: `${20 + Math.random() * 15}px`,
                                height: `${20 + Math.random() * 15}px`,
                                transform: `rotate(${
                                  Math.random() * 40 - 20
                                }deg)`,
                                left: `${15 + (i % 3) * 30}%`,
                                bottom: `${10 + Math.floor(i / 3) * 50}%`,
                                boxShadow:
                                  "inset 2px 2px 4px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.1)",
                                animationDelay: `${i * 0.2}s`,
                              }}
                            >
                              {/* Ice shimmer effect */}
                              <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full opacity-80"></div>
                              <div className="absolute bottom-1 left-1 w-3 h-1 bg-white rounded-full opacity-50"></div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Liquid state (water) */}
                      {(state === "Liquid" ||
                        (prevState === "Liquid" && showTransition)) && (
                        <div
                          className={`relative w-full h-full bg-blue-500 ${
                            prevState === "Solid" &&
                            state === "Liquid" &&
                            showTransition
                              ? "liquid-appear"
                              : prevState === "Liquid" &&
                                state === "Gas" &&
                                showTransition
                              ? "liquid-to-gas"
                              : ""
                          }`}
                        >
                          {/* Water surface with waves */}
                          <div
                            className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-blue-400 to-blue-500"
                            style={{
                              boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            <div
                              className="absolute top-0 left-0 w-full h-2 bg-blue-300 opacity-30"
                              style={{
                                animation:
                                  "wave 2s ease-in-out infinite alternate",
                              }}
                            ></div>
                            <div className="absolute top-1 left-10 w-20 h-1 bg-white opacity-20 rounded-full"></div>
                            <div className="absolute top-2 left-20 w-30 h-1 bg-white opacity-20 rounded-full"></div>
                          </div>

                          {/* Light reflection on water */}
                          <div className="absolute top-0 left-0 w-full h-8">
                            <div className="absolute top-0 left-10% w-40% h-3 bg-white opacity-20 rounded-full transform scale-x-150"></div>
                          </div>

                          {/* Pre-boiling bubbles near boiling point */}
                          {isHeating && temperature > BOILING_POINT * 0.7 && (
                            <>
                              {[
                                ...Array(
                                  Math.ceil(
                                    (temperature - BOILING_POINT * 0.7) / 5
                                  ) + 2
                                ),
                              ].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute rounded-full bg-blue-200 opacity-80"
                                  style={{
                                    width: `${3 + Math.random() * 3}px`,
                                    height: `${3 + Math.random() * 3}px`,
                                    bottom: `${Math.random() * 80}%`,
                                    left: `${Math.random() * 90}%`,
                                    animation: `bubbleRise ${
                                      1 + Math.random() * 2
                                    }s infinite`,
                                  }}
                                ></div>
                              ))}
                            </>
                          )}
                        </div>
                      )}

                      {/* Gas state (steam/vapor) */}
                      {(state === "Gas" ||
                        (prevState === "Gas" && showTransition)) && (
                        <div
                          className={`relative w-full h-full bg-gradient-to-t from-blue-300 to-blue-200 opacity-80 ${
                            prevState === "Liquid" &&
                            state === "Gas" &&
                            showTransition
                              ? "gas-appear"
                              : ""
                          }`}
                        >
                          {/* Steam bubbles */}
                          {[...Array(15)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute bg-white rounded-full opacity-70 vapor-particle"
                              style={{
                                width: `${8 + Math.random() * 6}px`,
                                height: `${8 + Math.random() * 6}px`,
                                left: `${Math.random() * 90}%`,
                                bottom: `${Math.random() * 100}%`,
                                animation: `float ${
                                  2 + Math.random() * 3
                                }s infinite ease-in-out`,
                                animationDelay: `${Math.random() * 2}s`,
                                boxShadow: "0 0 5px rgba(255,255,255,0.5)",
                              }}
                            ></div>
                          ))}

                          {/* Steam movement lines */}
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={`line-${i}`}
                              className="absolute bg-white opacity-30"
                              style={{
                                width: `${20 + Math.random() * 30}px`,
                                height: "1px",
                                left: `${Math.random() * 80}%`,
                                bottom: `${20 + Math.random() * 60}%`,
                                transform: `rotate(${
                                  Math.random() * 30 - 15
                                }deg)`,
                                animation: `fadeInOut ${
                                  3 + Math.random() * 2
                                }s infinite`,
                              }}
                            ></div>
                          ))}

                          {/* Condensation drops */}
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={`drop-${i}`}
                              className="absolute bg-gradient-to-b from-blue-200 to-blue-300 rounded-b-full opacity-90"
                              style={{
                                width: `${2 + Math.random() * 2}px`,
                                height: `${4 + Math.random() * 6}px`,
                                left: `${2 + Math.random() * 96}%`,
                                top: `${Math.random() * 80}%`,
                                animation:
                                  i % 3 === 0
                                    ? `dropSlide ${
                                        4 + Math.random() * 3
                                      }s infinite`
                                    : "",
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Temperature indicator */}
                    <div className="absolute -right-10 h-full">
                      <div className="relative h-full w-6 bg-gradient-to-t from-blue-500 via-green-400 to-red-500 rounded-full overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full bg-white"
                          style={{
                            height: `${100 - (temperature / 150) * 100}%`,
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-40"></div>
                      </div>
                      <div className="absolute -right-4 top-0 text-xs">
                        {temperature.toFixed(0)}°C
                      </div>
                    </div>
                  </div>

                  {/* Escaping vapor */}
                  {!containerSealed && state === "Gas" && (
                    <div className="absolute -top-16 left-0 w-full h-16 flex justify-center">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-blue-200 rounded-full opacity-70"
                          style={{
                            width: `${6 + Math.random() * 4}px`,
                            height: `${6 + Math.random() * 4}px`,
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
                            className="w-2 h-8 bg-gradient-to-t from-red-600 via-orange-400 to-yellow-300"
                            style={{
                              animation: "flicker 0.5s infinite alternate",
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        /* Existing animations */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) translateX(5px);
            opacity: 0.9;
          }
        }

        @keyframes escape {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-30px);
            opacity: 0;
          }
        }

        @keyframes flicker {
          0% {
            opacity: 0.7;
            height: 8px;
          }
          100% {
            opacity: 1;
            height: 10px;
          }
        }

        /* New animations for state transitions */
        @keyframes wave {
          0% {
            transform: translateX(-5px);
          }
          100% {
            transform: translateX(5px);
          }
        }

        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes dropSlide {
          0% {
            transform: translateY(0);
          }
          80% {
            transform: translateY(${Math.random() * 20 + 10}px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(${Math.random() * 20 + 15}px);
            opacity: 0;
          }
        }

        /* State transition animations */
        .solid-to-liquid {
          animation: melt 2s forwards;
        }

        .liquid-to-gas {
          animation: evaporate 2s forwards;
        }

        @keyframes melt {
          0% {
            opacity: 1;
          }
          50% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }

        .solid-to-liquid .ice-cube {
          animation: melt 2s forwards;
        }

        .liquid-appear {
          animation: appear 2s forwards;
        }

        .liquid-to-gas {
          animation: evaporate 2s forwards;
        }

        .gas-appear {
          animation: appear 2s forwards;
          opacity: 0;
        }

        .vapor-particle {
          opacity: 0;
          animation: fadeIn 1s forwards, float 3s infinite ease-in-out;
        }

        @keyframes melt {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            opacity: 0.5;
            transform: translateY(10px) scale(0.8) rotate(var(--rotation, 0deg));
          }
          100% {
            opacity: 0;
            transform: translateY(20px) scale(0.2) rotate(var(--rotation, 0deg));
          }
        }

        @keyframes appear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes evaporate {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0.3;
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.7;
          }
        }

        @keyframes evaporate {
          0% {
            opacity: 1;
          }
          100% {
            transform: translateY(-10px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HeatingSimulation;

const ControlPanel = ({
  heatLevel,
  setHeatLevel,
  containerSealed,
  setContainerSealed,
  isHeating,
  setIsHeating,
  resetSimulation,
}) => {
  return (
    <div className="space-y-6 absolute bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 px-8 md:px-16 z-50 text-white p-3 rounded-lg shadow-lg flex flex-wrap justify-center items-center gap-5 md:gap-10">
        {/* Heat slider */}
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
        <div className="flex md:flex-col gap-3 items-center">
          <span className="text-blue-400 text-sm font-semibold">Container</span>
          <button
            onClick={() => setContainerSealed(!containerSealed)}
            className={`w-10 h-5 rounded-full relative transition-all ${
              containerSealed ? "bg-green-500" : "bg-gray-500"
            }`}
            aria-label="Toggle container seal"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                containerSealed ? "left-6" : "left-1"
              }`}
            />
          </button>
          <span className="text-sm">{containerSealed ? "Sealed" : "Open"}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-5 items-center justify-center">
          <button
            onClick={() => setIsHeating(!isHeating)}
            className={`px-4 py-2 rounded-md ${
              isHeating
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isHeating ? "Stop Heating" : "Start Heating"}
          </button>
          <button
            onClick={resetSimulation}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset Simulation
          </button>
        </div>
      </div>
    </div>
  );
};