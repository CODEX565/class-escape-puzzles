import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "game-brain" | "game-escape" | "game-quiz" | "game-challenge";
  comingSoon?: boolean;
  featured?: boolean;
}

export const GameCard = ({ 
  title, 
  description, 
  icon: Icon, 
  variant, 
  comingSoon = false,
  featured = false 
}: GameCardProps) => {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      {featured && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
          Featured
        </div>
      )}
      {comingSoon && (
        <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
          Coming Soon
        </div>
      )}
      
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-background to-secondary flex items-center justify-center mb-2">
          <Icon className="w-8 h-8 text-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button 
          variant={variant}
          className="w-full"
          disabled={comingSoon}
        >
          {comingSoon ? "Coming Soon" : "Play Now"}
        </Button>
      </CardContent>
    </Card>
  );
};