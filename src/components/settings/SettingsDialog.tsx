import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { userProfile, updateUserProfile } = useAuth();

  if (!userProfile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account */}
          <div>
            <h4 className="font-semibold mb-2">Account</h4>
            <Card>
              <CardContent className="p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{userProfile.username}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{userProfile.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy */}
          <div>
            <h4 className="font-semibold mb-2">Privacy</h4>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Hide me from leaderboards</Label>
                    <p className="text-sm text-muted-foreground">Exclude your profile from public rankings.</p>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};