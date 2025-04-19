import React from 'react';
import '../css/LetterItem.css';

const LetterItem = ({ onGuess, guessedLetters, word }) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
    return (
      <div className="letter-grid">
        {letters.map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          const isInWord = word?.includes(letter);
          let buttonClass = '';
  
          if (isGuessed) {
            buttonClass = isInWord ? 'correct' : 'incorrect';
          }
  
          return (
            <button
              key={letter}
              onClick={() => !isGuessed && onGuess(letter)}
              disabled={isGuessed}
              className={`letter-button ${buttonClass}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );
};

export default LetterItem;