export function calculateWpmAndAccuracy(typedText, referenceText, durationInSeconds) {
    if (durationInSeconds === 0) return { wpm: 0, accuracy: 0 };
  
    const typedWords = typedText.trim().split(/\s+/);
    const referenceWords = referenceText.trim().split(/\s+/);
  
    const correctWords = typedWords.filter((word, i) => word === referenceWords[i]);
    const accuracy = (correctWords.length / referenceWords.length) * 100;
  
    const totalWordsTyped = typedWords.length;
    const minutes = durationInSeconds / 60;
    const wpm = totalWordsTyped / minutes;
  
    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy)
    };
  }