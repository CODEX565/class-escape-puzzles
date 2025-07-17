import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Trophy, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

interface LetterState {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

interface GameStats {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
}

const WORDS = [
  'BRAIN', 'STUDY', 'LEARN', 'THINK', 'SMART', 'FOCUS', 'WRITE', 'READ',
  'TEACH', 'GRADE', 'PAPER', 'BOOKS', 'CLASS', 'NOTES', 'SOLVE', 'RULES',
  'LOGIC', 'SHARP', 'QUICK', 'CLEAR', 'POWER', 'SPEED', 'BOOST', 'SKILL'
];

export const WordleGame = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkAchievements } = useAchievements();
  const navigate = useNavigate();
  const [targetWord, setTargetWord] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [grid, setGrid] = useState<LetterState[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [stats, setStats] = useState<GameStats>({ played: 0, won: 0, streak: 0, maxStreak: 0 });
  const [usedLetters, setUsedLetters] = useState<Map<string, 'correct' | 'present' | 'absent'>>(new Map());
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // Initialize game
  useEffect(() => {
    resetGame();
    // Load stats from localStorage
    const savedStats = localStorage.getItem('wordle-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const resetGame = useCallback(() => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus('playing');
    setUsedLetters(new Map());
    setShowWinAnimation(false);
    
    // Initialize empty grid
    const newGrid = Array(6).fill(null).map(() =>
      Array(5).fill(null).map(() => ({ letter: '', status: 'empty' as const }))
    );
    setGrid(newGrid);
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (currentCol === 5) {
        submitGuess();
      } else {
        toast({
          title: "Not enough letters",
          description: "Please enter a 5-letter word.",
          variant: "destructive"
        });
      }
    } else if (key === 'BACKSPACE') {
      if (currentCol > 0) {
        const newGrid = [...grid];
        newGrid[currentRow][currentCol - 1] = { letter: '', status: 'empty' };
        setGrid(newGrid);
        setCurrentCol(currentCol - 1);
      }
    } else if (key.match(/[A-Z]/) && currentCol < 5) {
      const newGrid = [...grid];
      newGrid[currentRow][currentCol] = { letter: key, status: 'empty' };
      setGrid(newGrid);
      setCurrentCol(currentCol + 1);
    }
  }, [currentRow, currentCol, grid, gameStatus, toast]);

  // Hardware keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        event.preventDefault();
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        event.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (key.match(/^[A-Z]$/)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const submitGuess = async () => {
    const guess = grid[currentRow].map(cell => cell.letter).join('');
    const newGrid = [...grid];
    const newUsedLetters = new Map(usedLetters);

    // Check each letter
    for (let i = 0; i < 5; i++) {
      const guessLetter = guess[i];
      
      if (targetWord[i] === guessLetter) {
        newGrid[currentRow][i].status = 'correct';
        newUsedLetters.set(guessLetter, 'correct');
      } else if (targetWord.includes(guessLetter)) {
        newGrid[currentRow][i].status = 'present';
        if (!newUsedLetters.has(guessLetter) || newUsedLetters.get(guessLetter) !== 'correct') {
          newUsedLetters.set(guessLetter, 'present');
        }
      } else {
        newGrid[currentRow][i].status = 'absent';
        if (!newUsedLetters.has(guessLetter)) {
          newUsedLetters.set(guessLetter, 'absent');
        }
      }
    }

    setGrid(newGrid);
    setUsedLetters(newUsedLetters);

    // Check win condition
    if (guess === targetWord) {
      setGameStatus('won');
      setShowWinAnimation(true);
      
      // Hide animation after 2 seconds
      setTimeout(() => setShowWinAnimation(false), 2000);
      
      const newStats = {
        ...stats,
        played: stats.played + 1,
        won: stats.won + 1,
        streak: stats.streak + 1,
        maxStreak: Math.max(stats.maxStreak, stats.streak + 1)
      };
      setStats(newStats);
      localStorage.setItem('wordle-stats', JSON.stringify(newStats));
      
      // Save to Firestore if user is logged in
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            'stats.wordle.totalScore': increment(10),
            'stats.wordle.gamesPlayed': increment(1),
            'stats.wordle.gamesWon': increment(1),
            'stats.wordle.currentStreak': increment(1)
          });
          checkAchievements();
        } catch (error) {
          console.error('Error saving to Firestore:', error);
        }
      }
      
      toast({
        title: "🎉 Congratulations!",
        description: `You solved it in ${currentRow + 1} guesses!`,
      });
    } else if (currentRow === 5) {
      setGameStatus('lost');
      const newStats = {
        ...stats,
        played: stats.played + 1,
        streak: 0
      };
      setStats(newStats);
      localStorage.setItem('wordle-stats', JSON.stringify(newStats));
      
      // Save to Firestore if user is logged in
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            'stats.wordle.gamesPlayed': increment(1),
            'stats.wordle.currentStreak': 0
          });
        } catch (error) {
          console.error('Error saving to Firestore:', error);
        }
      }
      
      toast({
        title: "Game Over",
        description: `The word was "${targetWord}". Better luck next time!`,
        variant: "destructive"
      });
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  };

  // Keyboard component
  const Keyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    const getKeyClass = (key: string) => {
      const status = usedLetters.get(key);
      const baseClass = "h-12 text-sm font-semibold rounded-md transition-all duration-200 hover:scale-105";
      
      if (key === 'ENTER' || key === 'BACKSPACE') {
        return `${baseClass} px-4 bg-muted hover:bg-muted/80 text-foreground`;
      }
      
      if (status === 'correct') {
        return `${baseClass} px-3 bg-quiz-green text-white`;
      } else if (status === 'present') {
        return `${baseClass} px-3 bg-escape-orange text-white`;
      } else if (status === 'absent') {
        return `${baseClass} px-3 bg-muted-foreground text-white`;
      }
      
      return `${baseClass} px-3 bg-secondary hover:bg-secondary/80 text-foreground`;
    };

    return (
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map(key => (
              <Button
                key={key}
                className={getKeyClass(key)}
                onClick={() => handleKeyPress(key)}
                disabled={gameStatus !== 'playing'}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getCellClass = (cell: LetterState, rowIndex: number, colIndex: number) => {
    const baseClass = "w-12 h-12 border-2 rounded-md flex items-center justify-center text-lg font-bold transition-all duration-300";
    
    // Add winning animation for the correct row
    const winAnimationClass = showWinAnimation && rowIndex === currentRow && cell.status === 'correct' 
      ? `animate-bounce` 
      : '';
    
    switch (cell.status) {
      case 'correct':
        return `${baseClass} ${winAnimationClass} bg-quiz-green border-quiz-green text-white`;
      case 'present':
        return `${baseClass} bg-escape-orange border-escape-orange text-white`;
      case 'absent':
        return `${baseClass} bg-muted border-muted text-muted-foreground`;
      default:
        return `${baseClass} ${cell.letter ? 'border-primary bg-card' : 'border-foreground/30 bg-background'} text-foreground`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">WordBuzz</h1>
            <p className="text-sm text-muted-foreground">Daily word challenge</p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.played}</div>
                <div className="text-xs text-muted-foreground">Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{Math.round((stats.won / Math.max(stats.played, 1)) * 100)}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.maxStreak}</div>
                <div className="text-xs text-muted-foreground">Max Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Grid */}
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              {grid.map((row, i) => (
                <div key={i} className="flex justify-center gap-2">
                  {row.map((cell, j) => (
                    <div key={j} className={getCellClass(cell, i, j)}>
                      {cell.letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keyboard */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <Keyboard />
          </CardContent>
        </Card>

        {/* Game Status */}
        {gameStatus !== 'playing' && (
          <Card className="mt-6 bg-gradient-card border-border/50">
            <CardContent className="p-6 text-center">
              {gameStatus === 'won' ? (
                <div className="space-y-4">
                  <Trophy className="w-12 h-12 text-quiz-green mx-auto" />
                  <h3 className="text-xl font-bold text-foreground">Congratulations!</h3>
                  <p className="text-muted-foreground">You solved today's puzzle!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-bold text-foreground">Better luck next time!</h3>
                  <p className="text-muted-foreground">The word was: <span className="font-bold text-foreground">{targetWord}</span></p>
                </div>
              )}
              <Button onClick={resetGame} className="mt-4">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};