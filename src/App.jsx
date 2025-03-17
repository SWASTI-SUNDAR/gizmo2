import Navbar from "./components/PrimaryNav";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Result from "./pages/Result";
import HeatingSimulation from "./pages/Heating";
import LabysLabCoolingSubstances from "./pages/Cooling";
import MixingSubstancesLab from "./pages/Mixing";
function App() {
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/heating" element={<HeatingSimulation />} />
          <Route path="/mixing" element={<MixingSubstancesLab />} />
          <Route path="/cooling" element={<LabysLabCoolingSubstances />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
