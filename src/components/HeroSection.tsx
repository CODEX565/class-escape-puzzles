import { Button } from "@/components/ui/button";
import { Brain, Zap, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brain-purple/5"></div>
      
      <div className="relative max-w-5xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-game">
            <Brain className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Brain<span className="text-primary">Buzz</span>
          </h1>
        </div>
        
        {/* Tagline */}
        <div className="text-center mb-10 animate-slide-up">
          <p className="text-2xl md:text-3xl text-foreground font-medium mb-4 max-w-3xl mx-auto leading-tight">
            The ultimate brain training platform for students
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Challenge your mind, compete with friends, and boost your learning with our collection of engaging brain games designed specifically for students.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md border border-border/50">
            <Zap className="w-8 h-8 text-escape-orange mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">2min</div>
            <div className="text-sm text-muted-foreground">Quick Games</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md border border-border/50">
            <Trophy className="w-8 h-8 text-quiz-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">Daily</div>
            <div className="text-sm text-muted-foreground">Leaderboards</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md border border-border/50">
            <Brain className="w-8 h-8 text-brain-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">8+</div>
            <div className="text-sm text-muted-foreground">Game Types</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md border border-border/50">
            <Users className="w-8 h-8 text-challenge-pink mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">1000+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="text-center animate-bounce-in">
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg" 
              className="px-10 py-6 text-lg font-semibold shadow-game hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/games/wordle')}
            >
              Start Playing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-6 text-lg font-medium border-2 hover:bg-primary/5"
              onClick={() => {
                const gamesSection = document.getElementById('games-section');
                gamesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View All Games
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};