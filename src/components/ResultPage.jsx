import React, { useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { ExperimentContext } from "../context/Context";

const ExperimentCard = ({ title, color, children }) => (
  <Card className="bg-white rounded-lg shadow-md">
    <CardHeader>
      <div className={`h-1 ${color} rounded-t-lg mb-2`} />
      <CardTitle className="text-gray-700 text-lg font-medium">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ParameterRow = ({ label, value }) => (
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

const ScienceSimulationUI = () => {
  const { heatingData, coolingData, mixingData } =
    useContext(ExperimentContext);
  // alert("Result Page");
  console.log(heatingData, coolingData, mixingData);
  // Get first recorded data point from each experiment
  const heatingEntry =
    heatingData && heatingData.length > 0 ? heatingData[0] : null;
  const coolingEntry =
    coolingData && coolingData.length > 0 ? coolingData[0] : null;
  const mixingEntry =
    mixingData && mixingData.length > 0 ? mixingData[0] : null;

  return (
    <div
      style={{ backgroundImage: "url(result-page-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom bg-cover pt-24 h-screen"
    >
      <div className="max-w-6xl relative h-full mx-auto">
        <img
          src="labby.png"
          className="absolute hidden md:block -bottom-12 h-[50vh] right-[1%] animate-[girl_3s_ease-in-out_infinite] girl duration-300 "
          alt=""
        />
        <div>
          <h1 className="text-xl font-bold text-center text-gray-800 mb-8">
            Labby's Lab Report
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <ExperimentCard title="Heating Experiment" color="bg-pink-500">
              <ParameterRow
                label="Temperature:"
                value={heatingEntry ? `${heatingEntry.temperature} °C` : "N/A"}
              />
              <ParameterRow
                label="Time:"
                value={heatingEntry ? `${heatingEntry.time} seconds` : "N/A"}
              />
              <ParameterRow
                label="Physical State:"
                value={heatingEntry ? heatingEntry.state : "N/A"}
              />
              <ParameterRow
                label="Weight:"
                value={heatingEntry ? `${heatingEntry.weight} g` : "N/A"}
              />
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard title="Cooling Experiment" color="bg-cyan-500">
              <ParameterRow
                label="Temperature:"
                value={coolingEntry ? `${coolingEntry.temperature} °C` : "N/A"}
              />
              <ParameterRow
                label="Time:"
                value={coolingEntry ? `${coolingEntry.time} seconds` : "N/A"}
              />
              <ParameterRow
                label="Physical State:"
                value={coolingEntry ? coolingEntry.state : "N/A"}
              />
              <ParameterRow
                label="Weight:"
                value={coolingEntry ? `${coolingEntry.weight} g` : "N/A"}
              />
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard title="Mixing Experiment" color="bg-orange-500">
              <ParameterRow
                label="Time:"
                value={mixingEntry ? `${mixingEntry.time} seconds` : "N/A"}
              />
              <ParameterRow
                label="Properties:"
                value={mixingEntry ? mixingEntry.properties : "N/A"}
              />
              <ParameterRow
                label="Weight:"
                value={
                  mixingEntry ? `${mixingEntry.weight.toFixed(2)} g` : "N/A"
                }
              />
            </ExperimentCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScienceSimulationUI;
