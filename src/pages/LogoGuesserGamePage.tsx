import React from 'react';
import { Navigation } from '@/components/Navigation';
import { LogoGuesserGame } from '@/components/games/LogoGuesserGame';

const LogoGuesserGamePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24">
        <LogoGuesserGame />
      </main>
    </div>
  );
};

export default LogoGuesserGamePage;
