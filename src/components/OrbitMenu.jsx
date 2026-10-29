import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

export default function OrbitMenu({ isVisible = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const contentRef = useRef(null);
  const circleRef = useRef(null);
  const linksRef = useRef([]);
  const timelineRef = useRef(null);
  const clipStateRef = useRef({ r: 0 });

  const navItems = [
    { num: '01', main: 'HOME', alt: 'Home', href: '#' },
    { num: '02', main: 'AI STYLIST', alt: 'AI Stylist', href: '#ai-stylist' },
    { num: '03', main: 'CATEGORIES', alt: 'Categories', href: '#categories' },
    { num: '04', main: 'LOOKBOOK', alt: 'Lookbook', href: '#lookbook' },
    { num: '05', main: 'ABOUT', alt: 'About', href: '#about' },
  ];

  // Helper to compute toggle center & radius to farthest corner
  const computeCircle = useCallback(() => {
    if (!toggleRef.current) return { cx: window.innerWidth - 60, cy: 60, maxR: 1500 };
    const rect = toggleRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const dx = Math.max(cx, vw - cx);
    const dy = Math.max(cy, vh - cy);
    const maxR = Math.sqrt(dx * dx + dy * dy) + 40;

    return { cx, cy, maxR };
  }, []);

  const applyCircle = useCallback((cx, cy, r) => {
    if (circleRef.current) {
      circleRef.current.setAttribute('cx', String(cx));
      circleRef.current.setAttribute('cy', String(cy));
      circleRef.current.setAttribute('r', String(r));
    }
    if (contentRef.current) {
      contentRef.current.style.setProperty('--cx', `${cx}px`);
      contentRef.current.style.setProperty('--cy', `${cy}px`);
      contentRef.current.style.setProperty('--cr', `${r}px`);
    }
  }, []);

  useEffect(() => {
    const { cx, cy } = computeCircle();
    applyCircle(cx, cy, 0);

    const validLinks = linksRef.current.filter(Boolean);
    gsap.set(validLinks, { y: 45, opacity: 0 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.inOut' },
      onUpdate: () => {
        const current = computeCircle();
        applyCircle(current.cx, current.cy, clipStateRef.current.r);
      },
      onReverseComplete: () => {
        document.body.classList.remove('menu-is-open');
        setIsOpen(false);
      },
    });

    tl.to(
      clipStateRef.current,
      {
        r: () => computeCircle().maxR,
        duration: 0.95,
      },
      0
    ).to(
      validLinks,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
      },
      0.5
    );

    timelineRef.current = tl;

    const handleResize = () => {
      const current = computeCircle();
      if (document.body.classList.contains('menu-is-open')) {
        applyCircle(current.cx, current.cy, current.maxR);
      } else {
        applyCircle(current.cx, current.cy, 0);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && tl.progress() > 0 && !tl.reversed()) {
        toggleMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('menu-is-open');
      tl.kill();
    };
  }, [computeCircle, applyCircle]);

  const toggleMenu = () => {
    const tl = timelineRef.current;
    if (!tl) return;

    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen) {
      const { cx, cy } = computeCircle();
      applyCircle(cx, cy, 0);
      document.body.classList.add('menu-is-open');
      tl.play();
    } else {
      tl.reverse();
    }
  };

  const handleLinkClick = () => {
    if (isOpen) {
      toggleMenu();
    }
  };

  return (
    <>
      {/* Header bar with Brand on Left and Toggle on Right */}
      <header
        className={`orbit-header transition-opacity duration-700 ${
          isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a href="#" className="orbit-brand select-none">
          VIBE<span>*</span>
        </a>

        {/* Circular gooey hover toggle */}
        <button
          ref={toggleRef}
          onClick={toggleMenu}
          className="orbit-toggle"
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="orbit-toggle__inner" aria-hidden="true">
            <span className="orbit-toggle__line"></span>
            <span className="orbit-toggle__line"></span>
            <span className="orbit-toggle__line"></span>
          </span>
        </button>
      </header>

      {/* Ink-blot expanding circle menu overlay */}
      <div
        ref={menuRef}
        className={`orbit-menu ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <svg className="orbit-menu__svg" aria-hidden="true">
          <defs>
            <clipPath id="orbitClip" clipPathUnits="userSpaceOnUse">
              <circle ref={circleRef} cx="100" cy="100" r="0" />
            </clipPath>
          </defs>
          <rect
            className="orbit-menu__fill"
            width="100%"
            height="100%"
            clipPath="url(#orbitClip)"
          />
        </svg>

        <div ref={contentRef} className="orbit-menu__content">
          <nav className="orbit-nav">
            <ul className="orbit-nav__list">
              {navItems.map((item, idx) => (
                <li
                  key={item.num}
                  className="orbit-nav__item"
                  ref={(el) => {
                    linksRef.current[idx] = el;
                  }}
                >
                  <a
                    href={item.href}
                    onClick={handleLinkClick}
                    className="orbit-nav__link"
                  >
                    <span className="orbit-nav__num">{item.num}</span>
                    <span className="orbit-nav__text">
                      <span className="orbit-nav__text__main">{item.main}</span>
                      <span className="orbit-nav__text__alt">{item.alt}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-white/10 pt-6 px-4 flex justify-between text-xs font-mono text-neutral-400 max-w-4xl mx-auto w-full">
            <span>AI FASHION COUTURE // SS26</span>
            <span>AUTONOMOUS STYLING ATELIER</span>
          </div>
        </div>
      </div>
    </>
  );
}
