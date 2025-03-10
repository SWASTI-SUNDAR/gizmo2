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

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Add data point every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (stirringSpeed > 0) {
        setTime((prev) => prev + 5);

        // Add data point
        const newDataPoint = {
          time,
          properties: secondSubstanceAdded
            ? "Mixed solution with bubbles"
            : "Mixed solution",
          weight: 100 + (Math.random() * 0.2 - 0.1), // Small random fluctuation to simulate measurement
        };

        setData((prev) => [...prev, newDataPoint]);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [stirringSpeed, time, secondSubstanceAdded]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const bubbles = [];

    // Create initial particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - 50) + 100,
        radius: Math.random() * 3 + 1,
        color: "#3b82f6",
        vx: 0,
        vy: 0,
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw beaker
      ctx.beginPath();
      ctx.moveTo(50, 100);
      ctx.lineTo(50, 300);
      ctx.lineTo(250, 300);
      ctx.lineTo(250, 100);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw liquid base
      ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
      ctx.fillRect(50, 150, 200, 150);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Add stirring motion
        const centerX = 150;
        const centerY = 225;
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (stirringSpeed > 0 && distance < 80) {
          const angle = Math.atan2(dy, dx) + stirringSpeed / 50;
          p.x = centerX + Math.cos(angle) * distance;
          p.y = centerY + Math.sin(angle) * distance;

          // Gradually change color when second substance is added
          if (secondSubstanceAdded && p.color === "#3b82f6") {
            p.color = Math.random() > 0.5 ? "#3b82f6" : "#10b981";
          }
        }

        // Keep particles within beaker
        p.x = Math.max(52, Math.min(248, p.x));
        p.y = Math.max(152, Math.min(298, p.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Create and animate bubbles if second substance is added
      if (secondSubstanceAdded && showBubbles) {
        // Add new bubbles
        if (Math.random() < (0.1 * stirringSpeed) / 100) {
          bubbles.push({
            x: Math.random() * 180 + 60,
            y: 290,
            radius: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1,
          });
        }

        // Update and draw bubbles
        for (let i = 0; i < bubbles.length; i++) {
          const b = bubbles[i];
          b.y -= b.speed * (stirringSpeed / 50);

          // Remove bubbles that reach the top
          if (b.y < 155) {
            bubbles.splice(i, 1);
            i--;
            continue;
          }

          // Draw bubble
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.stroke();
        }
      }

      // Draw container seal if sealed
      if (containerSealed) {
        ctx.beginPath();
        ctx.moveTo(50, 100);
        ctx.lineTo(250, 100);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stirringSpeed, secondSubstanceAdded, containerSealed, showBubbles]);

  // Effect for showing bubbles after second substance is added
  useEffect(() => {
    if (secondSubstanceAdded) {
      setTimeout(() => setShowBubbles(true), 1000);
    } else {
      setShowBubbles(false);
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
    <div className="flex flex-col max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">
        Laby's Lab 3 - Mixing Substances
      </h1>
      <h2 className="text-xl text-center text-indigo-600 mb-6">
        Observing New Properties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel - Interactive controls */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Laboratory Controls</h3>

          {/* Stirring speed slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stirring Speed: {stirringSpeed}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={stirringSpeed}
              onChange={(e) => setStirringSpeed(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Second substance lever */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Second Substance
            </label>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle"
                checked={secondSubstanceAdded}
                onChange={handleLeverChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
            <span className="text-sm text-gray-700">
              {secondSubstanceAdded ? "Added" : "Not Added"}
            </span>
          </div>

          {/* Container seal button */}
          <div className="mb-6">
            <button
              onClick={() => setContainerSealed(!containerSealed)}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                containerSealed
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {containerSealed ? "Unseal Container" : "Seal Container"}
            </button>
          </div>

          {/* Reset button */}
          <div>
            <button
              onClick={resetExperiment}
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset Experiment
            </button>
          </div>
        </div>

        {/* Middle panel - Animation */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Mixing Simulation</h3>
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              width="300"
              height="350"
              className="mx-auto border-2 border-gray-200 rounded"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Time elapsed: {time} seconds</p>
            <p>
              State:{" "}
              {stirringSpeed === 0
                ? "Idle"
                : secondSubstanceAdded
                ? "Chemical reaction occurring"
                : "Mixing"}
            </p>
          </div>
        </div>

        {/* Right panel - Data */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Experiment Data</h3>

          {/* Data table */}
          <div className="overflow-auto mb-4 flex-grow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 tracking-wider">
                    Time (s)
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 tracking-wider">
                    Properties
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 tracking-wider">
                    Weight (g)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {entry.time}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {entry.properties}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {entry.weight.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-2 text-xs text-gray-500 text-center"
                    >
                      No data yet. Start stirring to begin experiment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Graph */}
          <div className="h-48 border border-gray-200 rounded p-2 relative">
            <h4 className="text-xs font-medium text-gray-500 mb-1">
              Weight vs. Time Graph
            </h4>
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

          <div className="mt-2 text-xs text-gray-600">
            <p>
              Observation: Weight remains constant despite reaction,
              demonstrating conservation of mass.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold">Instructions:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Adjust the stirring speed to mix the initial substance.</li>
          <li>
            Toggle the lever to add a second substance and observe the reaction.
          </li>
          <li>
            Use the seal button to observe that weight remains constant in a
            closed system.
          </li>
          <li>
            Study the data table and graph to analyze the properties and weight
            over time.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default MixingSubstancesLab;
