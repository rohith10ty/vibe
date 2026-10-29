import React, { useState, useCallback } from 'react';
import OrbitMenu from './components/OrbitMenu';
import HeroLoader from './components/HeroLoader';

export default function App() {
  const [replayKey, setReplayKey] = useState(0);
  const [showHeader, setShowHeader] = useState(false);

  const handleRevealHeader = useCallback(() => {
    setShowHeader(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowHeader(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black font-sans selection:bg-[#ff1100] selection:text-white">
      {/* VIBE Header with Orbit Studio Menu */}
      <OrbitMenu isVisible={showHeader} />

      {/* Hero Loader with custom center photo */}
      <main>
        <HeroLoader
          replayKey={replayKey}
          onRevealHeader={handleRevealHeader}
          onAnimationComplete={handleAnimationComplete}
        />
      </main>
    </div>
  );
}
