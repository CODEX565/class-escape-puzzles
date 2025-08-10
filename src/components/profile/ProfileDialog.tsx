import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Target, Zap, Calendar, Brain, Flag, Type, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onOpenChange }) => {
  const { userProfile, updateUserProfile } = useAuth();

  if (!userProfile) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate overall stats
  const totalGamesPlayed = 
    (userProfile.stats?.wordle?.gamesPlayed || 0) +
    (userProfile.stats?.brainChallenges?.gamesPlayed || 0) +
    (userProfile.stats?.flagGuesser?.gamesPlayed || 0);

  const totalScore = 
    (userProfile.stats?.wordle?.totalScore || 0) +
    (userProfile.stats?.brainChallenges?.totalScore || 0) +
    (userProfile.stats?.flagGuesser?.totalScore || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Player Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-semibold">{userProfile.username}</h3>
            <p className="text-muted-foreground">{userProfile.email}</p>
          </div>

          <Separator />

          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalScore}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalGamesPlayed}</span>
              </div>
              <p className="text-sm text-muted-foreground">Games Played</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{userProfile.achievements?.length || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats">Game Stats</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="space-y-4">
              {/* WordBuzz Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-quiz-green" />
                    <h4 className="font-semibold">WordBuzz</h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Games Played:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.wordle?.gamesPlayed || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Games Won:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.wordle?.gamesWon || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Streak:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.wordle?.currentStreak || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Score:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.wordle?.totalScore || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brain Challenges Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-brain-purple" />
                    <h4 className="font-semibold">Brain Challenges</h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Games Played:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.brainChallenges?.gamesPlayed || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Correct Answers:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.brainChallenges?.correctAnswers || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-semibold ml-2">
                        {userProfile.stats?.brainChallenges?.gamesPlayed 
                          ? Math.round((userProfile.stats.brainChallenges.correctAnswers || 0) / userProfile.stats.brainChallenges.gamesPlayed * 100)
                          : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Score:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.brainChallenges?.totalScore || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flag Guesser Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-escape-orange" />
                    <h4 className="font-semibold">Flag Guesser</h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Games Played:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.flagGuesser?.gamesPlayed || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Best Streak:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.flagGuesser?.bestStreak || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Correct:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.flagGuesser?.totalCorrect || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Score:</span>
                      <span className="font-semibold ml-2">{userProfile.stats?.flagGuesser?.totalScore || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Unlocked Achievements ({userProfile.achievements?.length || 0})
                </h4>
                {userProfile.achievements && userProfile.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {userProfile.achievements.map((achievement, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-semibold">{achievement}</h5>
                              <p className="text-sm text-muted-foreground">Achievement unlocked!</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No achievements yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">Keep playing to unlock them!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Privacy Settings */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold">Privacy</h5>
                  <p className="text-sm text-muted-foreground">Hide me from leaderboards</p>
                </div>
                <Switch
                  checked={userProfile.hideOnLeaderboard ?? false}
                  onCheckedChange={(checked) => {
                    void updateUserProfile({ hideOnLeaderboard: checked });
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Member since {formatDate(userProfile.createdAt)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};