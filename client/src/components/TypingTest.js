import React, { useState, useEffect } from 'react';
import Results from './Results';
import { useTimer } from './useTimer';
import { calculateWPM } from '../utils/calculateWPM';
import { submitResult } from '../api/submitResult';

const TypingTest = ({ targetText = "The quick brown fox jumps over the lazy dog" }) => {
  const [userInput, setUserInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const secondsElapsed = useTimer(isRunning);

  useEffect(() => {
    if (userInput === targetText) {
      setIsRunning(false);
      const finalWpm = calculateWPM(userInput.length, secondsElapsed);
      setWpm(finalWpm);
      submitResult("guest", finalWpm, 100); // placeholder username + 100% accuracy
      setShowResults(true);
    }
  }, [userInput, secondsElapsed, targetText]);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    if (!isRunning) setIsRunning(true);
    const newWpm = calculateWPM(value.length, secondsElapsed);
    setWpm(newWpm);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Typing Test</h2>
      <p className="mb-4">{targetText}</p>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        value={userInput}
        onChange={handleChange}
        rows="4"
        placeholder="Start typing..."
      />
      <p className="mt-4">WPM: {wpm}</p>

      {showResults && <Results wpm={wpm} accuracy={100} />}
    </div>
  );
};

export default TypingTest;