import { Button } from "@/components/ui/button";
import { Brain, Zap, Trophy } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-brain-purple flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Brain<span className="text-primary">Buzz</span>
          </h1>
        </div>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Fun brain games for students. Challenge your mind, compete with friends, and level up your learning!
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-8 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-escape-orange" />
            <span>Quick 2-minute games</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-quiz-green" />
            <span>Daily leaderboards</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-brain-purple" />
            <span>Boost your brainpower</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button size="lg" className="px-8 py-6 text-lg font-semibold">
          Start Playing Now
        </Button>
      </div>
    </section>
  );
};