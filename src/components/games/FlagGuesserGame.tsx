import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Trophy, Star, RotateCcw, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAchievements } from '@/hooks/useAchievements';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface Country {
  code: string;
  name: string;
  flagUrl: string;
}

// Popular countries with their flag URLs from a reliable CDN
const countries: Country[] = [
  { code: 'US', name: 'United States', flagUrl: 'https://flagcdn.com/256x192/us.png' },
  { code: 'CA', name: 'Canada', flagUrl: 'https://flagcdn.com/256x192/ca.png' },
  { code: 'GB', name: 'United Kingdom', flagUrl: 'https://flagcdn.com/256x192/gb.png' },
  { code: 'FR', name: 'France', flagUrl: 'https://flagcdn.com/256x192/fr.png' },
  { code: 'DE', name: 'Germany', flagUrl: 'https://flagcdn.com/256x192/de.png' },
  { code: 'IT', name: 'Italy', flagUrl: 'https://flagcdn.com/256x192/it.png' },
  { code: 'ES', name: 'Spain', flagUrl: 'https://flagcdn.com/256x192/es.png' },
  { code: 'JP', name: 'Japan', flagUrl: 'https://flagcdn.com/256x192/jp.png' },
  { code: 'CN', name: 'China', flagUrl: 'https://flagcdn.com/256x192/cn.png' },
  { code: 'IN', name: 'India', flagUrl: 'https://flagcdn.com/256x192/in.png' },
  { code: 'BR', name: 'Brazil', flagUrl: 'https://flagcdn.com/256x192/br.png' },
  { code: 'AU', name: 'Australia', flagUrl: 'https://flagcdn.com/256x192/au.png' },
  { code: 'RU', name: 'Russia', flagUrl: 'https://flagcdn.com/256x192/ru.png' },
  { code: 'MX', name: 'Mexico', flagUrl: 'https://flagcdn.com/256x192/mx.png' },
  { code: 'AR', name: 'Argentina', flagUrl: 'https://flagcdn.com/256x192/ar.png' },
  { code: 'ZA', name: 'South Africa', flagUrl: 'https://flagcdn.com/256x192/za.png' },
  { code: 'EG', name: 'Egypt', flagUrl: 'https://flagcdn.com/256x192/eg.png' },
  { code: 'NG', name: 'Nigeria', flagUrl: 'https://flagcdn.com/256x192/ng.png' },
  { code: 'KR', name: 'South Korea', flagUrl: 'https://flagcdn.com/256x192/kr.png' },
  { code: 'TH', name: 'Thailand', flagUrl: 'https://flagcdn.com/256x192/th.png' },
  { code: 'TR', name: 'Turkey', flagUrl: 'https://flagcdn.com/256x192/tr.png' },
  { code: 'SA', name: 'Saudi Arabia', flagUrl: 'https://flagcdn.com/256x192/sa.png' },
  { code: 'NL', name: 'Netherlands', flagUrl: 'https://flagcdn.com/256x192/nl.png' },
  { code: 'BE', name: 'Belgium', flagUrl: 'https://flagcdn.com/256x192/be.png' },
  { code: 'CH', name: 'Switzerland', flagUrl: 'https://flagcdn.com/256x192/ch.png' },
  { code: 'SE', name: 'Sweden', flagUrl: 'https://flagcdn.com/256x192/se.png' },
  { code: 'NO', name: 'Norway', flagUrl: 'https://flagcdn.com/256x192/no.png' },
  { code: 'DK', name: 'Denmark', flagUrl: 'https://flagcdn.com/256x192/dk.png' },
  { code: 'FI', name: 'Finland', flagUrl: 'https://flagcdn.com/256x192/fi.png' },
  { code: 'PT', name: 'Portugal', flagUrl: 'https://flagcdn.com/256x192/pt.png' },
  { code: 'GR', name: 'Greece', flagUrl: 'https://flagcdn.com/256x192/gr.png' },
  { code: 'IE', name: 'Ireland', flagUrl: 'https://flagcdn.com/256x192/ie.png' },
  { code: 'AT', name: 'Austria', flagUrl: 'https://flagcdn.com/256x192/at.png' },
  { code: 'PL', name: 'Poland', flagUrl: 'https://flagcdn.com/256x192/pl.png' },
  { code: 'CZ', name: 'Czech Republic', flagUrl: 'https://flagcdn.com/256x192/cz.png' },
  { code: 'HU', name: 'Hungary', flagUrl: 'https://flagcdn.com/256x192/hu.png' },
  { code: 'SK', name: 'Slovakia', flagUrl: 'https://flagcdn.com/256x192/sk.png' },
  { code: 'RO', name: 'Romania', flagUrl: 'https://flagcdn.com/256x192/ro.png' },
  { code: 'BG', name: 'Bulgaria', flagUrl: 'https://flagcdn.com/256x192/bg.png' },
  { code: 'HR', name: 'Croatia', flagUrl: 'https://flagcdn.com/256x192/hr.png' },
  { code: 'SI', name: 'Slovenia', flagUrl: 'https://flagcdn.com/256x192/si.png' },
  { code: 'LT', name: 'Lithuania', flagUrl: 'https://flagcdn.com/256x192/lt.png' },
  { code: 'LV', name: 'Latvia', flagUrl: 'https://flagcdn.com/256x192/lv.png' },
  { code: 'EE', name: 'Estonia', flagUrl: 'https://flagcdn.com/256x192/ee.png' },
  { code: 'UA', name: 'Ukraine', flagUrl: 'https://flagcdn.com/256x192/ua.png' },
  { code: 'BY', name: 'Belarus', flagUrl: 'https://flagcdn.com/256x192/by.png' },
  { code: 'MD', name: 'Moldova', flagUrl: 'https://flagcdn.com/256x192/md.png' },
  { code: 'RS', name: 'Serbia', flagUrl: 'https://flagcdn.com/256x192/rs.png' },
  { code: 'ME', name: 'Montenegro', flagUrl: 'https://flagcdn.com/256x192/me.png' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flagUrl: 'https://flagcdn.com/256x192/ba.png' },
  { code: 'MK', name: 'North Macedonia', flagUrl: 'https://flagcdn.com/256x192/mk.png' }
];

interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  totalQuestions: number;
  correctAnswers: number;
  timeLeft: number;
  gameEnded: boolean;
}

export const FlagGuesserGame: React.FC = () => {
  const { user } = useAuth();
  const { checkAchievements } = useAchievements();
  
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [usedCountries, setUsedCountries] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    timeLeft: 120,
    gameEnded: false
  });

  const generateQuestion = useCallback(() => {
    const availableCountries = countries.filter(country => !usedCountries.has(country.code));
    
    if (availableCountries.length < 4) {
      setUsedCountries(new Set());
      return generateQuestion();
    }

    const correct = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    const incorrect = countries
      .filter(c => c.code !== correct.code)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const shuffledOptions = [correct, ...incorrect].sort(() => Math.random() - 0.5);
    
    setCurrentCountry(correct);
    setOptions(shuffledOptions);
    setUsedCountries(prev => new Set([...prev, correct.code]));
    setSelectedAnswer(null);
    setShowResult(false);
  }, [usedCountries]);

  const handleAnswer = async (selectedCountry: Country) => {
    if (selectedAnswer || showResult || gameStats.gameEnded) return;

    setSelectedAnswer(selectedCountry.code);
    setShowResult(true);

    const isCorrect = selectedCountry.code === currentCountry?.code;
    const points = isCorrect ? (gameStats.streak >= 5 ? 15 : 10) : 0;

    setGameStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newStats = {
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
      };

      return newStats;
    });

    // Check achievements after updating stats
    setTimeout(() => {
      checkAchievements();
      if (gameStats.timeLeft > 0) {
        generateQuestion();
      }
    }, 1500);
  };

  const startNewGame = () => {
    setGameStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      timeLeft: 120,
      gameEnded: false
    });
    setUsedCountries(new Set());
    generateQuestion();
  };

  const endGame = useCallback(async () => {
    setGameStats(prev => ({ ...prev, gameEnded: true }));
    
    if (user && gameStats.score > 0) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          'stats.flagGuesser.totalScore': increment(gameStats.score),
          'stats.flagGuesser.gamesPlayed': increment(1),
          'stats.flagGuesser.bestStreak': increment(0),
          'stats.flagGuesser.totalCorrect': increment(gameStats.correctAnswers)
        });

        checkAchievements();
        
        toast({
          title: "Game Complete!",
          description: `Final Score: ${gameStats.score} points`,
        });
      } catch (error) {
        console.error('Error saving game stats:', error);
      }
    }
  }, [user, gameStats, checkAchievements]);

  // Timer effect
  useEffect(() => {
    if (gameStats.timeLeft > 0 && !gameStats.gameEnded) {
      const timer = setTimeout(() => {
        setGameStats(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStats.timeLeft === 0 && !gameStats.gameEnded) {
      endGame();
    }
  }, [gameStats.timeLeft, gameStats.gameEnded, endGame]);

  // Initialize game
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const accuracy = gameStats.totalQuestions > 0 
    ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) 
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameStats.gameEnded) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Game Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{gameStats.score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{gameStats.bestStreak}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{gameStats.correctAnswers}/{gameStats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
            </div>
            <Button onClick={startNewGame} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Flag Guesser
              {gameStats.streak >= 5 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {gameStats.streak}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {formatTime(gameStats.timeLeft)}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {gameStats.score}
              </div>
            </div>
          </div>
          <Progress value={(120 - gameStats.timeLeft) / 120 * 100} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentCountry && (
            <>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Which country does this flag belong to?</h3>
                <div className="flex justify-center mb-6">
                  <img 
                    src={currentCountry.flagUrl}
                    alt="Flag to guess"
                    className="w-48 h-36 object-cover rounded-lg shadow-lg border"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="192"><rect width="256" height="192" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">Flag Image</text></svg>`;
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {options.map((country) => {
                  const isSelected = selectedAnswer === country.code;
                  const isCorrect = country.code === currentCountry.code;
                  const showAnswer = showResult;
                  
                  let buttonClass = "w-full p-4 text-left transition-all";
                  
                  if (showAnswer) {
                    if (isCorrect) {
                      buttonClass += " bg-green-100 border-green-500 text-green-800";
                    } else if (isSelected) {
                      buttonClass += " bg-red-100 border-red-500 text-red-800";
                    } else {
                      buttonClass += " bg-muted";
                    }
                  } else {
                    buttonClass += " hover:bg-accent";
                  }

                  return (
                    <Button
                      key={country.code}
                      variant="outline"
                      className={buttonClass}
                      onClick={() => handleAnswer(country)}
                      disabled={showResult}
                    >
                      {country.name}
                    </Button>
                  );
                })}
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Accuracy: {accuracy}%</span>
                <span>Streak: {gameStats.streak}</span>
                <span>Question {gameStats.totalQuestions + 1}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};