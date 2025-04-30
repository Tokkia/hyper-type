import React from 'react';
import { calculateWpmAndAccuracy } from '../utils/calculateMetrics';

const WpmResults = ({ typedText, referenceText, durationInSeconds, username }) => {
  const { wpm, accuracy } = calculateWpmAndAccuracy(typedText, referenceText, durationInSeconds);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-2">👤</span>
          <h2 className="text-2xl font-bold">{username}</h2>
        </div>
        <div className="flex justify-around text-lg mt-4">
          <div>
            <p className="uppercase text-sm text-gray-400">wpm</p>
            <p className="text-3xl font-semibold">{wpm}</p>
          </div>
          <div>
            <p className="uppercase text-sm text-gray-400">accuracy</p>
            <p className="text-3xl font-semibold">{accuracy}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WpmResults;