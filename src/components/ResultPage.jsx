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
            <ExperimentCard title="Heating" color="bg-pink-500">
              <ParameterRow
                label="Initial Temperature:"
                value={(heatingData && heatingData[0]?.initialTemp) || "25 °C"}
              />
              <ParameterRow
                label="Final Temperature:"
                value={(heatingData && heatingData[0]?.finalTemp) || "100 °C"}
              />
              <ParameterRow
                label="Heating Duration:"
                value={(heatingData && heatingData[0]?.duration) || "5 min"}
              />
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard title="Cooling" color="bg-cyan-500">
              <ParameterRow
                label="Initial Temperature"
                value={(coolingData && coolingData[0]?.initialTemp) || "100 °C"}
              />
              <ParameterRow
                label="Final Temperature"
                value={(coolingData && coolingData[0]?.finalTemp) || "25 °C"}
              />
              <ParameterRow
                label="Cooling Rate"
                value={(coolingData && coolingData[0]?.rate) || "15 °C/min"}
              />
            </ExperimentCard>
          </div>
          <div className="col-span-1">
            <ExperimentCard title="Mixing" color="bg-orange-500">
              <ParameterRow
                label="Substance A"
                value={(mixingData && mixingData[0]?.substanceA) || "Water"}
              />
              <ParameterRow
                label="Substance B"
                value={(mixingData && mixingData[0]?.substanceB) || "oil"}
              />
              <ParameterRow
                label="Reaction Time"
                value={(mixingData && mixingData[0]?.reactionTime) || "30 sec"}
              />
            </ExperimentCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScienceSimulationUI;
