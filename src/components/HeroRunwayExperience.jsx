import React, { useRef, useState, useEffect } from 'react';
import HeroLoader from './HeroLoader';
import RunwaySection from './RunwaySection';

export default function HeroRunwayExperience({
  replayKey,
  onRevealHeader,
  onAnimationComplete,
  onAddToCart,
  onOpenShop,
  onOpenAiStylist,
  onDrawerStateChange,
}) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth crossfade calculations
  // Progress 0.00 -> 0.30: Hero 100%
  // Progress 0.30 -> 0.55: Hero fades out (1 -> 0)
  // Progress 0.45 -> 0.70: Runway fades in (0 -> 1)
  // Progress 0.70 -> 1.00: Runway 100%
  let heroOpacity = 1;
  let runwayOpacity = 0;

  if (scrollProgress <= 0.3) {
    heroOpacity = 1;
    runwayOpacity = 0;
  } else if (scrollProgress > 0.3 && scrollProgress < 0.55) {
    heroOpacity = 1 - (scrollProgress - 0.3) / 0.25;
    runwayOpacity = scrollProgress > 0.45 ? (scrollProgress - 0.45) / 0.15 : 0;
  } else if (scrollProgress >= 0.55 && scrollProgress <= 0.7) {
    heroOpacity = 0;
    runwayOpacity = (scrollProgress - 0.45) / 0.25;
  } else {
    heroOpacity = 0;
    runwayOpacity = 1;
  }

  heroOpacity = Math.min(Math.max(heroOpacity, 0), 1);
  runwayOpacity = Math.min(Math.max(runwayOpacity, 0), 1);

  return (
    <div
      ref={containerRef}
      id="hero-runway-container"
      className="relative w-full h-[210vh] bg-[#f4f0e6]"
    >
      {/* Invisible anchor target for #runway navigation */}
      <div id="runway" className="absolute top-[55%] left-0 w-full h-1 pointer-events-none" />

      {/* Sticky Fullscreen Viewport with Single Fixed Background */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Single Fixed Audix 91 Pastel Jelly Blobs (Completely motionless on scroll) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="jelly-blobs">
            <div className="jelly-blob jelly-blob--1" />
            <div className="jelly-blob jelly-blob--2" />
            <div className="jelly-blob jelly-blob--3" />
          </div>
        </div>

        {/* Hero Layer (Fades out smoothly when scrolling down) */}
        <div
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.1 ? 'auto' : 'none',
            visibility: heroOpacity > 0.005 ? 'visible' : 'hidden',
          }}
          className="absolute inset-0 w-full h-full transition-opacity duration-200 ease-out z-10"
        >
          <HeroLoader
            replayKey={replayKey}
            onRevealHeader={onRevealHeader}
            onAnimationComplete={onAnimationComplete}
          />
        </div>

        {/* "Try the Look" Runway Layer (Fades in smoothly on the exact same background) */}
        <div
          style={{
            opacity: runwayOpacity,
            pointerEvents: runwayOpacity > 0.1 ? 'auto' : 'none',
            visibility: runwayOpacity > 0.005 ? 'visible' : 'hidden',
          }}
          className="absolute inset-0 w-full h-full transition-opacity duration-200 ease-out z-20"
        >
          <RunwaySection
            onAddToCart={onAddToCart}
            onOpenShop={onOpenShop}
            onOpenAiStylist={onOpenAiStylist}
            onDrawerStateChange={onDrawerStateChange}
            isEmbedded={true}
          />
        </div>
      </div>
    </div>
  );
}
