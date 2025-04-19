import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from './LevelSelector';
import WordDisplay from './WordDisplay';
import LetterItem from './LetterItem';
import { updateUserScore } from '../services/api';
import Skeleton from './Skeleton'
import '../css/letterhunt.css';

const HINT_COST = 20;
const WORDS_BY_LEVEL = {
  easy: [
    { word: 'chien', hint: 'Animal domestique qui aboie',hint2:'Le mot commence par C' },
    { word: 'fleur', hint: 'Partie colorée des plantes',hint2:'Le mot commence par F'  },
    { word: 'table', hint: 'Meuble avec une surface plane',hint2:'Le mot commence par T'  },
    { word: 'maison', hint: 'Endroit où on habite',hint2:'Le mot commence par M'  },
    { word: 'soleil', hint: 'Étoile de notre système solaire',hint2:'Le mot commence par S'  }
  ],
  medium: [
    { word: 'ordinateur', hint: 'Machine électronique pour traiter des données',hint2:'Le mot commence par O'  },
    { word: 'bibliothèque', hint: 'Lieu où sont conservés des livres' ,hint2:'Le mot commence par B' },
    { word: 'restaurant', hint: 'Établissement où on sert des repas',hint2:'Le mot commence par R'  },
    { word: 'aventure', hint: 'Expérience excitante et inhabituelle',hint2:'Le mot commence par A'  },
    { word: 'montagne', hint: 'Élévation naturelle du terrain',hint2:'Le mot commence par M'  }
  ],
  hard: [
    { word: 'extraterrestre', hint: 'Être venant d\'une autre planète',hint2:'Le mot commence par E '  },
    { word: 'phénoménologie', hint: 'Étude des phénomènes conscients',hint2:'Le mot commence par P'  },
    { word: 'constitutionnellement', hint: 'De manière conforme à la constitution',hint2:'Le mot commence par C'  },
    { word: 'anticonstitutionnellement', hint: 'Le plus long mot de la langue française',hint2:'Le mot commence par A'  }
  ]
};
const hintTypes = [
    { id: 'definition', label: 'Définition', cost: 20 },
    { id: 'firstLetter', label: 'Première lettre', cost: 15 },
    { id: 'length', label: 'Longueur du mot', cost: 10 },
    { id: 'randomLetter', label: 'Lettre aléatoire', cost: 25 }
];

