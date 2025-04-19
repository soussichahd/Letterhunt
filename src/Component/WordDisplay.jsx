import React from 'react';

const WordDisplay = ({ word, guessedLetters }) => {
  if (!word) return <div className="word-display">Chargement du mot...</div>;

  const displayWord = word
    .toUpperCase()
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');

  return <div className="word-display">{displayWord}</div>;
};

export default WordDisplay;