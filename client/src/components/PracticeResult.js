import React from 'react';
import { MdReplay } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function PracticeResult({ wpm = 0, accuracy = 0, time = 0 }) {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/typing'); // ✅ This ensures it routes correctly
  };

  return (
    <div className="flex flex-col items-center px-5 pt-32">
      <div className="text-4xl text-accentText font-bold mb-4">Practice Complete!</div>

      <div className="bg-overlay p-8 rounded-2xl text-center space-y-4">
        <div className="text-3xl text-accentText">Time: {time}s</div>
        <div className="text-3xl text-accentText">WPM: {wpm}</div>
        <div className="text-3xl text-accentText">Accuracy: {accuracy}%</div>
      </div>

      <button
        onClick={handleRestart}
        className="mt-6 px-6 py-2 hover:bg-gray-70"
      >
        <MdReplay className="items-center font-bold text-accentText text-3xl hover:text-accent" />
      </button>
    </div>
  );
}