import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Trophy, Brain, Clock, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  type: 'math' | 'logic' | 'pattern' | 'riddle';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface GameStats {
  played: number;
  correct: number;
  streak: number;
  maxStreak: number;
  totalPoints: number;
}

const CHALLENGES: Challenge[] = [
  // Math Challenges
  {
    id: '1',
    type: 'math',
    question: 'If a pizza has 8 slices and you eat 3, what fraction of the pizza remains?',
    options: ['3/8', '5/8', '1/2', '2/3'],
    correctAnswer: 1,
    explanation: '8 - 3 = 5 slices remaining out of 8 total = 5/8',
    difficulty: 'easy',
    points: 10
  },
  {
    id: '2',
    type: 'logic',
    question: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    options: ['All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Cannot be determined'],
    correctAnswer: 3,
    explanation: 'We cannot determine if roses specifically fade quickly from the given information.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: '3',
    type: 'pattern',
    question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '48'],
    correctAnswer: 1,
    explanation: 'Pattern: n(n+1) where n starts at 2. Next is 7×6 = 42',
    difficulty: 'medium',
    points: 15
  },
  {
    id: '4',
    type: 'riddle',
    question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    options: ['A picture', 'A map', 'A dream', 'A book'],
    correctAnswer: 1,
    explanation: 'A map shows cities, mountains, and water but contains no actual houses, trees, or fish.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: '5',
    type: 'math',
    question: 'If 5x + 3 = 23, what is the value of x?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    explanation: '5x = 23 - 3 = 20, so x = 20 ÷ 5 = 4',
    difficulty: 'easy',
    points: 10
  },
  {
    id: '6',
    type: 'logic',
    question: 'If it takes 6 machines 6 minutes to make 6 widgets, how long does it take 100 machines to make 100 widgets?',
    options: ['6 minutes', '10 minutes', '60 minutes', '100 minutes'],
    correctAnswer: 0,
    explanation: 'Each machine makes 1 widget in 6 minutes, so 100 machines make 100 widgets in 6 minutes.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: '7',
    type: 'pattern',
    question: 'Which shape completes the pattern? Circle, Square, Triangle, Circle, Square, ?',
    options: ['Circle', 'Triangle', 'Square', 'Pentagon'],
    correctAnswer: 1,
    explanation: 'The pattern repeats every 3 shapes: Circle, Square, Triangle',
    difficulty: 'easy',
    points: 10
  },
  {
    id: '8',
    type: 'riddle',
    question: 'What gets wetter the more it dries?',
    options: ['A sponge', 'A towel', 'Hair', 'Clothes'],
    correctAnswer: 1,
    explanation: 'A towel gets wetter as it dries other things.',
    difficulty: 'easy',
    points: 10
  }
];

