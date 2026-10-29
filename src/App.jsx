import React, { useState, useCallback } from 'react';
import OrbitMenu from './components/OrbitMenu';
import HeroLoader from './components/HeroLoader';
import RunwaySection from './components/RunwaySection';
import ShopPage from './components/ShopPage';
import AiStylist from './components/AiStylist';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [replayKey, setReplayKey] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-black font-sans selection:bg-[#ff1100] selection:text-white">
      {/* VIBE Header with Orbit Studio Menu & Bag Indicator */}
      <OrbitMenu
        isVisible={showHeader}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Loader with Custom Center Look */}
      <main>
        <HeroLoader
          replayKey={replayKey}
          onRevealHeader={handleRevealHeader}
          onAnimationComplete={handleAnimationComplete}
        />

        {/* 3D Runway Section (Video Experience with 7 Cutouts & Hotspot Pins) */}
        <RunwaySection
          onAddToCart={handleAddToCart}
          onOpenShop={() => scrollToSection('shop')}
          onOpenAiStylist={() => scrollToSection('ai-stylist')}
        />

        {/* Dedicated H&M Shop Catalog Page */}
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
