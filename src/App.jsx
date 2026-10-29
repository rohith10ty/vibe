import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import OrbitMenu from './components/OrbitMenu';
import HeroRunwayExperience from './components/HeroRunwayExperience';
import ShopPage from './components/ShopPage';
import AiStylist from './components/AiStylist';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [replayKey, setReplayKey] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRunwayDrawerOpen, setIsRunwayDrawerOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // When either drawer is open, pause Lenis so inner content scrolls with 100% native fluidity
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isRunwayDrawerOpen || isCartOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isRunwayDrawerOpen, isCartOpen]);

  const handleRevealHeader = useCallback(() => {
    setShowHeader(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowHeader(true);
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleRemoveCartItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToSection = (id) => {
    const target = id.startsWith('#') ? id : `#${id}`;
    if (lenisRef.current) {
      if (target === '#' || target === '#home') {
        lenisRef.current.scrollTo(0, { duration: 1.2 });
      } else if (target === '#runway') {
        const container = document.getElementById('hero-runway-container');
        if (container) {
          const top = container.offsetTop + container.offsetHeight * 0.55;
          lenisRef.current.scrollTo(top, { duration: 1.2 });
        }
      } else {
        const el = document.querySelector(target);
        if (el) {
          lenisRef.current.scrollTo(el, { offset: 0, duration: 1.2 });
        }
      }
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-black font-sans selection:bg-[#ff1100] selection:text-white">
      {/* Header bar with Orbit Studio Menu & Bag Indicator */}
      <OrbitMenu
        isVisible={showHeader}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={scrollToSection}
        isDrawerOpen={isRunwayDrawerOpen || isCartOpen}
      />

      <main>
        {/* Seamless Hero + 3D Runway Experience: Single Fixed Background & Smooth Fade Transition */}
        <HeroRunwayExperience
          replayKey={replayKey}
          onRevealHeader={handleRevealHeader}
          onAnimationComplete={handleAnimationComplete}
          onAddToCart={handleAddToCart}
          onOpenShop={() => scrollToSection('shop')}
          onOpenAiStylist={() => scrollToSection('ai-stylist')}
          onDrawerStateChange={setIsRunwayDrawerOpen}
        />

        {/* Dedicated H&M Shop Catalog Page: Exactly 14 Products */}
        <ShopPage
          onAddToCart={handleAddToCart}
          onJumpToRunway={(lookId) => {
            scrollToSection('runway');
          }}
          onOpenAiStylist={() => scrollToSection('ai-stylist')}
        />

        {/* AI Outfit Stylist Engine */}
        <AiStylist
          onAddToCart={handleAddToCart}
          onJumpToRunway={(lookId) => {
            scrollToSection('runway');
          }}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}
