import React from 'react';
import { MdReplay } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";

export default function PracticeResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract from location.state (not props!)
  const { wpm = 0, accuracy = 0, time = 0 } = location.state || {};

  const username = localStorage.getItem('username') || 'Guest';

  const handleRestart = () => {
    navigate('/typing');
  };

  return (
    <div className="p-8 md:mt-24 lg:mt-40 flex flex-col items-center">
      <div className="bg-overlay flex md:flex-col md:gap-12 lg:flex-row rounded-2xl md:h-[50vh] lg:h-[30vh] w-[90vw] mx-auto items-center justify-center mb-6">
        <div className="flex items-center gap-4 text-accent">
            <FaRegUser className="text-[8rem] font-bold"/>
            <h2 className="text-4xl font-bold text-accentText">{username}</h2>
        </div>
        <div className="flex md:ml-12 lg:ml-32 gap-8 sm:gap-10 md:gap-14 lg:gap-20 mb-4">
          <div>
              <p className="font-bold text-4xl text-accent mb-3">wpm</p>
              <p className="text-5xl font-bold text-accentText">{wpm}</p>
          </div>
          <div>
              <p className="font-bold text-4xl text-accent mb-3">accuracy</p>
              <p className="text-5xl font-bold text-accentText">{accuracy}%</p>
          </div>
        </div>
      </div>

      <button onClick={handleRestart} className="mt-10 text-accentText hover:text-accent">
        <MdReplay className="text-4xl" />
      </button>
    </div>
  );
}
