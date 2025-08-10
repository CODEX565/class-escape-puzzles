import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LogoQuestion {
  symbol: string; // emoji or simple icon
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const logoQuestions: LogoQuestion[] = [
  { symbol: '🍎', options: ['Apple', 'Google', 'Microsoft', 'Sony'], correct: 0, difficulty: 'easy' },
  { symbol: '🛍️', options: ['eBay', 'Shopify', 'Amazon', 'Etsy'], correct: 2, difficulty: 'easy' },
  { symbol: '▶️', options: ['Netflix', 'YouTube', 'Vimeo', 'Twitch'], correct: 1, difficulty: 'easy' },
  { symbol: '🎵', options: ['SoundCloud', 'Apple Music', 'Spotify', 'Deezer'], correct: 2, difficulty: 'easy' },
  { symbol: '📸', options: ['Instagram', 'Snapchat', 'TikTok', 'Pinterest'], correct: 0, difficulty: 'easy' },
  { symbol: '👻', options: ['Ghost', 'Snapchat', 'Discord', 'Reddit'], correct: 1, difficulty: 'medium' },
  { symbol: '🛩️', options: ['Airbnb', 'Expedia', 'Skyscanner', 'Booking.com'], correct: 2, difficulty: 'medium' },
  { symbol: '🕹️', options: ['Xbox', 'PlayStation', 'Nintendo', 'Steam'], correct: 3, difficulty: 'medium' },
];

export const LogoGuesserGame: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  const q = logoQuestions[current];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      timerRef.current = id;
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState]);

  const getPoints = (difficulty: string, t: number) => {
    const base = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
    const bonus = Math.floor(t / 4);
    return base + bonus;
  };

  const handleTimeUp = () => {
    next();
  };

  const handleAnswer = async (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === q.correct;
    if (isCorrect) {
      const pts = getPoints(q.difficulty, timeLeft);
      setScore((s) => s + pts);
      setCorrectCount((c) => c + 1);
      toast({ title: 'Correct! 🎉', description: `+${pts} points` });
    } else {
      toast({ title: 'Wrong', description: `Answer: ${q.options[q.correct]}`, variant: 'destructive' });
    }
    window.setTimeout(next, 1000);
  };

  const next = () => {
    if (current + 1 >= logoQuestions.length) {
      finish();
    } else {
      setCurrent((c) => c + 1);
      setTimeLeft(12);
      setSelected(null);
    }
  };

  const finish = async () => {
    setGameState('finished');
    if (user && score > 0) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          totalScore: increment(score),
          gamesPlayed: increment(1),
        });
      } catch (e) {
        console.error('Save failed', e);
      }
    }
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setTimeLeft(12);
    setGameState('playing');
    setSelected(null);
    setCorrectCount(0);
  };

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Logo Guesser Complete!</h2>
              <p className="text-muted-foreground">Nice branding instincts!</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Final Score</span>
                <span className="font-bold text-primary">{score}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Correct Answers</span>
                <span className="font-bold">{correctCount}/{logoQuestions.length}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
              <Button onClick={reset} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" /> Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}> <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /><span className="font-bold">{score}</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><span className={`font-bold ${timeLeft <= 4 ? 'text-destructive' : ''}`}>{timeLeft}s</span></div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {current + 1} of {logoQuestions.length}</span>
              <span>{q.difficulty}</span>
            </div>
            <Progress value={(current / logoQuestions.length) * 100} className="h-2" />
          </div>

          <div className="text-center mb-8">
            <div className="text-8xl mb-4" role="img" aria-label="Brand symbol">{q.symbol}</div>
            <h2 className="text-xl font-semibold mb-2">Which brand is this?</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <Button
                key={i}
                variant={selected === null ? 'outline' : i === q.correct ? 'default' : selected === i ? 'destructive' : 'outline'}
                className={`h-16 text-lg ${selected !== null && i === q.correct ? 'bg-quiz-green text-white' : ''}`}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
              >
                {opt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
