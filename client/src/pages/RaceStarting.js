import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

export default function RaceStarting({userID}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, []);

  const startRace = () => {
    navigate('/race', { state: { difficulty } });
  };

  return (
    <div className="mt-64 flex-col lg:flex-row justify-center flex h-[25vh] gap-12 px-12">
      {/* User vs Bot Box */}
      <div className="bg-overlay lg:w-[40vw] h-auto lg:h-[30vh] rounded-2xl flex flex-col justify-center text-left text-7xl font-bold gap-12 px-10 py-12 lg:px-24">
        <div className="flex flex-row items gap-8">
          <FaRegUser />
          {isLoggedIn && <h className="mt-2 text-2xl text-accentText">{username}</h>}
        </div>
        <div className="flex flex-row items gap-8">
          <RiRobot2Line />
          <h className="mt-2 text-2xl text-accentText">bot</h>
        </div>
      </div>

      {/* Options Box */}
      <div className="h-auto lg:h-[30vh] flex flex-col w-[80] gap-10">
        {/* Difficulty Selection */}
        <div className="bg-overlay text-md w-8rem h-[6vh] rounded-2xl px-8 flex items-center gap-10 py-1">
          <p className="text-accentText mr-10">difficulty</p>
          {['easy', 'medium', 'hard'].map((label) => (
            <button
              key={label}
              onClick={() => setDifficulty(label)}
              className={`hover:text-accent ${
                difficulty === label ? 'text-accent' : 'text-accentText'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Word Count Selection */}
        <div className="bg-overlay mb-6 text-md w-8rem h-[6vh] rounded-2xl px-8 flex items-center gap-10 py-1">
          <p className="text-accentText mr-24">words</p>
          {[15, 30, 60].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`mr-6 hover:text-accent ${
                selectedTime === time ? 'text-accent' : 'text-accentText'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Start Button */}
        <div className="bg-accent text-md w-8rem h-[6vh] rounded-2xl px-8 flex items-center justify-center gap-10 py-1">
          <button
            onClick={startRace}
            className="text-background font-bold hover:overlay"
          >
            start race!
          </button>
        </div>
      </div>
    </div>
  );
}