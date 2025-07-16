import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Target, Zap, Calendar } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onOpenChange }) => {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{userProfile.totalScore}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{userProfile.gamesPlayed}</span>
              </div>
              <p className="text-sm text-muted-foreground">Games Played</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Achievements ({userProfile.achievements.length})
            </h4>
            {userProfile.achievements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userProfile.achievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary">
                    {achievement}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No achievements yet. Keep playing to unlock them!</p>
            )}
          </div>

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