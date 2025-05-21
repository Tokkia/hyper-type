import React from 'react';
import { useLocation } from 'react-router-dom';
import RaceTypingBox from '../components/RaceTypingBox';

export default function Race() {
  const location = useLocation();
  const difficulty = location.state?.difficulty || 'medium';
  const wordCount = location.state?.wordCount || 30; // fallback default

  return (
    <div>
      <RaceTypingBox difficulty={difficulty} wordCount={wordCount} />
    </div>
  );
}