const LetterHunt = () => {
    const [currentWord, setCurrentWord] = useState('');//le mot actuelle a devinner par user
    const [guessedLetters, setGuessedLetters] = useState([]);//letrre devinner par user 
    const [attempts, setAttempts] = useState(0);//nombre d essaie
    const [level, setLevel] = useState('easy');//niveau de difficulter 
    const [gameStatus, setGameStatus] = useState('playing');//playing ,won,lost
    const [timer, setTimer] = useState(60);//timer 
    const [user, setUser] = useState(null);//contient l objet de user 
    const [freeHintUsed, setFreeHintUsed] = useState(false);//verifier est ce que le premier hint est utiliser ou non
    const [hintsUsed, setHintsUsed] = useState(0);//le nombre d indice utiliser pour le calcule de score nouveau
    const [activeHintType, setActiveHintType] = useState(null);//Type d’indice actif
    const [currentWordObj, setCurrentWordObj] = useState(null);// Objet contenant le mot et ses deux indices (hint, hint2
    const [usedHints, setUsedHints] = useState([]);//la liste des hint deja utiliser 

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
        startNewGame();
    }, [level, navigate]);

    useEffect(() => {
        if (gameStatus !== 'playing' || timer === 0) return;
        
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) checkGameLost();
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameStatus, timer]);
    var x2;
    var x1;
    const startNewGame = () => {
        const words = WORDS_BY_LEVEL[level];
        var randomWordObj = words[Math.floor(Math.random() * words.length)];
        const randomWord = randomWordObj.word.toUpperCase();
        
        setCurrentWord(randomWord);
        setCurrentWordObj(randomWordObj);
        
        setGuessedLetters([]);
        setAttempts(0);
        setGameStatus('playing');
        setTimer(60);
        setHintsUsed(0);
        setFreeHintUsed(false);
        setUsedHints([]);
    };

    const checkGameWon = (letters) => {
        return [...currentWord].every(char => letters.includes(char));
    };

    const checkGameLost = () => {
        setGameStatus('lost');
    };
   
    const handleGuess = async (letter) => {
      if (gameStatus !== 'playing' || timer === 0) return; 
      if (guessedLetters.includes(letter)) return;
      
      const newGuessedLetters = [...guessedLetters, letter];
      setGuessedLetters(newGuessedLetters);
      
      if (!currentWord.includes(letter)) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 10) checkGameLost();
      }
  
      // Vérifier si le joueur a gagné
      if (checkGameWon(newGuessedLetters)) {
        setGameStatus('won');
        const scoreToAdd = calculateScore();
        try {
          
          await updateUserScore(user.id, user.score + scoreToAdd);
          const updatedUser = { ...user, score: user.score + scoreToAdd };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (error) {
          console.error("Erreur de mise à jour du score", error);
        }
      } else if (attempts + 1 >= 10 || timer === 0) {
        setGameStatus('lost');
      }
    };

    const getHintContent = (type) => {
        switch(type) {
          case 'definition':
            return currentWordObj?.hint;
          case 'firstLetter':
            return `Le mot commence par "${currentWord[0]}"`;
          case 'length':
            return `Le mot fait ${currentWord.length} lettres`;
          case 'randomLetter':
            const unguessedLetters = [...currentWord].filter(letter => !guessedLetters.includes(letter));
            const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
            return `Le mot contient la lettre "${randomLetter}"`;
          default:
            return '';
        }
    };
      
    const handleHintSelection = async (hintType) => {
        // Vérifier si l'indice a déjà été utilisé
        if (usedHints.includes(hintType)) {
          alert("Vous avez déjà utilisé ce type d'indice !");
          return;
        }
      
        if (!freeHintUsed) {
          setActiveHintType(hintType);
          setFreeHintUsed(true);
          setHintsUsed(1);
          setUsedHints([...usedHints, hintType]); // Ajouter aux indices utilisés
          return;
        }
      
        if (user.score < hintTypes.find(h => h.id === hintType).cost) {
          alert(`Vous n'avez pas assez de points (${hintTypes.find(h => h.id === hintType).cost} nécessaires)`);
          return;
        }
      
        if (!window.confirm(`Utiliser cet indice pour ${hintTypes.find(h => h.id === hintType).cost} points?`)) return;
      
        try {
          const hintCost = hintTypes.find(h => h.id === hintType).cost;
          await updateUserScore(user.id, user.score - hintCost);
          const updatedUser = { ...user, score: user.score - hintCost };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
      
          setActiveHintType(hintType);
          setHintsUsed(prev => prev + 1);
          setUsedHints([...usedHints, hintType]); // Ajouter aux indices utilisés
        } catch (error) {
          console.error("Erreur lors de l'achat d'indice", error);
          alert("Échec de l'achat de l'indice !");
        }
    };


    const calculateScore = () => {
        const baseScore = 100;
        const timeBonus = Math.floor(timer * 2);
        const difficultyMultiplier = { 
            easy: 1, 
            medium: 1.5, 
            hard: 2 
        };
        const hintPenalty = (hintsUsed > 0 ? (hintsUsed - 1) * HINT_COST : 0);
        
        return Math.max(0, 
            Math.floor(baseScore * difficultyMultiplier[level] + timeBonus - hintPenalty)
        );
    };

    return (
        <div className="letter-hunt">
            <h1>Chasse aux Lettres 🎯</h1>
            {user && (
                <div className="user-score">
                    Votre score: {user.score} points
                    {hintsUsed > 0 && (
                        <span className="hint-cost">
                            (Indices utilisés: {hintsUsed} - Coût total: {(hintsUsed - 1) * HINT_COST} pts)
                        </span>
                    )}
                </div>
            )}
            
            <div className="game-container">
                <div className="game-main">
                    <div className="game-header">
                    
                        <LevelSelector level={level} setLevel={setLevel} />
                        <div id="fond">
                        <div className="game-stats">
                            <p>Essais: {attempts}/10</p>
                            <p>⏱️ Temps: {timer}s</p>
                        </div>
                    </div>

                    <WordDisplay 
                        word={currentWord} 
                        guessedLetters={guessedLetters} 
                    />
           
                    <LetterItem 
                    onGuess={handleGuess} 
                    guessedLetters={guessedLetters} 
                    disabled={gameStatus !== 'playing' || timer === 0}
                    />
                    </div>
    
                    <div className="hint-control">
                        <div className="hint-options">
                            <p className="hint-title">Acheter un indice {!freeHintUsed && '(1er gratuit)'}</p>
                            <div className="hint-buttons-grid">
                            {hintTypes.map(hint => (
                                <button
                                key={hint.id}
                                onClick={() => handleHintSelection(hint.id)}
                                className={`hint-button ${activeHintType === hint.id ? 'active' : ''}`}
                                disabled={gameStatus !== 'playing' || timer === 0 || usedHints.includes(hint.id)}
                                >
                                {hint.label} ({hint.cost} pts)
                                {usedHints.includes(hint.id) && <span className="hint-used-check">✓</span>}
                                </button>
                            ))}
                            </div>
                        </div>
                    </div>
                    {activeHintType && (
                    <div className="hint-tooltip">
                        <div className="hint-content">
                        {getHintContent(activeHintType)}
                        <button 
                            className="close-hint" 
                            onClick={() => setActiveHintType(null)}
                        >
                            ×
                        </button>
                        </div>
                    </div>
                    )}
                </div>

            </div>

            <div className="game-feedback">
                {gameStatus === 'won' && (
                    <div className="win-message">
                        <p>🎉 Bravo ! Score +{calculateScore()} points</p>
                        <button onClick={startNewGame} id="rejouerbtn">Rejouer</button>
                    </div>
                )}
                
                {gameStatus === 'lost' && (
                    <div className="lose-message">
                        <p>❌ Le mot était : {currentWord}</p>
                        <button onClick={startNewGame} id="nouvelle" >Nouvelle partie</button>
                    </div>
                )}
            </div>
            <Skeleton attempts={attempts} />
        </div>
    );
};

export default LetterHunt