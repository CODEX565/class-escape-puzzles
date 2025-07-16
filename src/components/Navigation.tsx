import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, User, Trophy, Home, BarChart3, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UserMenu } from "@/components/auth/UserMenu";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { LeaderboardDialog } from "@/components/leaderboards/LeaderboardDialog";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [leaderboardDialogOpen, setLeaderboardDialogOpen] = useState(false);

  return (
    <>
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isHomePage ? 'w-auto' : 'w-full max-w-4xl px-4'}`}>
      <div className="bg-background/80 backdrop-blur-lg border border-border/50 rounded-2xl shadow-lg px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-brain-purple flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Brain<span className="text-primary">Buzz</span>
            </span>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {!isHomePage && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-primary/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-primary/10"
              onClick={() => {
                if (isHomePage) {
                  const gamesSection = document.getElementById('games-section');
                  gamesSection?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/#games-section');
                }
              }}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Games
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-primary/10"
              onClick={() => setLeaderboardDialogOpen(true)}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            
            {user ? (
              <UserMenu
                onProfileClick={() => setProfileDialogOpen(true)}
                onStatsClick={() => setProfileDialogOpen(true)}
                onAchievementsClick={() => setProfileDialogOpen(true)}
              />
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="hover:bg-primary/10"
                onClick={() => setAuthDialogOpen(true)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
    
    <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
    <LeaderboardDialog open={leaderboardDialogOpen} onOpenChange={setLeaderboardDialogOpen} />
    </>
  );
};