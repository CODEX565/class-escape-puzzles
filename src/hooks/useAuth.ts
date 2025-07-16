import { useState, useEffect, createContext, useContext } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  createdAt: Date;
  totalScore: number;
  gamesPlayed: number;
  achievements: string[];
  wordleStats: {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
  };
  brainChallengeStats: {
    totalAnswered: number;
    correctAnswers: number;
    bestStreak: number;
    avgTimePerQuestion: number;
  };
  flagGuesserStats: {
    played: number;
    won: number;
    bestScore: number;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setUserProfile({
            ...data,
            createdAt: data.createdAt.toDate()
          } as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: username });
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      username,
      createdAt: new Date(),
      totalScore: 0,
      gamesPlayed: 0,
      achievements: [],
      wordleStats: {
        played: 0,
        won: 0,
        currentStreak: 0,
        maxStreak: 0,
      },
      brainChallengeStats: {
        totalAnswered: 0,
        correctAnswers: 0,
        bestStreak: 0,
        avgTimePerQuestion: 0,
      },
      flagGuesserStats: {
        played: 0,
        won: 0,
        bestScore: 0,
      },
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    setUserProfile(userProfile);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    const updatedProfile = { ...userProfile, ...updates };
    await setDoc(doc(db, 'users', user.uid), updatedProfile);
    setUserProfile(updatedProfile);
  };

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
    updateUserProfile,
  };
};

export { AuthContext };