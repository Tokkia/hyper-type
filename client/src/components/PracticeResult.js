import React from 'react';
import { MdReplay } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ ADD useLocation

export default function PracticeResult() { // ✅ REMOVE props
  const navigate = useNavigate();
  const location = useLocation(); // ✅ GET location
  const { wpm = 0, accuracy = 0 } = location.state || {}; // ✅ EXTRACT wpm and accuracy from state

  const handleRestart = () => {
    navigate('/typing');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-white">
      <div
        className="bg-overlay flex items-center justify-between px-16 py-10 rounded-xl transform -translate-y-[12%] mx-auto"
        style={{ width: '80vw', height: '25vh' }}
      >
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center text-7xl">
            <span role="img" aria-label="user">👤</span>
          </div>
          <div className="text-6xl font-semibold tracking-widest">username</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="uppercase text-lg text-gray-400">wpm</div>
          <div className="text-8xl font-bold">{wpm}</div> {/* ✅ Displays WPM */}
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="uppercase text-lg text-gray-400">accuracy</div>
          <div className="text-8xl font-bold">{accuracy}%</div> {/* ✅ Displays Accuracy */}
        </div>
      </div>

      <button onClick={handleRestart} className="mt-10 text-accentText hover:text-accent">
        <MdReplay className="text-4xl" />
      </button>
    </div>
  );
}