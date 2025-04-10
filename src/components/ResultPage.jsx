import React, { useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { ExperimentContext } from "../context/Context";
const ScoreCard = () => {
  const { userResponse } = useContext(ExperimentContext);

  // Calculate scores directly from the userResponse array
  // Gas questions: indices 0-2
  const heatingQuizResults = userResponse
    .slice(0, 3)
    .filter((response) => response === 1).length;
  const gasTotal = 3;

  // Evaporation questions: indices 3-5
  const coolingQuizResults = userResponse
    .slice(3, 6)
    .filter((response) => response === 1).length;
  const evaporationTotal = 3;

  // Dissolving questions: indices 6-8
  const mixingQuizResults = userResponse
    .slice(6, 9)
    .filter((response) => response === 1).length;
  const dissolvingTotal = 3;

  // Calculate unattempted questions
  const unattempted = userResponse.filter((response) => response === 0).length;

  // Calculate total percentage
  const totalScore =
    heatingQuizResults + coolingQuizResults + mixingQuizResults;
  const totalQuestions = userResponse.length;
  const totalPercentage =
    totalQuestions > 0
      ? Math.round((totalScore / (totalQuestions - unattempted)) * 100)
      : 0;
  useEffect(() => {
    console.log("User Response Array:", userResponse);
    console.log("Total Percentage", totalPercentage);
  }, [userResponse]);
  return (
    <div className="w-96 mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">Your score</h2>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Gases</span>
          <span className="text-black font-medium">
            {heatingQuizResults}/{gasTotal}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Evaporation</span>
          <span className="text-black font-medium">
            {coolingQuizResults}/{evaporationTotal}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Dissolving Solids</span>
          <span className="text-black font-medium">
            {mixingQuizResults}/{dissolvingTotal}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t mt-4">
          <span className="text-sky-600 font-semibold">Total</span>
          <span className="text-sky-600 font-semibold">{totalPercentage}%</span>
        </div>

        {unattempted > 0 && (
          <div className="flex justify-between pt-2 text-amber-600">
            <span>Unattempted questions:</span>
            <span>{unattempted}</span>
          </div>
        )}
      </div>
    </div>
  );
};
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

// New component for quiz results section
const QuizResultsCard = ({ title, color, results }) => {
  if (!results || results.length === 0) return null;

  const correctAnswers = results.filter((result) => result === true).length;
  const totalQuestions = results.length;
  const score = (correctAnswers / totalQuestions) * 100;

  return (
    <Card className="bg-white rounded-lg shadow-md mt-3">
      <CardHeader className="py-3">
        <div className={`h-1 ${color} rounded-t-lg mb-1`} />
        <CardTitle className="text-gray-700 text-base font-medium">
          {title} Quiz Results
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Score:</span>
          <span className="text-gray-800 font-medium">
            {correctAnswers} / {totalQuestions} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              score >= 70
                ? "bg-green-500"
                : score >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span
            className={`text-sm font-medium ${
              score >= 70
                ? "text-green-500"
                : score >= 40
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {score.toFixed(0)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const ScienceSimulationUI = () => {
  const {
    heatingData,
    coolingData,
    mixingData,
    heatingQuizResults,
    coolingQuizResults,
    mixingQuizResults,
  } = useContext(ExperimentContext);

  // Remove alert to avoid annoying the user
  console.log(heatingData, coolingData, mixingData);
  console.log(
    "Quiz results:",
    heatingQuizResults,
    coolingQuizResults,
    mixingQuizResults
  );

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
      className="w-full bg-no-repeat bg-bottom bg-cover pt-24 h-screen overflow-hidden"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-7">
          <div className="col-span-1">
            <ExperimentCard title="Heating Experiment" color="bg-pink-500">
              <ParameterRow
                label="Temperature:"
                value={
                  heatingEntry ? `${heatingEntry.temperature} °C` : "25 °C"
                }
              />
              <ParameterRow
                label="Time:"
                value={
                  heatingEntry ? `${heatingEntry.time} seconds` : "60 seconds"
                }
              />
              <ParameterRow
                label="Physical State:"
                value={heatingEntry ? heatingEntry.state : "Solid"}
              />
              <ParameterRow
                label="Weight:"
                value={heatingEntry ? `${heatingEntry.weight} g` : "100 g"}
              />
              {mixingEntry && mixingEntry.containerState && (
                <ParameterRow
                  label="Container:"
                  value={
                    heatingEntry
                      ? heatingEntry.containerState || "Sealed"
                      : "Sealed"
                  }
                />
              )}
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard title="Cooling Experiment" color="bg-cyan-500">
              <ParameterRow
                label="Temperature:"
                value={
                  coolingEntry ? `${coolingEntry.temperature} °C` : "15 °C"
                }
              />
              <ParameterRow
                label="Time:"
                value={
                  coolingEntry ? `${coolingEntry.time} seconds` : "90 seconds"
                }
              />
              <ParameterRow
                label="Physical State:"
                value={coolingEntry ? coolingEntry.state : "Liquid"}
              />
              <ParameterRow
                label="Weight:"
                value={coolingEntry ? `${coolingEntry.weight} g` : "100 g"}
              />
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard title="Mixing Experiment" color="bg-orange-500">
              <ParameterRow
                label="Time:"
                value={
                  mixingEntry ? `${mixingEntry.time} seconds` : "45 seconds"
                }
              />
              <ParameterRow
                label="Properties:"
                value={mixingEntry ? mixingEntry.properties : "Mixed solution"}
              />
              <ParameterRow
                label="Weight:"
                value={
                  mixingEntry ? `${mixingEntry.weight.toFixed(2)} g` : "99.8 g"
                }
              />
              {mixingEntry && mixingEntry.containerState && (
                <ParameterRow
                  label="Container:"
                  value={
                    mixingEntry ? mixingEntry.containerState || "Open" : "Open"
                  }
                />
              )}
            </ExperimentCard>
            <QuizResultsCard
              title="Mixing"
              color="bg-orange-500"
              results={mixingQuizResults}
            />
          </div>
        </div>
        <div className="md:col-span-3 w-full flex justify-center">
          <ScoreCard
            heatingQuizResults={heatingQuizResults}
            coolingQuizResults={coolingQuizResults}
            mixingQuizResults={mixingQuizResults}
          />
        </div>
      </div>
    </div>
  );
};

export default ScienceSimulationUI;
