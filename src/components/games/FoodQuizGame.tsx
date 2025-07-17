import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FoodQuestion {
  emoji: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const foodQuestions: FoodQuestion[] = [
  {
    emoji: "🍕",
    options: ["Pizza", "Burger", "Sandwich", "Pasta"],
    correct: 0,
    difficulty: 'easy'
  },
  {
    emoji: "🍎",
    options: ["Orange", "Banana", "Apple", "Grape"],
    correct: 2,
    difficulty: 'easy'
  },
  {
    emoji: "🍔",
    options: ["Pizza", "Burger", "Hot Dog", "Sandwich"],
    correct: 1,
    difficulty: 'easy'
  },
  {
    emoji: "🍝",
    options: ["Rice", "Noodles", "Pasta", "Bread"],
    correct: 2,
    difficulty: 'easy'
  },
  {
    emoji: "🍦",
    options: ["Cake", "Ice Cream", "Pudding", "Yogurt"],
    correct: 1,
    difficulty: 'easy'
  },
  {
    emoji: "🥗",
    options: ["Soup", "Salad", "Sandwich", "Pasta"],
    correct: 1,
    difficulty: 'medium'
  },
  {
    emoji: "🍣",
    options: ["Sushi", "Fish", "Rice", "Noodles"],
    correct: 0,
    difficulty: 'medium'
  },
  {
    emoji: "🥐",
    options: ["Bread", "Croissant", "Bagel", "Muffin"],
    correct: 1,
    difficulty: 'medium'
  },
  {
    emoji: "🍲",
    options: ["Soup", "Stew", "Curry", "Hot Pot"],
    correct: 3,
    difficulty: 'hard'
  },
  {
    emoji: "🥟",
    options: ["Ravioli", "Dumpling", "Meatball", "Wontons"],
    correct: 1,
    difficulty: 'hard'
  }
];

export const FoodQuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestionData = foodQuestions[currentQuestion];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState]);

  const handleTimeUp = () => {
    setStreak(0);
    nextQuestion();
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === currentQuestionData.correct;
    if (isCorrect) {
      const points = getPoints(currentQuestionData.difficulty, timeLeft);
      setScore(score + points);
      setCorrectAnswers(correctAnswers + 1);
      setStreak(streak + 1);
      toast({
        title: "Correct! 🎉",
        description: `+${points} points!`,
      });
    } else {
      setStreak(0);
      toast({
        title: "Wrong answer",
        description: `The correct answer was ${currentQuestionData.options[currentQuestionData.correct]}`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const getPoints = (difficulty: string, timeRemaining: number) => {
    const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    const timeBonus = Math.floor(timeRemaining / 3);
    return basePoints + timeBonus;
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= foodQuestions.length) {
      finishGame();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
    }
  };

  const finishGame = async () => {
    setGameState('finished');
    
    if (user && userProfile) {
      const updatedStats = {
        ...userProfile.stats,
        foodQuiz: {
          gamesPlayed: userProfile.stats.foodQuiz?.gamesPlayed ? userProfile.stats.foodQuiz.gamesPlayed + 1 : 1,
          totalScore: userProfile.stats.foodQuiz?.totalScore ? userProfile.stats.foodQuiz.totalScore + score : score,
          correctAnswers: userProfile.stats.foodQuiz?.correctAnswers ? userProfile.stats.foodQuiz.correctAnswers + correctAnswers : correctAnswers,
          bestScore: userProfile.stats.foodQuiz?.bestScore ? Math.max(userProfile.stats.foodQuiz.bestScore, score) : score,
        }
      };

      await updateUserProfile({
        stats: updatedStats,
        totalScore: userProfile.totalScore + score,
        gamesPlayed: userProfile.gamesPlayed + 1,
      });
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setGameState('playing');
    setSelectedAnswer(null);
    setStreak(0);
    setCorrectAnswers(0);
  };

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mx-auto">
              <Trophy className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Food Quiz Complete!</h2>
              <p className="text-muted-foreground">Great job on the food knowledge!</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Final Score</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{score}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Correct Answers</span>
                <span className="font-bold">{correctAnswers}/{foodQuestions.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Accuracy</span>
                <span className="font-bold">{Math.round((correctAnswers / foodQuestions.length) * 100)}%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button onClick={resetGame} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="font-bold">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {foodQuestions.length}</span>
              <span>{currentQuestionData.difficulty.charAt(0).toUpperCase() + currentQuestionData.difficulty.slice(1)}</span>
            </div>
            <Progress 
              value={(currentQuestion / foodQuestions.length) * 100} 
              className="h-2"
            />
          </div>

          {streak > 1 && (
            <div className="text-center mb-4">
              <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                🔥 {streak} streak!
              </span>
            </div>
          )}

          {/* Question */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4" role="img" aria-label="Food emoji">
              {currentQuestionData.emoji}
            </div>
            <h2 className="text-xl font-semibold mb-2">What food is this?</h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestionData.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === null ? "outline" : 
                  index === currentQuestionData.correct ? "default" :
                  selectedAnswer === index ? "destructive" : "outline"
                }
                className={`h-16 text-lg ${
                  selectedAnswer !== null && index === currentQuestionData.correct
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : selectedAnswer === index && index !== currentQuestionData.correct
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : ''
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};