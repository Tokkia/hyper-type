import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sentencesData from '../assets/sentences.json';
import { MdReplay } from "react-icons/md";
import { calculateWpmAndAccuracy } from '../utils/calculateMetrics';
import axios from 'axios';

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
  const typedInputsRef = useRef([]);
  const userInputRef = useRef('');

  useEffect(() => {
    initSentences();
  }, []);

  useEffect(() => {
    if (!isRunning || !endTime) return;
  
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setIsRunning(false);
      
        const completedInputs = [...typedInputsRef.current, userInputRef.current];
        const fullTypedText = completedInputs.join('');
        const referenceText = sentences.join('');
        const totalTimeInSeconds = (endTime - startTime) / 1000;
      
        console.log('Typed:', fullTypedText);
        console.log('Reference:', referenceText);
      
        const { wpm, accuracy } = calculateWpmAndAccuracy(fullTypedText, referenceText, totalTimeInSeconds);
        console.log('WPM:', wpm, 'Accuracy:', accuracy, 'Total Time:', totalTimeInSeconds);
      
        saveTypingSession(wpm, accuracy, totalTimeInSeconds);
        navigate('/typingresults', { state: { wpm, accuracy, time: totalTimeInSeconds } });
      }
    }, 1000);
  
    return () => clearInterval(timerRef.current);
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
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
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

      let key = e.key;
      if (key === '’' || key === '‘') key = `'`;
      if (key === '“' || key === '”') key = `"`;

    if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const updated = userInput + key;
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
        typedInputsRef.current = newTypedInputs;
        setUserInput('');
        userInputRef.current = '';
        setCurrentIndex(Math.min(newTypedInputs.length, 2)); // Always between 0 and 2
      } else {
        setUserInput(updated);
        userInputRef.current = updated;
      }
    } else if (key === 'Backspace') {
        const newInput = userInput.slice(0, -1);
        setUserInput(newInput);
        userInputRef.current = newInput;
    } else if (key === 'Tab') {
        e.preventDefault();
    }
  };

  const saveTypingSession = async (wpm, accuracy, timer) => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const userId = localStorage.getItem('userId');

      await axios.post('http://localhost:5001/api/results', {
        userId,
        wpm,
        accuracy,
        time: timer,
      });
      console.log('Session saved successfully');
    } catch (error) {
      console.error('Error saving session:', error);
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
    <div className="flex flex-col items-center px-5 pt-56">
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