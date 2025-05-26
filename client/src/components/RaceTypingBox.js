import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sentencesData from '../assets/sentences.json';
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { calculateWpmAndAccuracy } from '../utils/calculateMetrics';
import axios from 'axios';

const botSettings = {
  easy: { wpm: 45 },
  medium: { wpm: 80 },
  hard: { wpm: 115 },
  expert: { wpm: 150 },
};

const getCharDelay = (wpm) => {
  const cpm = wpm * 5;
  return 60000 / cpm;
};

export default function RaceTypingBox({ difficulty, wordCount }) {
  const [totalChars, setTotalChars] = useState(1);
  const [countdown, setCountdown] = useState(wordCount);
  const [sentences, setSentences] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [botText, setBotText] = useState('');
  const userProgress = Math.min((userInput.length / totalChars) * 100, 100);
  const botProgress = Math.min((botText.length / totalChars) * 100, 100);
  const inputRef = useRef(null);
  const botIntervalRef = useRef(null);
  const [botDifficulty] = useState(difficulty);
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(null);
  const startTimeRef = useRef(null);
  const userInputRef = useRef('');

  useEffect(() => {
    setCountdown(wordCount);
  }, [wordCount]);

  useEffect(() => {
    generateRandomSentence();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (sentences) {
      startBotTyping(botSettings[botDifficulty], sentences.join(' '), setBotText);
    }
    return () => clearInterval(botIntervalRef.current);
  }, [sentences, botDifficulty]);
  
  const lastCountdownRef = useRef(countdown);

  useEffect(() => {
    const correctWords = countCorrectWords(userInputRef.current);
    const newCountdown = wordCount - correctWords;

    if (newCountdown !== lastCountdownRef.current) {
      lastCountdownRef.current = newCountdown;
      setCountdown(newCountdown);

      if (newCountdown <= 0) {
        clearInterval(botIntervalRef.current);
      
        const fullTyped = userInputRef.current;
        const reference = sentences.join(' ');
        const duration = (Date.now() - startTime) / 1000;
      
        const { wpm, accuracy } = calculateWpmAndAccuracy(fullTyped, reference, duration);
      
        (async () => {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              await axios.post('http://localhost:5001/api/race/save', {
                wpm,
                accuracy,
                difficulty: botDifficulty,
                wordCount,
              }, {
                headers: { Authorization: token },
              });
              console.log('✅ Race session saved');
            } catch (err) {
              console.error('❌ Error saving race session', err.response?.data || err.message);
            }
          }
      
          navigate('/raceresults', {
            state: { result: 'win', wpm, accuracy }
          });
        })();
      }      
    }
  }, [userInput]);

  const countCorrectWords = (input) => {
    const userWords = input.trim().split(/\s+/);
    const targetWords = sentences.join(' ').trim().split(/\s+/);

    let count = 0;
    for (let i = 0; i < userWords.length; i++) {
      if (userWords[i] === targetWords[i]) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  const generateRandomSentence = () => {
    const allWords = sentencesData.data
      .map((item) => item.sentence)
      .join(' ')
      .split(/\s+/);

    // Shuffle the words randomly
    const shuffledWords = allWords
      .map(word => ({ word, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ word }) => word);

    const selectedWords = shuffledWords.slice(0, wordCount);
    let sentenceArray = [];
    let buffer = [];

    // Chunk words into pseudo-sentences (e.g. every 10 words)
    for (let i = 0; i < selectedWords.length; i++) {
      buffer.push(selectedWords[i]);
      if (buffer.length === 10 || i === selectedWords.length - 1) {
        sentenceArray.push(buffer.join(' '));
        buffer = [];
      }
    }

    const fullText = sentenceArray.join(' ');
    setSentences(sentenceArray);
    setTotalChars(fullText.length);
    setUserInput('');
    setBotText('');
  };


  const handleKeyDown = (e) => {
    if (!startTimeRef.current) {
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const char = e.key === '’' ? "'" : e.key;
      const newInput = userInput + char;
      setUserInput(newInput);
      userInputRef.current = newInput;
    } else if (e.key === 'Backspace') {
      const newInput = userInput.slice(0, -1);
      setUserInput(newInput);
      userInputRef.current = newInput;
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

        const correctWords = countCorrectWords(userInputRef.current);
        if (correctWords < wordCount) {
          const fullTyped = userInputRef.current;
          const reference = sentences.join(' ');
          let endTime = Date.now();
          let startTime = startTimeRef.current || endTime; // fallback to endTime if undefined
          const duration = (endTime - startTime) / 1000;
        
          const { wpm, accuracy } = calculateWpmAndAccuracy(fullTyped, reference, duration);
        
          (async () => {
            const token = localStorage.getItem('token');
            if (token) {
              try {
                await axios.post('http://localhost:5001/api/race/save', {
                  wpm,
                  accuracy,
                  difficulty: botDifficulty,
                  wordCount,
                }, {
                  headers: { Authorization: token },
                });
                console.log('✅ Race session saved');
              } catch (err) {
                console.error('❌ Error saving race session', err.response?.data || err.message);
              }
            }
        
            navigate('/raceresults', {
              state: { result: 'lose', wpm, accuracy }
            });
          })();
        }        
        return;
      }
      typed += fullText[i];
      i++;
      onUpdate(typed);
    }, delay);
  };
  