export const BrainChallengesGame = () => {
  const { toast } = useToast();
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [stats, setStats] = useState<GameStats>({ 
    played: 0, 
    correct: 0, 
    streak: 0, 
    maxStreak: 0, 
    totalPoints: 0 
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [usedChallenges, setUsedChallenges] = useState<string[]>([]);

  // Load stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('brain-challenges-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const startGame = useCallback(() => {
    setGameActive(true);
    setTimeLeft(60);
    setSessionScore(0);
    setUsedChallenges([]);
    setIsAnswered(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
    loadNextChallenge();
  }, []);

  const loadNextChallenge = useCallback(() => {
    const availableChallenges = CHALLENGES.filter(c => !usedChallenges.includes(c.id));
    
    if (availableChallenges.length === 0) {
      // Reset if all challenges used
      setUsedChallenges([]);
      setCurrentChallenge(CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
    } else {
      const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setUsedChallenges(prev => [...prev, randomChallenge.id]);
    }
    
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
  }, [usedChallenges]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered || !gameActive) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === currentChallenge?.correctAnswer;
    const newStats = { ...stats };
    
    newStats.played++;
    
    if (isCorrect) {
      newStats.correct++;
      newStats.streak++;
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
      newStats.totalPoints += currentChallenge?.points || 0;
      setSessionScore(prev => prev + (currentChallenge?.points || 0));
      
      toast({
        title: "🎉 Correct!",
        description: `+${currentChallenge?.points} points`,
      });
    } else {
      newStats.streak = 0;
      toast({
        title: "Not quite!",
        description: "Keep trying - you've got this!",
        variant: "destructive"
      });
    }
    
    setStats(newStats);
    localStorage.setItem('brain-challenges-stats', JSON.stringify(newStats));
    
    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (gameActive && timeLeft > 0) {
        loadNextChallenge();
      }
    }, 3000);
  };

  const endGame = () => {
    setGameActive(false);
    toast({
      title: "🧠 Time's Up!",
      description: `You scored ${sessionScore} points this session!`,
    });
  };

  const resetGame = () => {
    setGameActive(false);
    setTimeLeft(60);
    setSessionScore(0);
    setUsedChallenges([]);
    setCurrentChallenge(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'math': return '🔢';
      case 'logic': return '🧩';
      case 'pattern': return '🔍';
      case 'riddle': return '🤔';
      default: return '💭';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'math': return 'text-quiz-green';
      case 'logic': return 'text-brain-purple';
      case 'pattern': return 'text-escape-orange';
      case 'riddle': return 'text-challenge-pink';
      default: return 'text-primary';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-quiz-green/20 text-quiz-green';
      case 'medium': return 'bg-escape-orange/20 text-escape-orange';
      case 'hard': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Brain Challenges</h1>
            <p className="text-sm text-muted-foreground">Logic puzzles & mind benders</p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-quiz-green mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{stats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-escape-orange mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{Math.round((stats.correct / Math.max(stats.played, 1)) * 100)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 text-brain-purple mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4 text-center">
              <Brain className="w-6 h-6 text-challenge-pink mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{stats.maxStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        {!gameActive ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready for a Brain Challenge?</h2>
              <p className="text-muted-foreground mb-6">
                Test your logic, math skills, and pattern recognition in 60 seconds of rapid-fire challenges!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔢</div>
                  <div className="text-sm text-muted-foreground">Math</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🧩</div>
                  <div className="text-sm text-muted-foreground">Logic</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="text-sm text-muted-foreground">Patterns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🤔</div>
                  <div className="text-sm text-muted-foreground">Riddles</div>
                </div>
              </div>
              <Button size="lg" onClick={startGame} className="px-8">
                Start Challenge
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Game Timer & Score */}
            <div className="flex justify-between items-center mb-6">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-destructive" />
                  <span className="font-bold text-foreground">{timeLeft}s</span>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-quiz-green" />
                  <span className="font-bold text-foreground">{sessionScore} pts</span>
                </CardContent>
              </Card>
            </div>

            {/* Current Challenge */}
            {currentChallenge && (
              <Card className="bg-gradient-card border-border/50 mb-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getChallengeTypeIcon(currentChallenge.type)}</span>
                      <span className={`text-sm font-medium ${getChallengeTypeColor(currentChallenge.type)}`}>
                        {currentChallenge.type.toUpperCase()}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentChallenge.difficulty)}`}>
                      {currentChallenge.difficulty} • {currentChallenge.points}pts
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                    {currentChallenge.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentChallenge.options.map((option, index) => {
                      let buttonClass = "w-full p-4 text-left justify-start h-auto transition-all duration-200";
                      
                      if (isAnswered) {
                        if (index === currentChallenge.correctAnswer) {
                          buttonClass += " bg-quiz-green/20 border-quiz-green text-quiz-green";
                        } else if (index === selectedAnswer && index !== currentChallenge.correctAnswer) {
                          buttonClass += " bg-destructive/20 border-destructive text-destructive";
                        } else {
                          buttonClass += " opacity-50";
                        }
                      } else {
                        buttonClass += " hover:bg-primary/10 border-border";
                      }
                      
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isAnswered}
                        >
                          <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}</span>
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                  
                  {showExplanation && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                      <h4 className="font-semibold text-foreground mb-2">Explanation:</h4>
                      <p className="text-muted-foreground">{currentChallenge.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};