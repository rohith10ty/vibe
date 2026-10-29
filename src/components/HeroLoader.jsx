import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';

export default function HeroLoader({ replayKey, onAnimationComplete, onRevealHeader }) {
  const containerRef = useRef(null);
  const veilRef = useRef(null);
  const stripRef = useRef(null);
  const featureRef = useRef(null);
  const featureBaseRef = useRef(null);
  const featureCutoutRef = useRef(null);
  const titleWordsRef = useRef([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const onRevealHeaderRef = useRef(onRevealHeader);
  const lastReplayKeyRef = useRef(null);
  const timelineInstanceRef = useRef(null);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
    onRevealHeaderRef.current = onRevealHeader;
  });

  // 5 Complete Look images with shoes visible in all full photos
  const looks = [
    { id: 1, src: '/complete-look/e080282d3d188085e206f50c542d476977e9b066.avif', label: 'Look 01' },
    { id: 2, src: '/complete-look/516bc4ebb6d6db0d145049cb4a298ad610be13bd.avif', label: 'Look 02' },
    // Center Feature Look (exact image requested by user)
    {
      id: 3,
      src: '/complete-look/e89bbd02ede9a19bc2f4df411a618dee25edc6fe.avif',
      cutoutSrc: '/complete-look/man-transparent.png',
      label: 'Look 03 // Feature',
      isFeature: true,
    },
    { id: 4, src: '/complete-look/e8457929576eab9f16d3393e94b4dd1e3254896c.avif', label: 'Look 04' },
    { id: 5, src: '/complete-look/de325ccf0490f529eb162ed71023a0c95e23b78f.avif', label: 'Look 05' },
  ];

  useEffect(() => {
    if (lastReplayKeyRef.current === replayKey && timelineInstanceRef.current) {
      return;
    }
    lastReplayKeyRef.current = replayKey;

    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.kill();
    }

    setIsRevealed(false);
    setAnimationDone(false);

    const ctx = gsap.context(() => {
      const veil = veilRef.current;
      const strip = stripRef.current;
      const tiles = strip ? strip.querySelectorAll('.tile') : [];
      const feature = featureRef.current;
      const featureBase = featureBaseRef.current;
      const featureCutout = featureCutoutRef.current;
      const words = titleWordsRef.current.filter(Boolean);

      if (!veil || !strip || !tiles.length || !feature) return;

      const tileRotations = [-10, -5, 0, 5, 10];
      const tileOffsetsX = [-80, -40, 0, 40, 80];
      const EASE = 'power3.inOut';

      // Feature target scale adjusted to keep shoes clearly visible in viewport
      const isMobile = window.innerWidth < 768;
      const targetFeatureScale = isMobile ? 1.75 : 1.95;

      // Reset initial styles
      gsap.set(veil, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      });

      gsap.set(strip, {
        gap: isMobile ? '3vw' : '8vw',
      });

      gsap.set(tiles, {
        y: '18%',
        x: (i) => tileOffsetsX[i] || 0,
        rotation: (i) => tileRotations[i] || 0,
        scale: 0.72,
        opacity: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        transformOrigin: '50% 50%',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        backgroundColor: '#111',
      });

      // Feature image layers
      if (featureBase) {
        gsap.set(featureBase, { opacity: 1 });
      }
      if (featureCutout) {
        gsap.set(featureCutout, { opacity: 0 });
      }

      if (words.length > 0) {
        gsap.set(words, { y: '100%' });
      }

      // Single timeline instance
      const tl = gsap.timeline({
        delay: 0.3,
        onComplete: () => {
          setAnimationDone(true);
          onAnimationCompleteRef.current?.();
        },
      });

      timelineInstanceRef.current = tl;

      // 1. Tiles reveal
      tl.to(
        tiles,
        {
          y: 0,
          x: 0,
          rotation: 0,
          opacity: 1,
          scale: 0.82,
          duration: 1.1,
          stagger: 0.06,
          ease: 'power3.out',
        },
        0
      );

      // 2. Small settle
      tl.to(
        tiles,
        {
          scale: 0.8,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power2.out',
        },
        '>-0.25'
      );

      // 3. Strip collapses
      tl.to(
        strip,
        {
          gap: isMobile ? '0.5vw' : '0.75vw',
          duration: 1,
          ease: EASE,
        },
        1.5
      );

      // 4. Tiles scale to full size
      tl.to(
        tiles,
        {
          scale: 1,
          duration: 1,
          ease: EASE,
        },
        '<'
      );

      // 5. Hide non-feature tiles
      const others = Array.from(tiles).filter((t) => t !== feature);
      tl.to(
        others,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 1,
          stagger: 0.1,
          ease: EASE,
        },
        2.5
      );

      // 6. Feature image scales up and positions slightly upwards so shoes have clear breathing room
      tl.to(
        feature,
        {
          scale: targetFeatureScale,
          y: isMobile ? '-2%' : '-4%',
          duration: 1,
          ease: EASE,
        },
        3.5
      );

      // 7. Dark veil lifts - remove the background of the middle man right here!
      tl.to(
        veil,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 1,
          ease: EASE,
          onStart: () => {
            setIsRevealed(true);
            onRevealHeaderRef.current?.();
          },
        },
        4.5
      );

      // Seamlessly dissolve background into transparent cutout so shoes and whole body show cleanly
      if (featureBase && featureCutout) {
        tl.to(
          featureBase,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          4.5
        );
        tl.to(
          featureCutout,
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          4.5
        );
        tl.to(
          feature,
          {
            boxShadow: 'none',
            backgroundColor: 'transparent',
            duration: 0.6,
          },
          4.5
        );
      }

      // 8. Title reveal ("FASHION") - positioned slightly lower down
      if (words.length > 0) {
        tl.to(
          words,
          {
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
          },
          4.0
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [replayKey]);

  return (
    <section ref={containerRef} className="stage relative select-none bg-transparent">
      {/* Top Left VIBE* Brand - Hero Only (disappears naturally when scrolling down) */}
      <div
        className={`absolute top-6 left-6 sm:top-8 sm:left-10 z-40 pointer-events-auto transition-opacity duration-700 ${
          animationDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <a
          href="#"
          className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 select-none uppercase flex items-center gap-0.5 hover:opacity-80 transition-opacity"
        >
          VIBE<span className="italic text-[#ff1100]">*</span>
        </a>
      </div>

      {/* Dark overlay (Veil) that lifts up */}
      <div ref={veilRef} className="veil" />

      {/* Image Strip with full photos from head to shoes */}
      <div ref={stripRef} className="strip">
        {looks.map((item) => {
          if (item.isFeature) {
            return (
              <figure
                key={item.id}
                ref={featureRef}
                className={`tile tile--feature relative z-30 ${isRevealed ? 'is-revealed' : ''}`}
              >
                {/* 1. Base Photo with Studio Background (active during loader) */}
                <img
                  ref={featureBaseRef}
                  src={item.src}
                  alt={item.label}
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover object-bottom z-10 transition-opacity duration-300"
                />

                {/* 2. Transparent Cutout of the Man with Shoes (revealed when hero unveils) */}
                <img
                  ref={featureCutoutRef}
                  src={item.cutoutSrc}
                  alt={`${item.label} cutout`}
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover object-bottom z-20 pointer-events-none"
                />
              </figure>
            );
          }
          return (
            <figure key={item.id} className="tile relative z-20">
              <img
                src={item.src}
                alt={item.label}
                loading="eager"
                className="w-full h-full object-cover object-bottom"
              />
            </figure>
          );
        })}
      </div>

      {/* Big Hero Title ("FASHION" moved slightly lower down) */}
      <div className="hero-title-container">
        <h1>
          <span className="word-mask">
            <span
              ref={(el) => {
                if (el) titleWordsRef.current[0] = el;
              }}
              className="word-inner text-[#ff1100]"
            >
              FASHION
            </span>
          </span>
        </h1>
      </div>

      {/* Hero Bottom Bar (Clean bottom-left text & button without star symbol) */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none flex flex-col justify-end p-6 md:p-12 transition-opacity duration-1000 ${
          animationDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6 pt-6 pointer-events-auto">
          {/* Bottom Left Text */}
          <div className="max-w-md">
            <p className="font-mono text-xs text-neutral-600 leading-relaxed uppercase tracking-wider">
              VIBE // Curated AI fashion recommendations tailored for casual, formal, party & streetwear styles.
            </p>
          </div>

          {/* Bottom Right Buttons (No star symbol in explore button) */}
          <div className="flex items-center gap-3">
            <a
              href="#ai-stylist"
              className="flex items-center justify-center px-6 py-3.5 bg-[#ff1100] text-white font-mono text-xs uppercase tracking-widest rounded-full hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              <span>Explore AI Recommendations</span>
            </a>

            <a
              href="#categories"
              className="hidden lg:flex items-center gap-2 px-5 py-3.5 border border-neutral-300 font-mono text-xs uppercase tracking-widest text-neutral-800 rounded-full hover:border-black transition-colors"
            >
              <span>View Collections</span>
              <ArrowDown className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
