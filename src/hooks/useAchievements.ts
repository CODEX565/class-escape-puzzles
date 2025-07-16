import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (userProfile: any) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first_game',
    name: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    condition: (profile) => profile.gamesPlayed >= 1
  },
  {
    id: 'wordle_winner',
    name: 'Word Wizard',
    description: 'Win your first WordBuzz game',
    icon: '📝',
    condition: (profile) => profile.wordleStats.won >= 1
  },
  {
    id: 'wordle_streak_5',
    name: 'On Fire!',
    description: 'Get a 5-game winning streak in WordBuzz',
    icon: '🔥',
    condition: (profile) => profile.wordleStats.currentStreak >= 5
  },
  {
    id: 'brain_genius',
    name: 'Brain Genius',
    description: 'Answer 50 brain challenge questions correctly',
    icon: '🧠',
    condition: (profile) => profile.brainChallengeStats.correctAnswers >= 50
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Average under 5 seconds per brain challenge question',
    icon: '⚡',
    condition: (profile) => profile.brainChallengeStats.avgTimePerQuestion > 0 && profile.brainChallengeStats.avgTimePerQuestion < 5000
  },
  {
    id: 'flag_master',
    name: 'Flag Master',
    description: 'Win 10 flag guesser games',
    icon: '🌍',
    condition: (profile) => profile.flagGuesserStats.won >= 10
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Reach 1000 total points',
    icon: '🏆',
    condition: (profile) => profile.totalScore >= 1000
  },
  {
    id: 'dedicated_player',
    name: 'Dedicated Player',
    description: 'Play 100 games',
    icon: '🎯',
    condition: (profile) => profile.gamesPlayed >= 100
  }
];

export const useAchievements = () => {
  const { userProfile, updateUserProfile } = useAuth();

  const checkAchievements = async () => {
    if (!userProfile) return;

    const newAchievements: string[] = [];

    for (const achievement of achievements) {
      if (!userProfile.achievements.includes(achievement.id) && achievement.condition(userProfile)) {
        newAchievements.push(achievement.id);
      }
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...userProfile.achievements, ...newAchievements];
      await updateUserProfile({ achievements: updatedAchievements });

      // Show toast for each new achievement
      newAchievements.forEach(achievementId => {
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
          toast({
            title: `Achievement Unlocked! ${achievement.icon}`,
            description: `${achievement.name}: ${achievement.description}`,
          });
        }
      });
    }
  };

  return { checkAchievements, achievements };
};