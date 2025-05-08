import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sentencesData from '../assets/sentences.json';
import { MdReplay } from "react-icons/md";

export default function TypingBox() {
  const [sentences, setSentences] = useState([]);
  const [typedInputs, setTypedInputs] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    initSentences();
  }, []);

  useEffect(() => {
    if (!isRunning || !endTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, endTime]);

  const getRandomSentence = () => {
    const index = Math.floor(Math.random() * sentencesData.data.length);
    return sentencesData.data[index].sentence;
  };

  const initSentences = () => {
    setSentences([getRandomSentence(), getRandomSentence(), getRandomSentence()]);
    setTypedInputs([]);
    setUserInput('');
    setCurrentIndex(0);
    setTimeLeft(0);
    setIsRunning(false);
    setStartTime(null);
    setEndTime(null);
  };

  const startTest = (duration) => {
    initSentences();
    const start = Date.now();
    setStartTime(start);
    setEndTime(start + duration * 1000);
    setTimeLeft(duration);
    setIsRunning(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (!isRunning) return;

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const updated = userInput + e.key;
      const currentSentence = sentences[currentIndex];

      if (updated.length === currentSentence.length) {
        const newTypedInputs = [...typedInputs, updated];

        let newSentences = [...sentences];

        // Only start shifting after second sentence
        if (newTypedInputs.length >= 2) {
          newSentences.shift();
          newSentences.push(getRandomSentence());
          newTypedInputs.shift();
        }

        setSentences(newSentences);
        setTypedInputs(newTypedInputs);
        setUserInput('');
        setCurrentIndex(Math.min(newTypedInputs.length, 2)); // Always between 0 and 2
      } else {
        setUserInput(updated);
      }
    } else if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const renderText = () => {
    const fullTyped = [...typedInputs];
    fullTyped[currentIndex] = userInput;
  
    return sentences.map((sentence, idx) => {
      const typed = fullTyped[idx] || '';
      let charCounter = 0;
  
      const wordElements = sentence.split(' ').map((word, wordIdx) => {
        const chars = word.split('').map((char, charIdx) => {
          let style = 'text-accent';
          let displayChar = char;
  
          const globalCharIndex = charCounter;
          const isTyped =
            globalCharIndex < typed.length;
  
          if (isTyped) {
            const typedChar = typed[globalCharIndex];
            if (typedChar === char) {
              style = 'text-accentText';
            } else {
              style = 'text-red-400';
              if (char === ' ') displayChar = '_';
            }
          }
  
          const showCaret =
            idx === currentIndex &&
            globalCharIndex === typed.length &&
            isRunning;
  
          charCounter++;
  
          return (
            <span key={`${wordIdx}-${charIdx}`} className="relative inline-block whitespace-pre">
              <span className={`${style} invisible`}>{displayChar}</span>
              <span className={`${style} absolute inset-0`}>
                {displayChar}
                {showCaret && (
                  <span className="absolute left-0 top-0 w-[1px] h-full bg-accentText animate-caret" />
                )}
              </span>
            </span>
          );
        });
  
        // Add a space between words (after each word except the last one)
        const needsSpace = wordIdx < sentence.split(' ').length - 1;
  
        if (needsSpace) {
          const spaceStyle =
            typed[charCounter] === ' '
              ? 'text-accentText'
              : typed.length > charCounter
              ? 'text-red-400'
              : 'text-accent';
  
          const showCaret =
            idx === currentIndex &&
            charCounter === typed.length &&
            isRunning;
  
          chars.push(
            <span key={`${wordIdx}-space`} className="relative inline-block whitespace-pre">
              <span className={`${spaceStyle} invisible`}>{' '}</span>
              <span className={`${spaceStyle} absolute inset-0`}>
                {' '}
                {showCaret && (
                  <span className="absolute left-0 top-0 w-[1px] h-full bg-accentText animate-caret" />
                )}
              </span>
            </span>
          );
          charCounter++;
        }
  
        return (
          <span key={wordIdx} className="flex gap-[2px] flex-row flex-wrap">
            {chars}
          </span>
        );
      });
  
      return (
        <div key={idx} className="w-full flex flex-wrap gap-x-1">
          {wordElements}
        </div>
      );
    });
  };  

  return (
    <div className="flex flex-col items-center px-5 pt-32">
      {/* Timer controls */}
      <div className="ml-auto h-[4vh] w-90 flex flex-row items-center mb-4">
        {isRunning && (
          <p className="text-right text-accentText text-md mb-2 px-4 mt-2">Time Left: {timeLeft}s</p>
        )}
        <div className=" bg-overlay  rounded-2xl px-8 flex items-center gap-10 py-1">
          <p className="text-accentText text-md mr-10">timer</p>
          {[15, 30, 60].map((sec) => (
            <button
              key={sec}
              onClick={() => startTest(sec)}
              className="text-md text-accentText hover:text-accent"
            >
              {sec}
            </button>
          ))}
        </div>
      </div>
      

      {/* Typing box */}
      <div
        tabIndex="0"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="mt-4 px-10 py-6 rounded-2xl bg-overlay text-2xl flex flex-col gap-y-3 outline-none select-none cursor-text whitespace-pre-wrap text-left w-full min-h-[100px]"
      >
        {renderText()}
      </div>

      {/* Reset button */}
      <button onClick={initSentences} className="mt-2 px-6 py-2 hover:bg-gray-70">
        <MdReplay className="items-center font-bold text-accentText text-3xl hover:text-accent" />
      </button>

      {/* Caret animation */}
      <style>{`
        @keyframes caret-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-caret {
          animation: caret-blink 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}