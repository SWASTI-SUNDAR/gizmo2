import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFire,
  FaSnowflake,
  FaFlask,
  FaChartBar,
} from "react-icons/fa";
import { ExperimentContext } from "../context/Context";
function Navbar() {
  const location = useLocation();
  const { userResponse } = useContext(ExperimentContext);
  const [visitedPages, setVisitedPages] = useState({
    heating: false,
    mixing: false,
    cooling: false,
  });

  useEffect(() => {
    // Mark the current page as visited
    const pageMap = {
      "/heating": "heating",
      "/mixing": "mixing",
      "/cooling": "cooling",
    };

    if (pageMap[location.pathname]) {
      setVisitedPages((prev) => ({
        ...prev,
        [pageMap[location.pathname]]: true,
      }));
    }
  }, [location.pathname]);

  const allVisited =
    visitedPages.heating && visitedPages.mixing && visitedPages.cooling;
  // Check if all questions are answered (no zeros in userResponse)
  const allQuestionsAnswered = userResponse.every((response) => response !== 0);

  // Only enable Result page when all pages are visited AND all questions are answered
  const enableResultPage = allQuestionsAnswered;
  return (
    <nav className="fixed w-full z-10 px-4 sm:px-6 md:px-16 lg:px-28 mt-3">
      <div className="px-3 md:px-12 bg-gray-900 rounded-xl mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left Section */}
          <div className="flex gap-0 xl:gap-6 items-center text-white">
            <Link to="/" className="text-xl font-bold text-yellow-400">
              Laby's Labs : Matter Conservation Explorer
            </Link>
          </div>
          {/* Navigation Buttons */}
          <div
            className={`gap-2 ${location.pathname === "/" ? "hidden" : "flex"}`}
          >
            <NavButton to="/heating" icon={<FaFire />} label="Heating" />
            <NavButton to="/cooling" icon={<FaSnowflake />} label="Cooling" />
            <NavButton to="/mixing" icon={<FaFlask />} label="Mixing" />
            <NavButton
              to="/result"
              icon={<FaChartBar />}
              label="Result"
              disabled={!enableResultPage}
              tooltip={
                !enableResultPage ? "Answer all questions to view results" : ""
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Component for Nav Buttons
const NavButton = ({ to, icon, label, disabled, tooltip }) => {
  return (
    <div className="relative group">
      <Link
        to={disabled ? "#" : to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition 
          ${
            disabled
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
      >
        <span className="text-white text-lg">{icon}</span>
        <span className="text-white font-medium">{label}</span>
      </Link>
      {tooltip && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bottom-full  hidden group-hover:block">
          <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
