import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
}

export const LeaderboardDialog: React.FC<LeaderboardDialogProps> = ({ open, onOpenChange }) => {
  const [totalScoreLeaderboard, setTotalScoreLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [wordleLeaderboard, setWordleLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [brainChallengeLeaderboard, setBrainChallengeLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchLeaderboards();
    }
  }, [open]);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      // Fetch total score leaderboard
      const totalScoreQuery = query(
        collection(db, 'users'),
        orderBy('totalScore', 'desc'),
        limit(10)
      );
      const totalScoreSnapshot = await getDocs(totalScoreQuery);
      const totalScoreData = totalScoreSnapshot.docs.map((doc, index) => ({
        username: doc.data().username,
        score: doc.data().totalScore,
        rank: index + 1
      }));
      setTotalScoreLeaderboard(totalScoreData);

      // Fetch wordle leaderboard (by win rate)
      const wordleQuery = query(
        collection(db, 'users'),
        orderBy('wordleStats.won', 'desc'),
        limit(10)
      );
      const wordleSnapshot = await getDocs(wordleQuery);
      const wordleData = wordleSnapshot.docs.map((doc, index) => ({
        username: doc.data().username,
        score: doc.data().wordleStats.won,
        rank: index + 1
      }));
      setWordleLeaderboard(wordleData);

      // Fetch brain challenge leaderboard (by accuracy)
      const brainQuery = query(
        collection(db, 'users'),
        orderBy('brainChallengeStats.correctAnswers', 'desc'),
        limit(10)
      );
      const brainSnapshot = await getDocs(brainQuery);
      const brainData = brainSnapshot.docs.map((doc, index) => ({
        username: doc.data().username,
        score: doc.data().brainChallengeStats.correctAnswers,
        rank: index + 1
      }));
      setBrainChallengeLeaderboard(brainData);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const LeaderboardList = ({ data, scoreLabel }: { data: LeaderboardEntry[], scoreLabel: string }) => (
    <div className="space-y-2">
      {data.map((entry) => (
        <div key={entry.username} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center space-x-3">
            {getRankIcon(entry.rank)}
            <span className="font-medium">{entry.username}</span>
          </div>
          <Badge variant="secondary">{entry.score} {scoreLabel}</Badge>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Leaderboards
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="total" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="total">Total Score</TabsTrigger>
            <TabsTrigger value="wordle">WordBuzz</TabsTrigger>
            <TabsTrigger value="brain">Brain Challenge</TabsTrigger>
          </TabsList>
          
          <TabsContent value="total" className="mt-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <LeaderboardList data={totalScoreLeaderboard} scoreLabel="points" />
            )}
          </TabsContent>
          
          <TabsContent value="wordle" className="mt-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <LeaderboardList data={wordleLeaderboard} scoreLabel="wins" />
            )}
          </TabsContent>
          
          <TabsContent value="brain" className="mt-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <LeaderboardList data={brainChallengeLeaderboard} scoreLabel="correct" />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};