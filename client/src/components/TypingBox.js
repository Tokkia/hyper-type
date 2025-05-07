import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sentencesData from '../assets/sentences.json';
import { MdReplay } from "react-icons/md";

export default function TypingBox() {
  const [sentence, setSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    generateRandomSentence();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timerStarted && timeLeft === 0) {
      handleTestFinish();
    }
    return () => clearTimeout(timerRef.current);
  }, [timerStarted, timeLeft]);

  const generateRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentencesData.data.length);
    const newSentence = sentencesData.data[randomIndex].sentence;
    setSentence(newSentence);
    setUserInput('');
    setTimeLeft(null);
    setTimerStarted(false);
  };

  const handleKeyDown = (e) => {
    if (!timerStarted) {
      setTimerStarted(true);
      setTimeLeft(selectedTime);
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setUserInput(prev => prev + e.key);
    } else if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const handleTestFinish = () => {
    const correctChars = userInput
      .split('')
      .filter((char, i) => char === sentence[i]).length;
    const totalChars = userInput.length;
    const wordsTyped = totalChars / 5;
    const minutes = selectedTime / 60;
    const wpm = Math.round(wordsTyped / minutes);
    const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);

    // ✅ Route to /typingresults with test result state
    navigate('/typingresults', {
      state: { wpm, accuracy, time: selectedTime }
    });
  };

  const renderSentence = () => {
    const words = sentence.split(' ');
    const typedChars = userInput.split('');
    let charIndex = 0;

    return words.map((word, wordIdx) => (
      <span key={wordIdx} className="flex gap-1">
        {word.split('').map((char, idx) => {
          const typedChar = typedChars[charIndex];
          let style = 'text-accent';
          if (typedChar != null) {
            style = typedChar === char ? 'text-accentText' : 'text-red-400';
          }
          charIndex++;
          return <span key={idx} className={style}>{char}</span>;
        })}
        <span>
          {(() => {
            const typedChar = typedChars[charIndex];
            let spaceStyle = 'text-overlay';
            let display = ' ';
            if (typedChar != null) {
              if (typedChar === ' ') {
                spaceStyle = 'text-accent';
              } else {
                spaceStyle = 'text-red-400';
                display = '_';
              }
            }
            charIndex++;
            return <span className={spaceStyle}>{display}</span>;
          })()}
        </span>
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center px-5 pt-32">
      <div className="ml-auto h-[3vh] w-80 rounded-2xl bg-overlay flex flex-col items-center">
        <div className="px-8 flex items-center gap-10 py-1">
          <p className='text-accentText text-sm mr-10'>timer</p>
          {[15, 30, 60].map(time => (
            <button
              key={time}
              onClick={() => {
                setSelectedTime(time);
                setTimeLeft(null);
                setTimerStarted(false);
              }}
              className={`text-sm text-accentText hover:text-accent px-2 rounded ${
                selectedTime === time ? 'bg-yellow-400 text-background' : ''
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {timeLeft !== null && (
        <div className="text-accentText font-bold text-xl mt-2">
          Time Left: {timeLeft}s
        </div>
      )}

      <div
        tabIndex="0"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="h-[25vh] mt-4 px-10 py-10 rounded-2xl bg-overlay text-2xl flex items-center flex-wrap gap-x-2 gap-y-3 outline-none select-none cursor-text whitespace-pre-wrap text-center w-full"
        style={{ minHeight: '150px' }}
      >
        {renderSentence()}
      </div>

      <button onClick={generateRandomSentence} className="mt-2 px-6 py-2 hover:bg-gray-70">
        <MdReplay className="items-center font-bold text-accentText text-3xl hover:text-accent" />
      </button>
    </div>
  );
}