const renderSentence = (typedInput) => {
  const fullReference = sentences.join(' ');
  const typed = typedInput;
  let charCounter = 0;

  const wordElements = fullReference.split(' ').map((word, wordIdx) => {
    const chars = word.split('').map((char, charIdx) => {
      let style = 'text-accent';
      const typedChar = typed[charCounter];
      if (typedChar !== undefined) {
        style = typedChar === char ? 'text-accentText' : 'text-red-400';
      }

      const showCaret = charCounter === typed.length;

      charCounter++;

      return (
        <span key={`${wordIdx}-${charIdx}`} className="relative inline-block whitespace-pre">
          <span className={`${style} invisible`}>{char}</span>
          <span className={`${style} absolute inset-0`}>
            {char}
            {showCaret && (
              <span className="absolute left-0 top-0 w-[1px] h-full bg-accentText animate-caret" />
            )}
          </span>
        </span>
      );
    });

    const needsSpace = wordIdx < fullReference.split(' ').length - 1;
    if (needsSpace) {
      const spaceChar = ' ';
      const typedChar = typed[charCounter];
      const spaceStyle =
        typedChar === spaceChar
          ? 'text-accentText'
          : typed.length > charCounter
          ? 'text-red-400'
          : 'text-accent';
      const showCaret = charCounter === typed.length;

      chars.push(
        <span key={`${wordIdx}-space`} className="relative inline-block whitespace-pre">
          <span className={`${spaceStyle} invisible`}>{spaceChar}</span>
          <span className={`${spaceStyle} absolute inset-0`}>
            {spaceChar}
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

  return <div className="w-full flex flex-wrap gap-x-1">{wordElements}</div>;
};

  return (
    <div className="mt-8 flex flex-col items-center px-5 pt-8">
      <p className="mb-2 text-2xl font-bold text-accent ml-auto">
        {countdown}
      </p>
      <div className="w-full flex flex-col rounded-2xl py-10 bg-overlay gap-12 px-10">
        <div className="flex flex-col justify-center gap-6 w-full">
          {/* User row */}
          <div className="flex items-center gap-4">
            <FaRegUser className="text-4xl" />
            <div className="flex-1 h-4 rounded-full bg-background overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-accentText transition-all"
                style={{ width: `${userProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <RiRobot2Line className="text-4xl" />
            <div className="flex-1 h-4 rounded-full bg-background overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-accent opacity-50 transition-all"
                style={{ width: `${botProgress}%` }}
              />
            </div>
          </div>
          <div className="w-full opacity-50">{renderSentence(botText)}</div>
        </div>
      </div>
      

      <div
        tabIndex="0"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="mt-4 px-10 py-10 rounded-2xl bg-overlay text-xl flex flex-col gap-y-3 outline-none select-none cursor-text whitespace-pre-wrap text-left w-full min-h-[100px]"
      >
        {renderSentence(userInput)}

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

    </div>
  );
}