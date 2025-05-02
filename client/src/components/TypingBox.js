import React, { useState, useEffect, useRef } from 'react';
import sentencesData from '../assets/sentences.json';
import { MdReplay } from "react-icons/md";

export default function TypingBox() {
  const [sentence, setSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    generateRandomSentence();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const generateRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentencesData.data.length);
    const newSentence = sentencesData.data[randomIndex].sentence;
    setSentence(newSentence);
    setUserInput('');
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

  const renderSentence = () => {
    const words = sentence.split(' '); 
    const typedChars = userInput.split('');

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
    <div className="flex flex-col items-center px-5 pt-36">
      <div
        tabIndex="0"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="h-[25vh] mt-10 px-10 py-10 rounded-2xl bg-overlay text-2xl flex items-center flex-wrap gap-x-2 gap-y-3 outline-none select-none cursor-text whitespace-pre-wrap text-center w-full"
        style={{ minHeight: '150px' }}
      >
        {renderSentence()}
      </div>


      
      <button
        onClick={generateRandomSentence}
        className="mt-6 px-6 py-2 hover:bg-gray-70 "
      >
        <MdReplay color="#ECEFF2" size={25}/>
      </button>
    </div>
  );
}
