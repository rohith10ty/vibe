import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroLoader from './HeroLoader';
import RunwaySection from './RunwaySection';

gsap.registerPlugin(ScrollTrigger);

export default function HeroRunwayExperience({
  replayKey,
  onRevealHeader,
  onAnimationComplete,
  onAddToCart,
  onOpenShop,
  onOpenAiStylist,
  onDrawerStateChange,
  onNavigate,
}) {
  const containerRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const runwayWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(heroWrapperRef.current, { opacity: 1, pointerEvents: 'auto' });
      gsap.set(runwayWrapperRef.current, { opacity: 0, pointerEvents: 'none' });

      // Single pinned timeline driving the sequence:
      // 1. Hero visible (progress 0)
      // 2. Scroll -> Hero completely disappears (progress 0.3)
      // 3. Short empty screen with exact same background (progress 0.3 - 0.45)
      // 4. Try the Look completely fades in and stays pinned for exploration (progress 0.45 - 1.0)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (heroWrapperRef.current) {
              heroWrapperRef.current.style.pointerEvents = p < 0.2 ? 'auto' : 'none';
            }
            if (runwayWrapperRef.current) {
              runwayWrapperRef.current.style.pointerEvents = p > 0.15 ? 'auto' : 'none';
            }
          },
        },
      });

      // Phase 1: Hero completely disappears first
      tl.to(heroWrapperRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 1.0,
        ease: 'power2.inOut',
      })
      // Phase 2: Short pause on clean background
      .to({}, { duration: 0.4 })
      // Phase 3: Try the Look completely fades in
      .to(runwayWrapperRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 1.0,
        ease: 'power2.inOut',
      })
      // Phase 4: Generous stay on Runway so user can explore all looks, pins, and numbers
      .to({}, { duration: 2.2 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-runway-container"
      className="relative w-full h-screen bg-[#f4f0e6] overflow-hidden select-none"
    >
      {/* Invisible anchor target for #runway navigation */}
      <div id="runway" className="absolute top-1/2 left-0 w-full h-1 pointer-events-none" />

      {/* Single Fixed Audix 91 Pastel Jelly Blobs (Completely motionless on scroll) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="jelly-blobs">
          <div className="jelly-blob jelly-blob--1" />
          <div className="jelly-blob jelly-blob--2" />
          <div className="jelly-blob jelly-blob--3" />
        </div>
      </div>

      {/* Hero Layer (Fades out completely first on scroll) */}
      <div
        ref={heroWrapperRef}
        className="absolute inset-0 w-full h-full z-10 transition-opacity"
      >
        <HeroLoader
          replayKey={replayKey}
          onRevealHeader={onRevealHeader}
          onAnimationComplete={onAnimationComplete}
          onNavigate={onNavigate}
        />
      </div>

      {/* "Try the Look" Runway Layer (Fades in on the exact same background) */}
      <div
        ref={runwayWrapperRef}
        className="absolute inset-0 w-full h-full z-20 transition-opacity"
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
  );
}
