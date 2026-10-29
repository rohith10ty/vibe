import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function OrbitMenu({ isVisible = true, cartCount = 0, onOpenCart, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const contentRef = useRef(null);
  const circleRef = useRef(null);
  const linksRef = useRef([]);
  const timelineRef = useRef(null);
  const clipStateRef = useRef({ r: 0 });

  const navItems = [
    { num: '01', main: 'HOME', alt: 'Home', tag: 'Atelier // 01', href: '#' },
    { num: '02', main: 'THE RUNWAY', alt: 'The Runway', tag: '3D Lookbook', href: '#runway' },
    { num: '03', main: 'AI STYLIST', alt: 'AI Stylist', tag: 'Neural Engine', href: '#ai-stylist' },
    { num: '04', main: 'SHOP PIECES', alt: 'Shop Pieces', tag: '14 H&M Items', href: '#shop' },
    { num: '05', main: 'ABOUT', alt: 'About', tag: 'The Atelier', href: '#footer' },
  ];

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
    gsap.set(validLinks, { y: 30, opacity: 0 });

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
        duration: 0.9,
      },
      0
    ).to(
      validLinks,
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power3.out',
      },
      0.4
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

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (isOpen) {
      toggleMenu();
    }
    if (onNavigate) {
      onNavigate(href);
    } else {
      const targetId = href.replace('#', '');
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Header bar with Brand on Left and Bag + Gooey Toggle on Right */}
      <header
        className={`orbit-header transition-opacity duration-700 ${
          isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a
          href="#"
          onClick={(e) => handleLinkClick(e, '#')}
          className="orbit-brand select-none hover:opacity-85 transition-opacity"
        >
          VIBE<span>*</span>
        </a>

        {/* Right Action Icons: Shopping Bag + Gooey Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto ml-auto">
          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-neutral-300 hover:border-black bg-white/80 backdrop-blur-sm transition-all shadow-sm active:scale-95 text-neutral-800"
            title="Open Shopping Bag"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff1100] text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

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
        </div>
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
                  className="orbit-nav__item overflow-hidden"
                  ref={(el) => {
                    linksRef.current[idx] = el;
                  }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="group flex items-center justify-between py-4 sm:py-5 px-3 transition-all duration-300 rounded-lg hover:bg-white/[0.04]"
                  >
                    {/* Left: Number + Morphing Text */}
                    <div className="flex items-center gap-6 sm:gap-10">
                      <span className="font-mono text-xs sm:text-sm tracking-widest text-neutral-500 group-hover:text-[#ff1100] transition-colors">
                        {item.num}
                      </span>

                      {/* Locked-height dual text container: NO CLIPPING, NO OVERLAP */}
                      <div className="relative overflow-hidden h-9 sm:h-11 flex flex-col justify-start">
                        <div className="transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
                          {/* Default state: Clean Bold White Headline */}
                          <div className="h-9 sm:h-11 flex items-center">
                            <span className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#ecebe4] whitespace-nowrap">
                              {item.main}
                            </span>
                          </div>
                          {/* Hover state: Italic Crimson Red Serif */}
                          <div className="h-9 sm:h-11 flex items-center">
                            <span className="font-serif italic font-medium text-2xl sm:text-3xl lg:text-4xl text-[#ff1100] whitespace-nowrap">
                              {item.alt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Category Tag + Arrow */}
                    <div className="flex items-center gap-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                        {item.tag}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#ff1100] text-white flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
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
