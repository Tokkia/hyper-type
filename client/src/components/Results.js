import React from 'react';

const Results = ({ wpm, accuracy }) => (
  <div className="mt-6 p-4 border rounded bg-gray-100">
    <h3 className="text-lg font-semibold">Test Complete</h3>
    <p>Words per Minute (WPM): <strong>{wpm}</strong></p>
    <p>Accuracy: <strong>{accuracy}%</strong></p>
  </div>
);

export default Results;