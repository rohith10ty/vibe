import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { RUNWAY_LOOKS } from '../data/fashionData';

export default function RunwaySection({ onAddToCart, onOpenShop, onOpenAiStylist }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePinIndex, setActivePinIndex] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItemIds, setAddedItemIds] = useState([]);
  const [fullBundleAdded, setFullBundleAdded] = useState(false);
  const autoPlayRef = useRef(null);

  const currentLook = RUNWAY_LOOKS[activeIndex];

  // Auto-play runway walk
  useEffect(() => {
    if (isPlaying && !drawerOpen) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
      }, 3500);
    } else {
      clearInterval(autoPlayRef.current);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying, drawerOpen]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
    setActivePinIndex(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + RUNWAY_LOOKS.length) % RUNWAY_LOOKS.length);
    setActivePinIndex(null);
  };

  const handleSelectLook = (idx) => {
    setActiveIndex(idx);
    setActivePinIndex(null);
  };

  const handlePinClick = (e, pinIdx) => {
    e.stopPropagation();
    setActivePinIndex(pinIdx);
    setDrawerOpen(true);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setActivePinIndex(null);
  };

  const handleSizeSelect = (pieceId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [pieceId]: size }));
  };

  const handleAddSinglePiece = (piece) => {
    const size = selectedSizes[piece.id] || piece.sizes[0];
    if (onAddToCart) {
      onAddToCart({ ...piece, selectedSize: size });
    }
    setAddedItemIds((prev) => [...prev, piece.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== piece.id));
    }, 2000);
  };

  const handleAddFullLook = () => {
    currentLook.pieces.forEach((piece) => {
      const size = selectedSizes[piece.id] || piece.sizes[0];
      if (onAddToCart) {
        onAddToCart({ ...piece, selectedSize: size });
      }
    });
    setFullBundleAdded(true);
    setTimeout(() => setFullBundleAdded(false), 2500);
  };

  // Calculate bundle pricing
  const totalOriginalPrice = currentLook.pieces.reduce((acc, p) => acc + p.originalPrice, 0);
  const totalCurrentPrice = currentLook.pieces.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscountPrice = (totalCurrentPrice * 0.85).toFixed(2);

  return (
    <section id="runway" className="relative min-h-screen w-full bg-[#f6f6f7] py-20 px-4 sm:px-8 lg:px-16 overflow-hidden select-none border-t border-neutral-200">
      {/* Background Studio Lighting & Floor Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-b from-white/90 via-white/50 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-200/60 to-transparent" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-14">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#ff1100]">
            <span className="w-2 h-2 rounded-full bg-[#ff1100] animate-pulse"></span>
            <span>VIBE // RUNWAY EDIT</span>
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900">
            Try the Look.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-neutral-600 uppercase tracking-wider mt-2">
            Seven looks, styled head to toe. Tap a pin to see the piece.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShop}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-full font-mono text-xs uppercase tracking-wider text-neutral-800 bg-white/80 hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#ff1100]" />
            <span>Shop Catalog</span>
          </button>

          <button
            onClick={onOpenAiStylist}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#ff1100] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Stylist Advice</span>
          </button>
        </div>
      </div>

      {/* 3D Runway Stage */}
      <div className="relative z-20 w-full max-w-7xl mx-auto h-[620px] sm:h-[680px] md:h-[740px] flex items-center justify-center">
        {/* Floor Horizon Line & Depth Ambient Shadow */}
        <div className="absolute bottom-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent pointer-events-none" />

        {/* Runway Models Carousel */}
        <div className="relative w-full h-full flex items-center justify-center">
          {RUNWAY_LOOKS.map((look, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            // Render visible models (-2 to +2 range)
            if (absOffset > 2) return null;

            // Compute dynamic 3D positioning
            const translateX = offset * 36; // percentage offset
            const scale = isCenter ? 1.05 : 0.82 - (absOffset - 1) * 0.15;
            const zIndex = 30 - absOffset * 10;
            const opacity = isCenter ? 1 : 0.65 - (absOffset - 1) * 0.3;
            const blur = isCenter ? '0px' : `${absOffset * 1.8}px`;

            return (
              <div
                key={look.id}
                onClick={() => handleSelectLook(idx)}
                style={{
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `blur(${blur})`,
                  cursor: isCenter ? 'default' : 'pointer',
                }}
                className="absolute bottom-14 transition-all duration-700 ease-out flex flex-col items-center select-none"
              >
                {/* Contact Floor Shadow under shoes */}
                <div
                  className="absolute -bottom-5 w-44 sm:w-56 h-8 rounded-full pointer-events-none transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 75%)',
                    transform: isCenter ? 'scale(1.15)' : 'scale(0.85)',
                  }}
                />

                {/* Model Transparent Cutout Image */}
                <div className="relative h-[480px] sm:h-[540px] md:h-[600px] aspect-[2/3] flex items-end justify-center">
                  <img
                    src={look.cutoutImage}
                    alt={look.title}
                    draggable={false}
                    className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-xl"
                  />

                  {/* Interactive Hotspot Pins (Rendered on Active Center Model) */}
                  {isCenter && (
                    <div className="absolute inset-0 pointer-events-auto">
                      {look.pieces.map((piece, pinIdx) => {
                        const isPinActive = activePinIndex === pinIdx;
                        return (
                          <button
                            key={piece.id}
                            onClick={(e) => handlePinClick(e, pinIdx)}
                            style={{
                              top: piece.pin.top,
                              left: piece.pin.left,
                            }}
                            className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                            title={`View ${piece.name}`}
                          >
                            {/* Outer Pulsing Radar Ring */}
                            <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping opacity-75" />
                            
                            {/* Inner Circle with Number */}
                            <span
                              className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-mono text-xs font-bold transition-all duration-300 shadow-xl ${
                                isPinActive
                                  ? 'bg-[#ff1100] text-white scale-125 ring-4 ring-[#ff1100]/30'
                                  : 'bg-white/95 text-black hover:bg-black hover:text-white hover:scale-110'
                              }`}
                            >
                              {pinIdx + 1}
                            </span>

                            {/* Floating Hover Label */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap z-50">
                              <div className="bg-black/90 backdrop-blur-md text-white text-[11px] font-mono uppercase px-3 py-1 rounded-md shadow-2xl">
                                <span className="font-semibold">{piece.name}</span>
                                <span className="text-[#ff1100] ml-1.5 font-bold">${piece.price}</span>
                              </div>
                              <div className="w-2 h-2 bg-black/90 rotate-45 -mt-1" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Subtitle prompt under center model */}
                {isCenter && (
                  <button
                    onClick={handleOpenDrawer}
                    className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-black/80 hover:bg-black text-white font-mono text-[11px] uppercase tracking-wider rounded-full shadow-md transition-all active:scale-95"
                  >
                    <span>Tap a dot to shop the piece</span>
                    <span className="text-[#ff1100]">({look.pieces.length} items)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Runway Controls Bar */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-neutral-300/80">
        {/* Navigation Arrows & Play Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-neutral-400/80 bg-white/80 hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-90"
            aria-label="Previous look"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full border border-neutral-400/80 bg-white/80 hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-90"
            aria-label={isPlaying ? 'Pause runway' : 'Play runway'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#ff1100]" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-neutral-400/80 bg-white/80 hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-90"
            aria-label="Next look"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Timeline Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-none font-mono text-xs uppercase tracking-wider">
          {RUNWAY_LOOKS.map((look, i) => (
            <button
              key={look.id}
              onClick={() => handleSelectLook(i)}
              className={`flex items-center gap-1.5 transition-all py-1 px-2.5 rounded-full ${
                i === activeIndex
                  ? 'bg-black text-white font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>{look.lookNumber}</span>
              {i === activeIndex && (
                <span className="hidden md:inline font-sans font-medium text-neutral-200">
                  {look.title}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Look details button */}
        <button
          onClick={handleOpenDrawer}
          className="font-mono text-xs uppercase tracking-wider text-neutral-800 hover:text-[#ff1100] transition-colors flex items-center gap-1.5"
        >
          <span>View Pieces & Bundle</span>
          <span className="text-[#ff1100]">→</span>
        </button>
      </div>

      {/* Side Drawer: "In this look" Panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={handleCloseDrawer}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out z-10 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#ff1100] tracking-widest font-semibold">
                LOOK {currentLook.lookNumber}
              </span>
              <h3 className="font-sans text-xl font-bold text-neutral-900">
                In this look
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                {currentLook.pieces.length} Pieces
              </span>
              <button
                onClick={handleCloseDrawer}
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Close look drawer"
              >
                <X className="w-4 h-4 text-neutral-700" />
              </button>
            </div>
          </div>

          {/* Product Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {currentLook.pieces.map((piece, pinIdx) => {
              const isHighlighted = activePinIndex === pinIdx;
              const isAdded = addedItemIds.includes(piece.id);
              const selectedSize = selectedSizes[piece.id] || piece.sizes[0];

              return (
                <div
                  key={piece.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isHighlighted
                      ? 'border-[#ff1100] bg-red-50/30 ring-2 ring-[#ff1100]/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Piece Thumbnail */}
                    <div className="w-24 h-32 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                      <img
                        src={piece.image}
                        alt={piece.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Piece Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                            {piece.brand} // PIN #{pinIdx + 1}
                          </span>
                          <span className="font-mono text-xs font-bold text-neutral-900">
                            ${piece.price}
                          </span>
                        </div>
                        <h4 className="font-sans font-semibold text-sm text-neutral-900 mt-1 line-clamp-2">
                          {piece.name}
                        </h4>
                        <p className="font-mono text-[11px] text-neutral-500 mt-0.5">
                          {piece.color}
                        </p>
                      </div>

                      {/* Size Selector */}
                      <div className="mt-3">
                        <span className="font-mono text-[10px] uppercase text-neutral-400 block mb-1">
                          Size
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {piece.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeSelect(piece.id, sz)}
                              className={`px-2 py-1 font-mono text-[10px] rounded border transition-colors ${
                                selectedSize === sz
                                  ? 'bg-black text-white border-black'
                                  : 'border-neutral-300 text-neutral-700 hover:border-black'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add Single Piece Button */}
                      <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-between items-center">
                        <span className="text-[11px] font-mono text-neutral-400 line-through">
                          ${piece.originalPrice}
                        </span>
                        <button
                          onClick={() => handleAddSinglePiece(piece)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-900 text-white hover:bg-[#ff1100]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Piece</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Styling Insight Box inside drawer */}
            <div className="p-4 rounded-xl bg-neutral-900 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#ff1100]" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  AI Styling Rationale
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-300 leading-relaxed">
                "{currentLook.aiStyling.rationale}"
              </p>
              <div className="mt-3 pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                <span className="text-[#ff1100] font-bold">TIP: </span>
                {currentLook.aiStyling.stylingTip}
              </div>
            </div>
          </div>

          {/* Drawer Bottom: Bundle Purchase CTA */}
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 sticky bottom-0">
            <div className="flex justify-between items-baseline mb-3">
              <div>
                <span className="font-sans font-bold text-sm text-neutral-900 block">
                  Complete the look
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  Bundle all 3 and save 15%
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-neutral-400 line-through mr-2">
                  ${totalCurrentPrice.toFixed(2)}
                </span>
                <span className="font-sans font-bold text-lg text-[#ff1100]">
                  ${bundleDiscountPrice}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddFullLook}
              className={`w-full py-3.5 px-6 rounded-full font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                fullBundleAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-[#ff1100] active:scale-98'
              }`}
            >
              {fullBundleAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Full Look Added to Bag!</span>
                </>
              ) : (
                <>
                  <span>Add full look to bag</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
