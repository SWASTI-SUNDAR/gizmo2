import React, { useState, useEffect, useRef } from "react";

const MixingSubstancesLab = () => {
  // State variables
  const [stirringSpeed, setStirringSpeed] = useState(0);
  const [secondSubstanceAdded, setSecondSubstanceAdded] = useState(false);
  const [containerSealed, setContainerSealed] = useState(false);
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [particleColor, setParticleColor] = useState("#3b82f6"); // blue
  const [showBubbles, setShowBubbles] = useState(false);

  // Add this state to your main component
  const [activeTab, setActiveTab] = useState(null);

  // Tab rendering component
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    // Check if there's data to display in tables/graphs
    if ((tab === "table" || tab === "graph") && data.length === 0) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Start stirring to see results.
        </div>
      );
    }

    switch (tab) {
      case "description":
        return (
          <div className="bg-white max-h-80 p-3 rounded-lg overflow-y-scroll shadow-lg">
            <h2 className="text-xl font-semibold mb-3">
              Mixing Substances Simulation
            </h2>
            <p className="mb-2">
              This simulation demonstrates how substances mix together and how
              chemical reactions can produce observable changes while
              maintaining conservation of mass.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Key Concepts:</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    When substances mix, they can form new compounds with
                    different properties
                  </li>
                  <li>Stirring increases the rate at which substances mix</li>
                  <li>
                    Chemical reactions may produce observable changes (color,
                    bubbles, temperature)
                  </li>
                  <li>
                    In a sealed container, even with gas production, total mass
                    remains constant
                  </li>
                  <li>
                    Weight measurements demonstrate the law of conservation of
                    mass
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg">Experiment Variables:</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    <span className="font-medium">Stirring Speed:</span>{" "}
                    Controls how quickly the substances mix
                  </li>
                  <li>
                    <span className="font-medium">Second Substance:</span>{" "}
                    Triggers a chemical reaction when added
                  </li>
                  <li>
                    <span className="font-medium">Container Seal:</span>{" "}
                    Demonstrates conservation of mass
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Experiment Data</h2>
            <div className="max-h-80 overflow-y-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Time (s)
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Properties
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Weight (g)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((entry, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {entry.time}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {entry.properties}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {entry.weight.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-3 py-2 text-sm text-gray-500 text-center"
                      >
                        No data yet. Start stirring to begin experiment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "graph":
        return (
          <div className="bg-white p-2 max-h-80 rounded-lg shadow-lg">
            <h2 className="text-md font-semibold mb-1">Weight Over Time</h2>
            <div className="h-64 relative">
              <div className="absolute left-0 top-6 bottom-0 w-8 flex flex-col items-center justify-between text-xs text-gray-500">
                <span>100.2</span>
                <span>100.1</span>
                <span>100.0</span>
                <span>99.9</span>
                <span>99.8</span>
              </div>
              <div className="ml-8 h-full relative">
                {/* Horizontal grid lines */}
                <div className="absolute w-full h-full">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-t border-gray-200"
                      style={{ top: `${i * 25}%` }}
                    ></div>
                  ))}
                </div>

                {/* Plot points */}
                {data.map((entry, index) => (
                  <div
                    key={index}
                    className="absolute w-2 h-2 bg-blue-500 rounded-full"
                    style={{
                      left: `${Math.min(
                        100,
                        (entry.time /
                          (Math.max(...data.map((d) => d.time)) || 1)) *
                          100
                      )}%`,
                      bottom: `${((entry.weight - 99.8) / 0.4) * 100}%`,
                      transform: "translate(-50%, 50%)",
                    }}
                  ></div>
                ))}

                {/* Connect points with lines */}
                {data.length > 1 &&
                  data.map((entry, index) => {
                    if (index === 0) return null;
                    const prevEntry = data[index - 1];
                    const maxTime = Math.max(...data.map((d) => d.time)) || 1;

                    const x1 = (prevEntry.time / maxTime) * 100;
                    const x2 = (entry.time / maxTime) * 100;
                    const y1 = ((prevEntry.weight - 99.8) / 0.4) * 100;
                    const y2 = ((entry.weight - 99.8) / 0.4) * 100;

                    return (
                      <svg
                        key={`line-${index}`}
                        className="absolute inset-0 h-full w-full overflow-visible"
                      >
                        <line
                          x1={`${x1}%`}
                          y1={`${100 - y1}%`}
                          x2={`${x2}%`}
                          y2={`${100 - y2}%`}
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                        />
                      </svg>
                    );
                  })}

                {data.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 text-xs text-gray-500 flex justify-between">
                    <span>0</span>
                    <span>{Math.max(...data.map((d) => d.time))}</span>
                  </div>
                )}

                {data.length === 0 && (
                  <div className="h-full flex items-center justify-center text-xs text-gray-500">
                    No data to display
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              <p>
                <span className="font-medium">Observation:</span> The flat line
                shows weight remains constant throughout the experiment,
                demonstrating conservation of mass even during chemical
                reactions.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  useEffect(() => {
    if (stirringSpeed <= 0) return;

    const timer = setInterval(() => {
      if (stirringSpeed > 0) {
        setTime((prev) => prev + 5);

        // Add data point
        const newDataPoint = {
          time,
          properties: secondSubstanceAdded
            ? "Mixed solution with bubbles"
            : "Mixed solution",
          weight: containerSealed
            ? 100 + (Math.random() * 0.2 - 0.1) // Small random fluctuation if sealed
            : secondSubstanceAdded // Weight loss if unsealed with gas production
            ? 100 - (time / 600) * (Math.random() * 0.1 + 0.1)
            : 100, // No weight loss if just mixing
        };

        setData((prev) => [...prev, newDataPoint]);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [stirringSpeed, time, secondSubstanceAdded, containerSealed]);

  // Effect for showing bubbles after second substance is added
  useEffect(() => {
    if (secondSubstanceAdded) {
      setTimeout(() => setShowBubbles(true), 1000);
    } else {
      setShowBubbles(false);
    }
  }, [secondSubstanceAdded]);

  // Effect to update particle color when second substance is added
  useEffect(() => {
    if (secondSubstanceAdded) {
      setParticleColor("#10b981"); // Green
    } else {
      setParticleColor("#3b82f6"); // Blue
    }
  }, [secondSubstanceAdded]);





  // Handle second substance lever
  const handleLeverChange = (e) => {
    setSecondSubstanceAdded(e.target.checked);
  };

  // Reset experiment
  const resetExperiment = () => {
    setStirringSpeed(0);
    setSecondSubstanceAdded(false);
    setContainerSealed(false);
    setTime(0);
    setData([]);
    setShowBubbles(false);
  };

  return (
    <div
      style={{ backgroundImage: "url(page-three-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom bg-cover h-screen "
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/* Control panel */}
          <ControlPanel
            stirringSpeed={stirringSpeed}
            setStirringSpeed={setStirringSpeed}
            secondSubstanceAdded={secondSubstanceAdded}
            handleLeverChange={handleLeverChange}
            containerSealed={containerSealed}
            setContainerSealed={setContainerSealed}
            resetExperiment={resetExperiment}
          />
          {/* Tab panel */}
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
        {/* Use our CSS-based container instead */}
        <div className="absolute left-0 right-0 mx-auto max-w-lg bottom-32 overflow-visible">
          <div className="relative h-80 w-64 mx-auto">
            {/* Laboratory Container */}
            <div className="relative h-full w-full mx-auto">
              {/* Glass beaker */}
              <div
                className="absolute left-0 right-0 mx-auto w-56 h-72 rounded-b-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(230,240,255,0.4), rgba(255,255,255,0.5) 30%, rgba(230,240,255,0.3) 50%, rgba(255,255,255,0.4) 70%, rgba(230,240,255,0.4))",
                  boxShadow:
                    "0 0 15px rgba(0,0,0,0.15), inset 0 0 30px rgba(255,255,255,0.25)",
                  border: "1px solid rgba(200,210,220,0.5)",
                }}
              >
                {/* Glass reflections */}
                <div className="absolute top-5 left-6 w-1 h-40 bg-white opacity-50 rounded-full"></div>
                <div className="absolute top-10 left-14 w-0.5 h-20 bg-white opacity-40 rounded-full"></div>
                {/* Measurement markings */}
                <div className="absolute left-2 inset-y-0 flex flex-col justify-between py-10">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-0.5 bg-black opacity-40"></div>
                      <div className="text-xs text-gray-600 ml-1 opacity-60">
                        {(5 - i) * 20}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Container seal if sealed */}
                {containerSealed && <ContainerLid isSealed={containerSealed} />}
                {/* Water content */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-1000 rounded-b-lg overflow-hidden"
                  style={{
                    height: "80%",
                    backgroundColor: !secondSubstanceAdded
                      ? "rgba(210, 235, 255, 0.75)" // Clear water
                      : secondSubstanceAdded && stirringSpeed === 0
                      ? "rgba(210, 235, 255, 0.75)" // Still clear water when powder just added
                      : stirringSpeed > 0
                      ? `rgba(${
                          secondSubstanceAdded
                            ? `16, ${185 - stirringSpeed * 0.7}, 129` // Green transition based on stirring
                            : `59, 130, 246`
                        }, ${0.3 + (stirringSpeed / 100) * 0.4})`
                      : "rgba(59, 130, 246, 0.3)",
                    transition: "background-color 2s, opacity 2s",
                  }}
                >
                  {/* Surface reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white opacity-30"></div>

                  {/* Second substance powder (added but not stirred) */}
                  {secondSubstanceAdded && stirringSpeed === 0 && (
                    <div className="absolute top-0 left-0 right-0">
                      <div className="relative h-6 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-12">
                          {/* Powder layer */}
                          <div className="absolute top-0 left-0 right-0 h-3 bg-orange-600 opacity-40"></div>

                          {/* Powder particles */}
                          {[...Array(80)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute rounded-full bg-orange-500"
                              style={{
                                width: `${0.8 + Math.random() * 2}px`,
                                height: `${0.8 + Math.random() * 2}px`,
                                top: `${Math.random() * 6}px`,
                                left: `${Math.random() * 100}%`,
                                opacity: 0.8 + Math.random() * 0.2,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dissolving powder during stirring - Only when second substance is added */}
                  {secondSubstanceAdded && stirringSpeed > 0 && (
                    <>
                      {/* Animated powder particles - more particles at lower speeds, fewer at high speeds */}
                      {[
                        ...Array(
                          Math.max(5, Math.floor(60 - stirringSpeed / 2))
                        ),
                      ].map((_, i) => {
                        // Calculate opacity based on stirring speed - particles get more transparent as stirring increases
                        const particleOpacity = Math.max(
                          0.1,
                          0.9 -
                            (stirringSpeed / 100) * (0.7 + Math.random() * 0.3)
                        );

                        // Calculate size - particles get smaller as they dissolve
                        const particleSize = Math.max(
                          0.5,
                          2 - stirringSpeed / 100
                        );

                        // More distributed as stirring increases
                        const topPosition =
                          stirringSpeed < 30
                            ? Math.random() * 30 // Near top at low speeds
                            : Math.random() * Math.min(80, stirringSpeed); // Spread out at higher speeds

                        return (
                          <div
                            key={i}
                            className="absolute rounded-full dissolving-particle"
                            style={{
                              backgroundColor: "rgb(234, 88, 12)", // Orange powder
                              width: `${particleSize + Math.random()}px`,
                              height: `${particleSize + Math.random()}px`,
                              top: `${topPosition}%`,
                              left: `${5 + Math.random() * 90}%`,
                              opacity: particleOpacity,
                              animation: `floatParticle ${
                                3 + Math.random() * 4
                              }s infinite alternate`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          ></div>
                        );
                      })}

                      {/* Transition color trail - shows the gradient of mixing */}
                      {stirringSpeed > 10 && (
                        <div
                          className="absolute inset-0 mix-color-transition"
                          style={{
                            background: secondSubstanceAdded
                              ? `linear-gradient(${
                                  (360 + stirringSpeed * 3.6) % 360
                                }deg, 
                rgba(16, 185, 129, ${0.1 + stirringSpeed / 300}) 0%, 
                rgba(16, 185, 129, ${0.2 + stirringSpeed / 200}) ${
                                  20 + stirringSpeed / 2
                                }%, 
                rgba(210, 235, 255, 0.1) 100%)`
                              : `linear-gradient(${
                                  (360 + stirringSpeed * 3.6) % 360
                                }deg, 
                rgba(59, 130, 246, 0.3) 0%, 
                rgba(59, 130, 246, 0.1) 100%)`,
                            opacity: Math.min(0.7, stirringSpeed / 100),
                          }}
                        ></div>
                      )}
                    </>
                  )}

                  {/* Base swirl animation */}
                  {stirringSpeed > 0 && (
                    <>
                      {/* Dynamic swirl pattern based on stirring speed */}
                      <div
                        className="absolute inset-0 opacity-40 swirl-animation"
                        style={{
                          background: `conic-gradient(
            from ${(stirringSpeed * 3.6) % 360}deg at 50% 50%, 
            transparent 0deg, 
            rgba(255,255,255,${0.3 + stirringSpeed / 200}) ${
                            70 + stirringSpeed / 3
                          }deg, 
            transparent ${140 + stirringSpeed / 5}deg, 
            rgba(255,255,255,${0.2 + stirringSpeed / 300}) ${
                            240 + stirringSpeed / 4
                          }deg, 
            transparent 360deg)`,
                          animationDuration:
                            stirringSpeed > 0
                              ? `${10000 / stirringSpeed}ms`
                              : "0ms",
                          opacity: stirringSpeed / 300,
                          transform: `scale(${1 + stirringSpeed / 200})`,
                        }}
                      ></div>

                      {/* Stirring rod visualization */}
                      {stirringSpeed > 0 && (
                        <div
                          className="stirring-rod absolute"
                          style={{
                            width: "4px",
                            height: "40%",
                            backgroundColor: "rgba(220, 220, 220, 0.8)",
                            top: "5%",
                            left: "50%",
                            transformOrigin: "bottom center",
                            animation: `stirRod ${Math.max(
                              0.5,
                              5 - stirringSpeed / 20
                            )}s infinite linear`,
                            boxShadow: "0 0 3px rgba(255,255,255,0.5)",
                            borderRadius: "2px",
                            zIndex: 10,
                          }}
                        ></div>
                      )}

                      {/* Small circular ripples from stirring */}
                      {[
                        ...Array(Math.min(10, Math.floor(stirringSpeed / 10))),
                      ].map((_, i) => (
                        <div
                          key={`ripple-${i}`}
                          className="absolute rounded-full ripple"
                          style={{
                            width: `${10 + i * 5}px`,
                            height: `${10 + i * 5}px`,
                            border: "1px solid rgba(255,255,255,0.3)",
                            left: `calc(50% - ${5 + i * 2.5}px)`,
                            top: `calc(50% - ${5 + i * 2.5}px)`,
                            animation: `expandRipple ${
                              1 + Math.random()
                            }s infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        ></div>
                      ))}
                    </>
                  )}

                  {/* Bubbles when second substance is added */}
                  {secondSubstanceAdded && stirringSpeed > 0 && (
                    <>
                      {[
                        ...Array(
                          Math.min(
                            20,
                            Math.max(5, Math.floor(stirringSpeed / 10))
                          )
                        ),
                      ].map((_, i) => (
                        <div
                          key={i}
                          className="bubble"
                          style={{
                            width: `${1 + Math.random() * 2.5}px`,
                            height: `${1 + Math.random() * 2.5}px`,
                            left: `${5 + Math.random() * 90}%`,
                            animationDuration: `${
                              4 - stirringSpeed / 50 + Math.random()
                            }s`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        ></div>
                      ))}
                    </>
                  )}

                  {/* Water turbulence effect - increases with stirring speed */}
                  {stirringSpeed > 30 && (
                    <div
                      className="absolute inset-0 water-turbulence"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        opacity: Math.min(0.5, stirringSpeed / 100),
                        animation: `turbulence ${
                          5 - stirringSpeed / 25
                        }s infinite linear`,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Static keyframes instead of dynamic ones */}
          <style jsx global>{`
            .swirl-animation {
              animation-name: rotate;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }

            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .bubble {
              position: absolute;
              background-color: white;
              border-radius: 50%;
              bottom: 0;
              opacity: 0.7;
              animation-name: rise;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
            }

            @keyframes rise {
              0% {
                transform: translateY(0) translateX(0);
                opacity: 0.7;
                bottom: 0;
              }
              50% {
                transform: translateX(5px);
                opacity: 0.9;
                bottom: 50%;
              }
              99% {
                opacity: 0.3;
              }
              100% {
                transform: translateY(0);
                opacity: 0;
                bottom: 100%;
              }
            }
          `}</style>
          <style jsx global>{`
            .swirl-animation {
              animation-name: rotate;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }

            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .bubble {
              position: absolute;
              background-color: white;
              border-radius: 50%;
              bottom: 0;
              opacity: 0.7;
              animation-name: rise;
              animation-iteration-count: infinite;
              animation-timing-function: ease-out;
            }

            @keyframes rise {
              0% {
                transform: translateY(0) translateX(0);
                opacity: 0.7;
                bottom: 0;
              }
              50% {
                transform: translateX(5px);
                opacity: 0.9;
                bottom: 50%;
              }
              90% {
                opacity: 0.4;
              }
              100% {
                transform: translateY(0);
                opacity: 0;
                bottom: 100%;
              }
            }

            @keyframes floatParticle {
              0% {
                transform: translateY(0) translateX(0);
              }
              50% {
                transform: translateY(-3px) translateX(2px);
              }
              100% {
                transform: translateY(2px) translateX(-2px);
              }
            }

            @keyframes expandRipple {
              0% {
                transform: scale(0.8);
                opacity: 0.7;
              }
              100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }

            @keyframes stirRod {
              0% {
                transform: translateX(-50%) rotate(0deg);
              }
              25% {
                transform: translateX(-30%) rotate(25deg);
              }
              50% {
                transform: translateX(-50%) rotate(0deg);
              }
              75% {
                transform: translateX(-70%) rotate(-25deg);
              }
              100% {
                transform: translateX(-50%) rotate(0deg);
              }
            }

            @keyframes turbulence {
              0% {
                background-position: 0% 0%;
              }
              100% {
                background-position: 100% 100%;
              }
            }

            .dissolving-particle {
              transition: opacity 0.5s, width 1s, height 1s;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default MixingSubstancesLab;

// Control Panel Component
const ControlPanel = ({
  stirringSpeed,
  setStirringSpeed,
  secondSubstanceAdded,
  handleLeverChange,
  containerSealed,
  setContainerSealed,
  resetExperiment,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 px-8 md:px-16 z-50 text-white p-3 rounded-lg shadow-lg flex flex-wrap justify-center items-center md:gap-10 gap-5">
        {/* Stirring Speed Slider */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Stirring Speed
          </span>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={stirringSpeed}
              onChange={(e) => setStirringSpeed(parseInt(e.target.value))}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <span className="text-sm">{stirringSpeed}%</span>
        </div>

        {/* Second Substance Toggle */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Second Substance
          </span>
          <button
            onClick={() =>
              handleLeverChange({ target: { checked: !secondSubstanceAdded } })
            }
            className={`w-10 h-5 rounded-full relative transition-all ${
              secondSubstanceAdded ? "bg-green-500" : "bg-gray-500"
            }`}
            aria-label="Add second substance"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                secondSubstanceAdded ? "left-6" : "left-1"
              }`}
            />
          </button>
          <span className="text-sm flex items-center gap-1">
            {secondSubstanceAdded ? (
              <>
                <span className="block w-2 h-2 bg-green-500 rounded-full"></span>{" "}
                Added
              </>
            ) : (
              <>
                <span className="block w-2 h-2 bg-gray-500 rounded-full"></span>{" "}
                Not Added
              </>
            )}
          </span>
        </div>

        {/* Container Seal Toggle */}
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">Container</span>
          <button
            onClick={() => setContainerSealed(!containerSealed)}
            className={`w-10 h-5 rounded-full relative transition-all ${
              containerSealed ? "bg-blue-500" : "bg-gray-500"
            }`}
            aria-label="Toggle container seal"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                containerSealed ? "left-6" : "left-1"
              }`}
            />
          </button>
          <span className="text-sm flex items-center gap-1">
            {containerSealed ? (
              <>
                <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>{" "}
                Sealed
              </>
            ) : (
              <>
                <span className="block w-2 h-2 bg-gray-500 rounded-full"></span>{" "}
                Open
              </>
            )}
          </span>
        </div>

        {/* Reset Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={resetExperiment}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const ContainerLid = ({ isSealed }) => {
  if (!isSealed) return null;

  return (
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
  );
};