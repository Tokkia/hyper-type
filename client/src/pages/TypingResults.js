import React from 'react';
import { useLocation } from 'react-router-dom';
import PracticeResult from '../components/PracticeResult';

export default function TypingResults() {
  const location = useLocation();
  const { wpm, accuracy, time } = location.state || {};

  return <PracticeResult wpm={wpm} accuracy={accuracy} time={time} />;
}