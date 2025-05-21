import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sentencesData from '../assets/sentences.json';
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

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
  const [countdown, setCountdown] = useState(wordCount);
  const [sentences, setSentences] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [botText, setBotText] = useState('');
  const inputRef = useRef(null);
  const botIntervalRef = useRef(null);
  const [botDifficulty] = useState(difficulty);
  const navigate = useNavigate();

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
  
  useEffect(() => {
    const correctWords = countCorrectWords(userInput);
    const newCountdown = wordCount - correctWords;
    if (newCountdown !== countdown) {
      setCountdown(newCountdown);

      if (newCountdown <= 0) {
        clearInterval(botIntervalRef.current);
        setTimeout(() => navigate('/raceresults'), 500);
      }
    }
  }, [userInput]); // Run this every time userInput changes


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

    setSentences(sentenceArray);
    setUserInput('');
    setBotText('');
  };

  const handleKeyDown = (e) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Ensure apostrophes are plain single quotes
      const char = e.key === '’' ? "'" : e.key;
      setUserInput(prev => prev + char);
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
    <div className="mt-16 flex flex-col items-center px-5 pt-8">
      <p className="mb-2 text-2xl font-bold text-accent ml-auto">
        {countdown}
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
        className="mt-4 px-10 py-6 rounded-2xl bg-overlay text-2xl flex flex-col gap-y-3 outline-none select-none cursor-text whitespace-pre-wrap text-left w-full min-h-[100px]"
      >
        {renderSentence(userInput)}
        <div className="w-full opacity-50">{renderSentence(botText)}</div>

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