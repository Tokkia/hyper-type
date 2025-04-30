import React from 'react';
import { calculateWpmAndAccuracy } from '../utils/calculateMetrics';

const WpmResults = ({ typedText, referenceText, durationInSeconds }) => {
  const { wpm, accuracy } = calculateWpmAndAccuracy(typedText, referenceText, durationInSeconds);

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto bg-white">
      <h2 className="text-xl font-semibold mb-2">Typing Results</h2>
      <p><strong>Words Per Minute (WPM):</strong> {wpm}</p>
      <p><strong>Accuracy:</strong> {accuracy}%</p>
    </div>
  );
};

export default WpmResults;