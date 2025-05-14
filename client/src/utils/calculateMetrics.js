export function calculateWpmAndAccuracy(typedText, referenceText, durationInSeconds) {
  if (durationInSeconds === 0) return { wpm: 0, accuracy: 0 };

  const totalCharsTyped = typedText.length;
  const correctChars = typedText
    .split('')
    .filter((char, idx) => char === referenceText[idx])
    .length;

  const accuracy = totalCharsTyped === 0 ? 0 : (correctChars / totalCharsTyped) * 100;
  const minutes = durationInSeconds / 60;
  const wpm = (correctChars / 5) / minutes; // 5 chars = 1 word

  return {
    wpm: Math.round(wpm),
    accuracy: Math.round(accuracy),
  };
}