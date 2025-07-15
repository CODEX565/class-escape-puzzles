import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { GameCard } from "@/components/GameCard";
import { 
  Brain, 
  DoorOpen, 
  MapPin, 
  Type, 
  UtensilsCrossed, 
  Flag, 
  Music, 
  Image 
} from "lucide-react";

const Index = () => {
  const games = [
    {
      title: "Escape the Class",
      description: "Solve puzzles and riddles to escape before the bell rings. Outsmart your surroundings, find clues, and break free from the classroom in our original brain-teasing adventure!",
      icon: DoorOpen,
      variant: "game-escape" as const,
      featured: true,
      comingSoon: true
    },
    {
      title: "WordBuzz",
      description: "Wordle, Foodle, Nerdle, and more! Crack the word codes in daily challenges designed to stretch your vocabulary and wit.",
      icon: Type,
      variant: "game-quiz" as const,
      gameUrl: "/games/wordle"
    },
    {
      title: "Flag Guesser",
      description: "Test your geography skills by matching flags to countries. Simple, fast, and fun — learn world flags while you play.",
      icon: Flag,
      variant: "game-brain" as const,
      gameUrl: "/games/flag-guesser"
    },
    {
      title: "Brain Challenges",
      description: "Logic puzzles, riddles, and mind-bending challenges to boost your focus and cognitive skills — perfect for morning tutor time or study breaks.",
      icon: Brain,
      variant: "game-brain" as const,
      comingSoon: true
    },
    {
      title: "Geo Explorer",
      description: "Guess the location from street views and photos. Explore the world without leaving your seat in this GeoGuessr-inspired challenge.",
      icon: MapPin,
      variant: "game-challenge" as const,
      comingSoon: true
    },
    {
      title: "Food Quiz",
      description: "Guess foods using emojis, ingredients, or blurry images. Perfect for foodies and trivia lovers.",
      icon: UtensilsCrossed,
      variant: "game-escape" as const,
      comingSoon: true
    },
    {
      title: "Music Quiz",
      description: "Guess songs from just the intro clip. Challenge your friends and see who has the best music memory.",
      icon: Music,
      variant: "game-challenge" as const,
      comingSoon: true
    },
    {
      title: "Logo Guesser",
      description: "Identify famous brands and logos from partial or pixelated images. A fun way to test your pop culture and marketing smarts.",
      icon: Image,
      variant: "game-quiz" as const,
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        
        {/* Games Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Choose Your Challenge
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From escape rooms to word puzzles, we've got brain games for every student. 
                Start with our featured game or explore other challenges!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game, index) => (
                <GameCard
                  key={index}
                  title={game.title}
                  description={game.description}
                  icon={game.icon}
                  variant={game.variant}
                  comingSoon={game.comingSoon}
                  featured={game.featured}
                  gameUrl={game.gameUrl}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">
              BrainBuzz - Making learning fun, one game at a time. 🎓 Designed for students. Powered by curiosity. Ready for tutor time.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
