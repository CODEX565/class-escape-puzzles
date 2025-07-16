import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface DailyChallenge {
  id: string;
  date: string;
  type: 'wordle' | 'brain' | 'flag';
  title: string;
  description: string;
  targetScore: number;
  reward: number;
  completed: boolean;
}

export const useDailyChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDailyChallenges();
    }
  }, [user]);

  const loadDailyChallenges = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const challengeDoc = await getDoc(doc(db, 'dailyChallenges', user.uid));
      const existingData = challengeDoc.exists() ? challengeDoc.data() : {};
      
      // Check if we need to generate new challenges for today
      if (!existingData[today]) {
        const newChallenges = generateDailyChallenges(today);
        await setDoc(doc(db, 'dailyChallenges', user.uid), {
          ...existingData,
          [today]: newChallenges
        });
        setChallenges(newChallenges);
      } else {
        setChallenges(existingData[today]);
      }
    } catch (error) {
      console.error('Error loading daily challenges:', error);
      // Generate default challenges if there's an error
      setChallenges(generateDailyChallenges(today));
    } finally {
      setLoading(false);
    }
  };

  const generateDailyChallenges = (date: string): DailyChallenge[] => {
    return [
      {
        id: `wordle_${date}`,
        date,
        type: 'wordle',
        title: 'Word Master',
        description: 'Win a WordBuzz game in 4 tries or less',
        targetScore: 100,
        reward: 50,
        completed: false
      },
      {
        id: `brain_${date}`,
        date,
        type: 'brain',
        title: 'Brain Boost',
        description: 'Answer 10 brain challenge questions correctly',
        targetScore: 10,
        reward: 30,
        completed: false
      },
      {
        id: `flag_${date}`,
        date,
        type: 'flag',
        title: 'Geography Guru',
        description: 'Score 500+ points in Flag Guesser',
        targetScore: 500,
        reward: 40,
        completed: false
      }
    ];
  };

  const completeDailyChallenge = async (challengeId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedChallenges = challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, completed: true } : challenge
    );

    setChallenges(updatedChallenges);

    try {
      const challengeDoc = await getDoc(doc(db, 'dailyChallenges', user.uid));
      const existingData = challengeDoc.exists() ? challengeDoc.data() : {};
      
      await setDoc(doc(db, 'dailyChallenges', user.uid), {
        ...existingData,
        [today]: updatedChallenges
      });
    } catch (error) {
      console.error('Error updating daily challenge:', error);
    }
  };

  return {
    challenges,
    loading,
    completeDailyChallenge
  };
};