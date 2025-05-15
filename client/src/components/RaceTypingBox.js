import React, { useState, useEffect, useRef } from 'react';
import sentencesData from '../assets/sentences.json';
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

const botSettings = {
  easy: { wpm: 30 },
  medium: { wpm: 60 },
  hard: { wpm: 90 },
};

const getCharDelay = (wpm) => {
  const cpm = wpm * 5;
  return 60000 / cpm;
};

export default function RaceTypingBox({ difficulty = 'medium' }) {
  const [sentence, setSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [botText, setBotText] = useState('');
  const inputRef = useRef(null);
  const botIntervalRef = useRef(null);
  const [botDifficulty] = useState(difficulty);

  useEffect(() => {
    generateRandomSentence();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (sentence) {
      startBotTyping(botSettings[botDifficulty], sentence, setBotText);
    }
    return () => clearInterval(botIntervalRef.current);
  }, [sentence, botDifficulty]);

  const generateRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentencesData.data.length);
    const newSentence = sentencesData.data[randomIndex].sentence;
    setSentence(newSentence);
    setUserInput('');
    setBotText('');
  };

  const handleKeyDown = (e) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setUserInput(prev => prev + e.key);
    } else if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const startBotTyping = (botSetting, fullText, onUpdate) => {
    let i = 0;
    let typed = '';
    const delay = getCharDelay(botSetting.wpm);

    botIntervalRef.current = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(botIntervalRef.current);
        return;
      }
      typed += fullText[i];
      i++;
      onUpdate(typed);
    }, delay);
  };

  const renderSentence = (typedInput) => {
    const words = sentence.split(' ');
    const typedChars = typedInput.split('');
    let charIndex = 0;

    return words.map((word, wordIdx) => (
      <span key={wordIdx} className="flex gap-1">
        {word.split('').map((char, idx) => {
          const expectedChar = char;
          const typedChar = typedChars[charIndex];
          let charStyle = 'text-accent';
          let displayChar = char;

          if (typedChar != null) {
            if (typedChar === expectedChar) {
              charStyle = 'text-accentText';
            } else {
              if (expectedChar === ' ') {
                displayChar = '_';
              }
              charStyle = 'text-red-400';
            }
          }

          charIndex++;

          return (
            <span key={idx} className={`${charStyle}`}>
              {displayChar}
            </span>
          );
        })}
        <span>
          {(() => {
            const expectedChar = ' ';
            const typedChar = typedChars[charIndex];
            let spaceDisplay = ' ';
            let spaceStyle = 'text-overlay';

            if (typedChar != null) {
              if (typedChar === expectedChar) {
                spaceStyle = 'text-accent';
              } else {
                spaceDisplay = '_';
                spaceStyle = 'text-red-400';
              }
            }

            charIndex++;

            return <span className={`${spaceStyle}`}>{spaceDisplay}</span>;
          })()}
        </span>
      </span>
    ));
  };

  return (
    <div className="mt-16 flex flex-col items-center px-5 pt-8">
      <p className="mb-2 text-2xl font-bold text-accent ml-auto">
        15
      </p>
      <div className="w-full flex h-[25vh] rounded-2xl bg-overlay gap-12 px-10">
        <div className="flex flex-col justify-center text-left text-5xl font-bold gap-12">
          <FaRegUser />
          <RiRobot2Line />
        </div>
      </div>
      <div
        tabIndex="0"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="h-[25vh] mt-8 px-10 py-10 rounded-2xl bg-overlay text-2xl flex items-center flex-wrap gap-x-2 gap-y-3 outline-none select-none cursor-text whitespace-pre-wrap text-center w-full"
        style={{ minHeight: '150px' }}
      >
        {renderSentence(userInput)}
        <div className="w-full mt-4 opacity-50">{renderSentence(botText)}</div>
      </div>
    </div>
  );
}
