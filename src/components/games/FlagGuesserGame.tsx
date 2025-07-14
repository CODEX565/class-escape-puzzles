import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Trophy, Flag, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Country {
  name: string;
  flag: string;
  region: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const COUNTRIES: Country[] = [
  // Easy countries
  { name: 'United States', flag: '🇺🇸', region: 'North America', difficulty: 'easy' },
  { name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', difficulty: 'easy' },
  { name: 'France', flag: '🇫🇷', region: 'Europe', difficulty: 'easy' },
  { name: 'Germany', flag: '🇩🇪', region: 'Europe', difficulty: 'easy' },
  { name: 'Japan', flag: '🇯🇵', region: 'Asia', difficulty: 'easy' },
  { name: 'Canada', flag: '🇨🇦', region: 'North America', difficulty: 'easy' },
  { name: 'Australia', flag: '🇦🇺', region: 'Oceania', difficulty: 'easy' },
  { name: 'Italy', flag: '🇮🇹', region: 'Europe', difficulty: 'easy' },
  { name: 'Spain', flag: '🇪🇸', region: 'Europe', difficulty: 'easy' },
  { name: 'Brazil', flag: '🇧🇷', region: 'South America', difficulty: 'easy' },
  
  // Medium countries
  { name: 'Netherlands', flag: '🇳🇱', region: 'Europe', difficulty: 'medium' },
  { name: 'Sweden', flag: '🇸🇪', region: 'Europe', difficulty: 'medium' },
  { name: 'Norway', flag: '🇳🇴', region: 'Europe', difficulty: 'medium' },
  { name: 'South Korea', flag: '🇰🇷', region: 'Asia', difficulty: 'medium' },
  { name: 'Mexico', flag: '🇲🇽', region: 'North America', difficulty: 'medium' },
  { name: 'Argentina', flag: '🇦🇷', region: 'South America', difficulty: 'medium' },
  { name: 'South Africa', flag: '🇿🇦', region: 'Africa', difficulty: 'medium' },
  { name: 'Turkey', flag: '🇹🇷', region: 'Asia', difficulty: 'medium' },
  { name: 'Thailand', flag: '🇹🇭', region: 'Asia', difficulty: 'medium' },
  { name: 'Egypt', flag: '🇪🇬', region: 'Africa', difficulty: 'medium' },
  
  // Hard countries
  { name: 'Estonia', flag: '🇪🇪', region: 'Europe', difficulty: 'hard' },
  { name: 'Latvia', flag: '🇱🇻', region: 'Europe', difficulty: 'hard' },
  { name: 'Lithuania', flag: '🇱🇹', region: 'Europe', difficulty: 'hard' },
  { name: 'Bangladesh', flag: '🇧🇩', region: 'Asia', difficulty: 'hard' },
  { name: 'Uruguay', flag: '🇺🇾', region: 'South America', difficulty: 'hard' },
  { name: 'Morocco', flag: '🇲🇦', region: 'Africa', difficulty: 'hard' },
  { name: 'Nepal', flag: '🇳🇵', region: 'Asia', difficulty: 'hard' },
  { name: 'Slovenia', flag: '🇸🇮', region: 'Europe', difficulty: 'hard' },
];

interface GameStats {
  correct: number;
  total: number;
  streak: number;
  maxStreak: number;
}

export const FlagGuesserGame = () => {
  const { toast } = useToast();
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState<GameStats>({ correct: 0, total: 0, streak: 0, maxStreak: 0 });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  useEffect(() => {
    generateQuestion();
    // Load stats from localStorage
    const savedStats = localStorage.getItem('flag-guesser-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, [difficulty]);

  const generateQuestion = useCallback(() => {
    const filteredCountries = COUNTRIES.filter(country => country.difficulty === difficulty);
    const correct = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
    
    // Get 3 wrong answers from the same difficulty
    const wrongAnswers = filteredCountries
      .filter(country => country.name !== correct.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Shuffle all options
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setCurrentCountry(correct);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [difficulty]);

  const handleAnswer = (selectedCountry: string) => {
    if (showResult) return;
    
    setSelectedAnswer(selectedCountry);
    const correct = selectedCountry === currentCountry?.name;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update stats
    const newStats = {
      ...stats,
      total: stats.total + 1,
      correct: correct ? stats.correct + 1 : stats.correct,
      streak: correct ? stats.streak + 1 : 0,
      maxStreak: correct ? Math.max(stats.maxStreak, stats.streak + 1) : stats.maxStreak
    };
    setStats(newStats);
    localStorage.setItem('flag-guesser-stats', JSON.stringify(newStats));
    
    // Show toast
    if (correct) {
      toast({
        title: "🎉 Correct!",
        description: `Well done! That's the flag of ${currentCountry?.name}`,
      });
    } else {
      toast({
        title: "❌ Incorrect",
        description: `That's the flag of ${currentCountry?.name}`,
        variant: "destructive"
      });
    }
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const resetStats = () => {
    const emptyStats = { correct: 0, total: 0, streak: 0, maxStreak: 0 };
    setStats(emptyStats);
    localStorage.setItem('flag-guesser-stats', JSON.stringify(emptyStats));
    toast({
      title: "Stats Reset",
      description: "Your game statistics have been reset.",
    });
  };

  const getOptionClass = (countryName: string) => {
    const baseClass = "w-full p-4 text-left font-medium rounded-lg transition-all duration-200 hover:scale-105";
    
    if (!showResult) {
      return `${baseClass} bg-secondary hover:bg-secondary/80 text-foreground border border-border`;
    }
    
    if (countryName === currentCountry?.name) {
      return `${baseClass} bg-quiz-green text-white border-quiz-green`;
    } else if (countryName === selectedAnswer) {
      return `${baseClass} bg-destructive text-white border-destructive`;
    } else {
      return `${baseClass} bg-muted text-muted-foreground border-border opacity-60`;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-quiz-green';
      case 'medium': return 'text-escape-orange';
      case 'hard': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Flag Guesser</h1>
            <p className="text-sm text-muted-foreground">Test your geography knowledge</p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetStats}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Difficulty Selector */}
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-foreground">Difficulty:</span>
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  size="sm"
                  variant={difficulty === diff ? "default" : "ghost"}
                  onClick={() => setDifficulty(diff)}
                  className={`capitalize ${getDifficultyColor(diff)}`}
                >
                  {diff}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.maxStreak}</div>
                <div className="text-xs text-muted-foreground">Best</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game */}
        {currentCountry && (
          <>
            {/* Flag Display */}
            <Card className="mb-6 bg-gradient-card border-border/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg text-foreground">Which country does this flag belong to?</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <div className="text-9xl mb-4 animate-bounce-in">
                  {currentCountry.flag}
                </div>
                <div className="text-sm text-muted-foreground">
                  Region: {currentCountry.region} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card className="mb-6 bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {options.map((country, index) => (
                    <Button
                      key={index}
                      className={getOptionClass(country.name)}
                      onClick={() => handleAnswer(country.name)}
                      disabled={showResult}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{country.name}</span>
                        {showResult && country.name === currentCountry.name && (
                          <Check className="w-5 h-5" />
                        )}
                        {showResult && country.name === selectedAnswer && country.name !== currentCountry.name && (
                          <X className="w-5 h-5" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Button */}
            {showResult && (
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    {isCorrect ? (
                      <Trophy className="w-12 h-12 text-quiz-green mx-auto" />
                    ) : (
                      <Flag className="w-12 h-12 text-muted-foreground mx-auto" />
                    )}
                    <Button onClick={nextQuestion} size="lg" className="px-8">
                      Next Flag
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};