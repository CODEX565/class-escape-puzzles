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
      description: "Solve puzzles and riddles to escape before the bell rings. Our original brain-teasing adventure!",
      icon: DoorOpen,
      variant: "game-escape" as const,
      featured: true
    },
    {
      title: "Brain Challenges",
      description: "Logic puzzles, riddles, and mind-bending challenges to boost your cognitive skills.",
      icon: Brain,
      variant: "game-brain" as const
    },
    {
      title: "GeoGuessr Style",
      description: "Guess locations from street views and photos. Explore the world from your classroom!",
      icon: MapPin,
      variant: "game-challenge" as const,
      comingSoon: true
    },
    {
      title: "Wordle Games",
      description: "Daily word puzzles including Wordle, Foodle, Nerdle and more word challenges.",
      icon: Type,
      variant: "game-quiz" as const,
      comingSoon: true
    },
    {
      title: "Food Quiz",
      description: "Guess foods from emojis, ingredients, or pixelated images. Perfect for food lovers!",
      icon: UtensilsCrossed,
      variant: "game-escape" as const,
      comingSoon: true
    },
    {
      title: "Flag Guesser",
      description: "Test your geography knowledge with flags from around the world.",
      icon: Flag,
      variant: "game-brain" as const,
      comingSoon: true
    },
    {
      title: "Music Quiz",
      description: "Identify songs from short intro clips. Challenge your music knowledge!",
      icon: Music,
      variant: "game-challenge" as const,
      comingSoon: true
    },
    {
      title: "Logo Guesser",
      description: "Recognize brands and logos from partial images or creative hints.",
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
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">
              BrainBuzz - Making learning fun, one game at a time. 🧠✨
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
