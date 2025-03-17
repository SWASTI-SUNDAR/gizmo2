import React, { useContext } from "react";
import ResultPage from "../components/ResultPage";
import { ExperimentContext } from "../context/Context";

function Result() {
  const { heatingData, coolingData, mixingData } =
    useContext(ExperimentContext);

  const recordedData = {
    heatingData,
    coolingData,
    mixingData,
  };

  return (
    <div>
      <ResultPage recordedData={recordedData} />
    </div>
  );
}

export default Result;
