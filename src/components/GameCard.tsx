import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "game-brain" | "game-escape" | "game-quiz" | "game-challenge";
  comingSoon?: boolean;
  featured?: boolean;
  gameUrl?: string;
}

export const GameCard = ({ 
  title, 
  description, 
  icon: Icon, 
  variant, 
  comingSoon = false,
  featured = false,
  gameUrl 
}: GameCardProps) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (!comingSoon && gameUrl) {
      navigate(gameUrl);
    }
  };

  return (
    <Card className={`group relative overflow-hidden bg-gradient-card border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary/20 ${featured ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      {featured && (
        <div className="absolute top-3 right-3 bg-gradient-primary text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md animate-bounce-in">
          ⭐ Featured
        </div>
      )}
      {comingSoon && (
        <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full font-medium border border-border">
          Coming Soon
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-background to-secondary/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
          <Icon className="w-10 h-10 text-foreground group-hover:text-primary transition-colors duration-300" />
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed px-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button 
          variant={variant}
          className="w-full"
          disabled={comingSoon}
          onClick={handlePlayClick}
        >
          {comingSoon ? "Coming Soon" : "Play Now"}
        </Button>
      </CardContent>
    </Card>
  );
};