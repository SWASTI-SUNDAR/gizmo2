import React, { useState, useEffect } from "react";
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
import {
  AlertCircle,
  Check,
  Droplet,
  Snowflake,
  Lock,
  Unlock,
  Pause,
  Play,
} from "lucide-react";

const LabysLabCoolingSubstances = () => {
  // State variables
  const [coolingRate, setCoolingRate] = useState(50);
  const [hasLid, setHasLid] = useState(true);
  const [temperature, setTemperature] = useState(10);
  const [weight, setWeight] = useState(100);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  // Add this state to your component
  const [activeTab, setActiveTab] = useState("description");

  // Render tab content function
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    // Check if there's data to display in tables/graphs
    if ((tab === "table" || tab === "graph") && data.length <= 1) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Start the cooling experiment to see results.
        </div>
      );
    }

    switch (tab) {
      case "description":
        return (
          <div className="bg-white max-h-80 p-3 rounded-lg overflow-y-scroll shadow-lg">
            <h2 className="text-xl font-semibold mb-3">
              Cooling and States of Matter Simulation
            </h2>
            <p className="mb-2">
              This simulation demonstrates how water changes state when cooled
              and shows the conservation of mass principle.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Key Points:</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    Water freezes at 0°C, changing from liquid to solid state
                  </li>
                  <li>In a closed system (with lid), mass remains constant</li>
                  <li>
                    In an open system (no lid), some evaporation occurs,
                    reducing mass
                  </li>
                  <li>
                    The cooling rate affects how quickly the temperature changes
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg">Experiment Variables:</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    Cooling Rate: Controls how quickly the temperature decreases
                  </li>
                  <li>
                    System Configuration: Closed or open, affects weight loss
                  </li>
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
                      Temp (°C)
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
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-3 py-4 text-sm text-gray-500 text-center"
                      >
                        Start the experiment to collect data
                      </td>
                    </tr>
                  ) : (
                    data
                      .filter((_, index) => index % 5 === 0)
                      .map((row, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {row.time}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {row.temperature.toFixed(1)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {row.weight.toFixed(1)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {row.state.split(" ")[0]}
                          </td>
                        </tr>
                      ))
                  )}
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
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.filter((_, index) => index % 2 === 0)}>
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
                      label={{
                        value: "Temperature (°C)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[80, 100]}
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
                      stroke="#3b82f6"
                      name="Temperature"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="weight"
                      stroke="#10b981"
                      name="Weight"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Start the experiment to generate graph data
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // Calculate current state of water
  const getState = (temp) => {
    if (temp <= 0) return "Solid (Ice)";
    return "Liquid (Water)";
  };

  // Calculate frost level (0-100)
  const getFrostLevel = (temp) => {
    if (temp > 0) return 0;
    return Math.min(100, Math.abs(temp) * 5);
  };

  // Effect to handle simulation
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);

        // Calculate new temperature
        setTemperature((prevTemp) => {
          const coolingEffect = (coolingRate / 50) * 0.5;
          const targetTemp = -10;
          const newTemp = prevTemp - coolingEffect;
          return newTemp < targetTemp ? targetTemp : newTemp;
        });

        // Calculate weight loss (only if no lid and temperature > 0)
        setWeight((prevWeight) => {
          if (!hasLid && temperature > 0) {
            const evaporationRate = 0.1 * (coolingRate / 50);
            return Math.max(80, prevWeight - evaporationRate);
          }
          return prevWeight;
        });

        // Update data points for graphs
        setData((prevData) => {
          const newDataPoint = {
            time,
            temperature,
            weight,
            state: getState(temperature),
          };
          return [...prevData, newDataPoint];
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, coolingRate, hasLid, temperature, time]);

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setTemperature(10);
    setWeight(100);
    setData([]);
  };

  return (
    <div
      style={{ backgroundImage: "url(page-two-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom bg-cover h-screen "
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/* Control Panel at bottom */}
          <ControlPanel
            coolingRate={coolingRate}
            setCoolingRate={setCoolingRate}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            hasLid={hasLid}
            setHasLid={setHasLid}
            resetSimulation={resetSimulation}
          />
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
        {/* Main content */}
        <div className="absolute bottom-28 left-0 right-0 flex flex-col justify-center items-center max-w-lg mx-auto">
          {/* Beaker visualization */}
          <div className="relative w-48 h-80 mb-4">
            {/* Laboratory Glass Container with Realistic Effects */}
            <div
              className="absolute inset-0 rounded-b-lg rounded-t-sm overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,250,255,0.35), rgba(255,255,255,0.55) 25%, rgba(230,245,255,0.25) 50%, rgba(255,255,255,0.45) 75%, rgba(245,250,255,0.35))",
                boxShadow:
                  "0 0 15px rgba(0,0,0,0.12), inset 0 0 25px rgba(255,255,255,0.15)",
                border: "1px solid rgba(210,220,235,0.35)",
              }}
            >
              <div className="absolute left-1 inset-y-0 flex flex-col justify-between py-10">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-3 h-0.5 bg-gray-500"></div>
                    <div className="text-xs font-medium text-gray-600 ml-1">
                      {(5 - i) * 20}
                    </div>
                    <div className="absolute -left-0.5 w-1 h-0.5 bg-gray-500"></div>
                  </div>
                ))}

                {/* Minor measurement marks */}
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`minor-${i}`}
                    className="absolute h-0.5 w-1.5 bg-gray-400"
                    style={{
                      left: 0,
                      top: `${10 + i * 10}%`,
                      opacity: 0.7,
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-5 left-6 w-1 h-40 bg-white opacity-40 rounded-full"></div>
              <div className="absolute top-10 right-6 w-0.5 h-30 bg-white opacity-30 rounded-full"></div>
              <div className="absolute top-20 left-10 w-2 h-10 bg-white opacity-15 rounded-full blur-sm"></div>

              {/* Glass edge highlights */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-white opacity-30"></div>
              <div className="absolute inset-y-0 right-0 w-0.5 bg-white opacity-20"></div>
              {/* Glass wall effects - thickness and reflections */}
              {/* Enhanced Laboratory Lid with Clamp Effect */}
              {/* Ultra-Realistic Professional Laboratory Lid */}
              {hasLid && <Lid hasLid={hasLid} />}

              {/* Frost effect - enhanced with better pattern */}
              <div
                className="absolute inset-0 bg-white opacity-0 rounded-b-lg rounded-t-sm pointer-events-none transition-opacity duration-700"
                style={{
                  opacity: getFrostLevel(temperature) / 200,
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.7), rgba(240,248,255,0.4))",
                }}
              >
                <div
                  className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-80"
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M30,10 L70,10 M10,30 L90,30 M10,70 L90,70 M30,90 L70,90 M50,0 L50,100 M0,50 L100,50 M20,20 L80,80 M80,20 L20,80" stroke="%238BB5F8" stroke-width="1.5" fill="none" /></svg>\')',
                  }}
                ></div>

                {/* Additional frost crystals */}
                {temperature <= -2 && (
                  <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`frost-${i}`}
                        className="absolute bg-white"
                        style={{
                          width: `${1 + Math.random() * 2}px`,
                          height: `${1 + Math.random() * 2}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: 0.7,
                          boxShadow: "0 0 2px 1px rgba(255,255,255,0.7)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content - enhanced water and ice effects */}
              <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 rounded-b-lg`}
                style={{
                  height: "80%",
                  background:
                    temperature <= 0
                      ? "linear-gradient(to bottom, rgba(210,235,245,0.92), rgba(225,240,255,0.97))"
                      : "linear-gradient(to bottom, rgba(120,190,255,0.75) 20%, rgba(100,175,255,0.82) 50%, rgba(90,160,255,0.9))",
                  boxShadow:
                    temperature <= 0
                      ? "inset 0 0 20px rgba(255,255,255,0.9)"
                      : "inset 0 10px 20px -10px rgba(0,0,40,0.25)",
                }}
              >
                {/* Water surface effect */}
                {temperature > 0 && (
                  <div className="absolute top-0 inset-x-0 h-5">
                    {/* Surface tension effect at edges */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-blue-200 to-transparent opacity-50"></div>
                    <div className="absolute inset-x-4 top-0.5 h-0.5 bg-white opacity-35"></div>

                    {/* Multiple water ripple animations with different speeds */}
                    <div
                      className="absolute inset-x-0 top-0 h-2"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                        backgroundSize: "200% 100%",
                        animation: "waterRipple 8s linear infinite",
                      }}
                    ></div>
                    <div
                      className="absolute inset-x-0 top-1 h-1.5"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                        backgroundSize: "150% 100%",
                        animation: "waterRipple 12s linear infinite reverse",
                      }}
                    ></div>

                    {/* Light refraction in water */}
                    <div className="absolute inset-x-0 top-2 h-10 opacity-30">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={`refract-${i}`}
                          className="absolute bg-white blur-sm"
                          style={{
                            width: `${30 + Math.random() * 40}%`,
                            height: "2px",
                            left: `${Math.random() * 70}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.15 + Math.random() * 0.15,
                            transform: `rotate(${Math.random() * 20 - 10}deg)`,
                            animation: `waterShimmer ${
                              10 + Math.random() * 10
                            }s infinite linear`,
                          }}
                        ></div>
                      ))}
                    </div>

                    {/* Enhanced condensation and evaporation effects when not covered */}
                    {!hasLid && (
                      <>
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={`cond-${i}`}
                            className="absolute bg-gradient-to-b from-blue-100 to-blue-200 rounded-b-full"
                            style={{
                              width: `${1 + Math.random() * 2}px`,
                              height: `${2 + Math.random() * 4}px`,
                              left: `${Math.random() * 100}%`,
                              top: `-${3 + Math.random() * 5}px`,
                              opacity: 0.5 + Math.random() * 0.3,
                              animation: `condenseDrop ${
                                3 + Math.random() * 4
                              }s infinite ${Math.random() * 3}s`,
                            }}
                          />
                        ))}

                        {/* Steam/vapor effect */}
                        <div className="absolute inset-x-0 -top-6 h-6 pointer-events-none">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={`vapor-${i}`}
                              className="absolute rounded-full blur-sm"
                              style={{
                                width: `${3 + Math.random() * 4}px`,
                                height: `${3 + Math.random() * 4}px`,
                                left: `${10 + Math.random() * 80}%`,
                                bottom: `${Math.random() * 60}%`,
                                background: "rgba(255,255,255,0.7)",
                                opacity: 0.2 + Math.random() * 0.3,
                                animation: `rise ${
                                  3 + Math.random() * 4
                                }s infinite ${Math.random() * 3}s`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {temperature <= 0 && (
                  <>
                    {/* Enhanced ice crystalline structure pattern */}
                    <div
                      className="absolute inset-0 bg-contain bg-center opacity-25"
                      style={{
                        backgroundImage:
                          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path d="M5,5 L25,25 M25,5 L5,25 M15,2 L15,28 M2,15 L28,15" stroke="white" stroke-width="0.8" /></svg>\')',
                        mixBlendMode: "screen",
                      }}
                    ></div>

                    {/* Underwater ice details for depth */}
                    <div className="absolute inset-0 opacity-40">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={`bubble-${i}`}
                          className="absolute rounded-full bg-white blur-[0.5px]"
                          style={{
                            width: `${0.5 + Math.random() * 1}px`,
                            height: `${0.5 + Math.random() * 1}px`,
                            top: `${20 + Math.random() * 70}%`,
                            left: `${10 + Math.random() * 80}%`,
                            opacity: 0.3 + Math.random() * 0.4,
                            boxShadow: "0 0 2px 1px rgba(255,255,255,0.3)",
                          }}
                        />
                      ))}
                    </div>

                    {/* 3D Ice formations with improved depth and ultra-realistic textures */}
                    <div className="absolute inset-0 perspective-1000">
                      <div className="absolute inset-x-2 top-5 bottom-5 flex flex-wrap content-center justify-center gap-1">
                        {[...Array(15)].map((_, i) => {
                          const size = 6 + Math.random() * 10;
                          const angle = Math.random() * 40 - 20;
                          const depth = Math.random() * 30;
                          const opacity = 0.5 + Math.random() * 0.4;
                          const crystalType = Math.floor(Math.random() * 3); // Different crystal shapes

                          return (
                            <div
                              key={`ice-${i}`}
                              className="relative m-0.5"
                              style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                transform: `rotate(${angle}deg) translateZ(${depth}px)`,
                                transformStyle: "preserve-3d",
                                animation: `floatIce ${
                                  20 + Math.random() * 10
                                }s infinite ease-in-out alternate`,
                                animationDelay: `${Math.random() * -15}s`,
                              }}
                            >
                              {/* Main ice crystal with improved transparency and light effects */}
                              <div
                                className={`absolute inset-0 ${
                                  crystalType === 0
                                    ? "rounded-sm"
                                    : crystalType === 1
                                    ? "rounded"
                                    : "rounded-full"
                                }`}
                                style={{
                                  background: `linear-gradient(135deg, 
                      rgba(255,255,255,${opacity + 0.3}), 
                      rgba(220,240,255,${opacity + 0.1}), 
                      rgba(235,245,255,${opacity}))`,
                                  boxShadow: `
                      inset 1px 1px 3px rgba(255,255,255,1),
                      inset -1px -1px 2px rgba(210,230,255,0.7),
                      0 0 3px rgba(200,220,255,0.6)
                    `,
                                  backdropFilter: "blur(10px)",
                                }}
                              ></div>

                              {/* Advanced ice refraction highlights with dynamic animation */}
                              <div
                                className="absolute inset-0 opacity-90"
                                style={{
                                  background: `linear-gradient(${
                                    Math.random() * 360
                                  }deg, 
                      rgba(255,255,255,0) 20%, 
                      rgba(220,240,255,0.8) 35%, 
                      rgba(255,255,255,0) 50%)`,
                                  animation: `iceShimmer ${
                                    5 + Math.random() * 8
                                  }s infinite linear`,
                                  animationDelay: `${Math.random() * -8}s`,
                                  borderRadius:
                                    crystalType !== 0 ? "50%" : "2px",
                                }}
                              ></div>

                              {/* Realistic air bubble inclusions */}
                              {Math.random() > 0.4 && (
                                <div
                                  className="absolute rounded-full"
                                  style={{
                                    width: `${0.8 + Math.random() * 1.2}px`,
                                    height: `${0.8 + Math.random() * 1.2}px`,
                                    top: `${Math.random() * 80}%`,
                                    left: `${Math.random() * 80}%`,
                                    background: "rgba(255,255,255,0.9)",
                                    boxShadow:
                                      "0 0 1px 0.5px rgba(255,255,255,0.7)",
                                  }}
                                ></div>
                              )}

                              {/* Secondary small air bubble */}
                              {Math.random() > 0.7 && (
                                <div
                                  className="absolute rounded-full"
                                  style={{
                                    width: "1px",
                                    height: "1px",
                                    top: `${Math.random() * 80}%`,
                                    left: `${Math.random() * 80}%`,
                                    background: "white",
                                    boxShadow: "0 0 1px white",
                                  }}
                                ></div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Larger ice sheets with internal crystalline structure */}
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={`icemass-${i}`}
                          className="absolute"
                          style={{
                            width: `${30 + Math.random() * 20}px`,
                            height: `${15 + Math.random() * 12}px`,
                            left: `${5 + Math.random() * 70}%`,
                            top: `${15 + Math.random() * 50}%`,
                            background:
                              "linear-gradient(to bottom right, rgba(235,245,255,0.8), rgba(210,230,250,0.5))",
                            borderRadius: `${1 + Math.random() * 3}px`,
                            transform: `rotate(${
                              Math.random() * 180
                            }deg) translateZ(${Math.random() * 10}px)`,
                            boxShadow: "inset 0 0 10px rgba(255,255,255,0.7)",
                            opacity: 0.6 + Math.random() * 0.2,
                          }}
                        >
                          {/* Enhanced internal ice structure */}
                          <div className="absolute inset-0 overflow-hidden opacity-70">
                            {[...Array(4)].map((_, j) => (
                              <div
                                key={j}
                                className="absolute bg-white"
                                style={{
                                  height: "1px",
                                  width: "100%",
                                  left: 0,
                                  top: `${j * 25 + Math.random() * 10}%`,
                                  transform: `rotate(${
                                    Math.random() * 20 - 10
                                  }deg)`,
                                  opacity: 0.3 + Math.random() * 0.3,
                                }}
                              ></div>
                            ))}
                          </div>

                          {/* Crystalline highlights */}
                          <div
                            className="absolute inset-0 opacity-50"
                            style={{
                              background: `linear-gradient(${
                                Math.random() * 360
                              }deg, 
                  rgba(255,255,255,0) 60%, 
                  rgba(255,255,255,0.6) 80%, 
                  rgba(255,255,255,0) 100%)`,
                              animation: `iceShimmer ${
                                8 + Math.random() * 7
                              }s infinite linear`,
                              animationDelay: `${Math.random() * -5}s`,
                            }}
                          ></div>
                        </div>
                      ))}

                      {/* Jagged fracture lines with improved animation and depth */}
                      {temperature <= -5 &&
                        [...Array(7)].map((_, i) => (
                          <div
                            key={`fracture-${i}`}
                            className="absolute bg-white"
                            style={{
                              height: `${0.8 + (i % 3) * 0.4}px`,
                              width: `${25 + Math.random() * 55}%`,
                              left: `${Math.random() * 50}%`,
                              top: `${10 + Math.random() * 80}%`,
                              transform: `rotate(${
                                Math.random() * 180
                              }deg) translateZ(${5 + Math.random() * 10}px)`,
                              boxShadow: "0 0 4px rgba(255,255,255,0.6)",
                              opacity: 0.6 + Math.random() * 0.3,
                              animation: `iceCrack ${
                                6 + Math.random() * 6
                              }s infinite`,
                              animationDelay: `${Math.random() * -3}s`,
                            }}
                          ></div>
                        ))}
                    </div>
                  </>
                )}
                {/* Transition effect between states - subtle melt/freeze indicators */}
                {temperature > -2 && temperature < 2 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {temperature > 0
                      ? // Just starting to freeze - ice crystals forming
                        [...Array(10)].map((_, i) => (
                          <div
                            key={`crystal-${i}`}
                            className="absolute bg-white"
                            style={{
                              width: `${1 + Math.random() * 3}px`,
                              height: `${1 + Math.random() * 3}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: 0.5 + (0 - temperature) * 0.25,
                              boxShadow: "0 0 2px white",
                            }}
                          />
                        ))
                      : // Just starting to melt - water droplets forming
                        [...Array(8)].map((_, i) => (
                          <div
                            key={`melt-${i}`}
                            className="absolute bg-gradient-to-b from-blue-100 to-blue-200 rounded-full"
                            style={{
                              width: `${1 + Math.random() * 2}px`,
                              height: `${1 + Math.random() * 2}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: 0.6 + (temperature - -2) * 0.2,
                            }}
                          />
                        ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced stand/support for the container */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-4">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #a0a0a0, #808080)",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.4)",
                }}
              ></div>
            </div>

            {/* State indicator icon - enhanced with glow effect */}
            <div
              className="absolute top-2 right-2 bg-white rounded-full p-1.5 z-30"
              style={{
                boxShadow: `0 0 5px rgba(${
                  temperature <= 0 ? "150,200,255" : "100,180,255"
                }, 0.5)`,
              }}
            >
              {temperature <= 0 ? (
                <Snowflake
                  className="text-blue-500"
                  size={20}
                  style={{ filter: "drop-shadow(0 0 1px #3b82f6)" }}
                />
              ) : (
                <Droplet
                  className="text-blue-500"
                  size={20}
                  style={{ filter: "drop-shadow(0 0 1px #3b82f6)" }}
                />
              )}
            </div>
          </div>

          {/* Current measurements */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="text-lg font-bold text-blue-600">
                {temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-lg font-bold text-blue-600">
                {weight.toFixed(1)}g
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">State</p>
              <p className="text-lg font-bold text-blue-600">
                {getState(temperature).split(" ")[0]}
              </p>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes waterRipple {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }

          @keyframes frostGrow {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 0.7;
              transform: scale(1);
            }
          }

          @keyframes iceCrack {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.8;
            }
          }

          @keyframes iceShimmer {
            0% {
              background-position: -100% -100%;
            }
            100% {
              background-position: 200% 200%;
            }
          }
          .perspective-800 {
            perspective: 800px;
          }
          @keyframes waterRipple {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }

          @keyframes frostGrow {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 0.7;
              transform: scale(1);
            }
          }

          @keyframes iceCrack {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
        <style jsx>{`
          @keyframes waterRipple {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }

          @keyframes waterShimmer {
            0%,
            100% {
              opacity: 0.1;
            }
            50% {
              opacity: 0.3;
            }
          }

          @keyframes frostGrow {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 0.7;
              transform: scale(1);
            }
          }

          @keyframes iceCrack {
            0%,
            100% {
              opacity: 0.2;
              filter: blur(0px);
            }
            50% {
              opacity: 0.9;
              filter: blur(0.3px);
            }
          }

          @keyframes iceShimmer {
            0% {
              background-position: -100% -100%;
            }
            100% {
              background-position: 200% 200%;
            }
          }

          @keyframes condenseDrop {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.5;
            }
            50% {
              transform: translateY(1px);
              opacity: 0.8;
            }
          }

          @keyframes rise {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.3;
            }
            100% {
              transform: translateY(-10px) scale(1.5);
              opacity: 0;
            }
          }

          @keyframes floatIce {
            0% {
              transform: translateY(0px) rotate(var(--rotation))
                translateZ(var(--depth));
            }
            100% {
              transform: translateY(-2px) rotate(var(--rotation))
                translateZ(var(--depth));
            }
          }

          .perspective-800 {
            perspective: 800px;
          }

          .perspective-1000 {
            perspective: 1000px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LabysLabCoolingSubstances;

const ControlPanel = ({
  coolingRate,
  setCoolingRate,
  isRunning,
  setIsRunning,
  hasLid,
  setHasLid,
  resetSimulation,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 px-8 md:px-16 z-50 text-white p-3 rounded-lg shadow-lg flex flex-wrap justify-center items-center md:gap-10 gap-5">
        {/* Cooling Rate Slider - REMOVED disabled attribute */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Cooling Rate
          </span>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={coolingRate}
              onChange={(e) => setCoolingRate(parseInt(e.target.value))}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              // Removed the disabled attribute
            />
          </div>
          <span className="text-sm">{coolingRate}%</span>
        </div>

        {/* Container Lid toggle - still disabled when running */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">Container</span>
          <button
            onClick={() => !isRunning && setHasLid(!hasLid)}
            className={`w-10 h-5 rounded-full relative transition-all ${
              hasLid ? "bg-blue-500" : "bg-gray-500"
            } ${
              isRunning
                ? "opacity-60 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
            aria-label="Toggle container lid"
            disabled={isRunning}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                hasLid ? "left-6" : "left-1"
              }`}
            />
          </button>
          <span className="text-sm flex items-center gap-1">
            {hasLid ? (
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
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center justify-center px-4 py-2 rounded ${
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isRunning ? (
              <>
                <Pause size={18} className="mr-2" /> Pause
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" /> Start
              </>
            )}
          </button>
          <button
            onClick={resetSimulation}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const Lid = ({ hasLid }) => {
  return (
    <div className="absolute -top-3 w-full z-20">
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
  );
};
