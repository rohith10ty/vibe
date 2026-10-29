import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Layers
} from 'lucide-react';
import { RUNWAY_LOOKS } from '../data/fashionData';

export default function RunwaySection({ onAddToCart, onOpenShop, onOpenAiStylist }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePinIndex, setActivePinIndex] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItemIds, setAddedItemIds] = useState([]);
  const [fullBundleAdded, setFullBundleAdded] = useState(false);
  const [activeImageIndices, setActiveImageIndices] = useState({});
  const autoPlayRef = useRef(null);

  const currentLook = RUNWAY_LOOKS[activeIndex];

  // Auto-play runway loop
  useEffect(() => {
    if (isPlaying && !drawerOpen) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
      }, 4000);
    } else {
      clearInterval(autoPlayRef.current);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying, drawerOpen]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? RUNWAY_LOOKS.length - 1 : prev - 1));
    setActivePinIndex(null);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
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
    setActivePinIndex(0);
    setDrawerOpen(true);
  };

  const handleSizeChange = (pieceId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [pieceId]: size }));
  };

  const handleCycleImage = (pieceId, total) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [pieceId]: ((prev[pieceId] || 0) + 1) % total,
    }));
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

  // Indian Rupees bundle calculations for exactly 2 pieces
  const totalOriginalPrice = currentLook.pieces.reduce((acc, p) => acc + p.originalPrice, 0);
  const totalCurrentPrice = currentLook.pieces.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscountPrice = Math.round(totalCurrentPrice * 0.85);

  return (
    <section
      id="runway"
      className="relative min-h-[90vh] max-h-[920px] w-full bg-[#f6f6f7] py-8 sm:py-10 px-4 sm:px-8 lg:px-16 overflow-hidden select-none flex flex-col justify-between border-t border-neutral-200"
    >
      {/* Background Studio Lighting & Floor Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[45vh] bg-gradient-to-b from-white/95 via-white/40 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-neutral-300/40 to-transparent" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1 font-mono text-[11px] uppercase tracking-widest text-[#ff1100]">
            <span className="w-2 h-2 rounded-full bg-[#ff1100] animate-pulse"></span>
            <span>VIBE // 3D RUNWAY EDIT</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
            Try the Look.
          </h2>
          <p className="font-mono text-xs text-neutral-600 uppercase tracking-wider mt-1">
            Seven looks, styled head to toe. Tap a dot to explore the piece.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShop}
            className="flex items-center gap-2 px-3.5 py-1.5 border border-neutral-300 rounded-full font-mono text-xs uppercase tracking-wider text-neutral-800 bg-white/80 hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#ff1100]" />
            <span>Catalogue (14)</span>
          </button>

          <button
            onClick={onOpenAiStylist}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-900 text-white rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#ff1100] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff1100]" />
            <span>AI Stylist</span>
          </button>
        </div>
      </div>

      {/* 3D Runway Stage with Wide Models & Floating Arrows */}
      <div className="relative z-20 w-full max-w-7xl mx-auto h-[440px] sm:h-[480px] md:h-[510px] flex items-center justify-center my-auto">
        {/* Floor Horizon Line */}
        <div className="absolute bottom-10 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent pointer-events-none" />

        {/* Floating Left and Right Navigation Buttons for immediate visibility */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-black text-neutral-800 hover:text-white backdrop-blur-md border border-neutral-300 shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 group"
          aria-label="Previous Outfit"
          title="Previous Look (←)"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-black text-neutral-800 hover:text-white backdrop-blur-md border border-neutral-300 shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 group"
          aria-label="Next Outfit"
          title="Next Look (→)"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Runway Models Carousel: spaced wide across the screen matching the video */}
        <div className="relative w-full h-full flex items-center justify-center">
          {RUNWAY_LOOKS.map((look, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            // Render visible models (-2 to +2 range)
            if (absOffset > 2) return null;

            // Spaced much further away across the runway to match the video
            const translateX =
              offset === 0
                ? '0px'
                : offset === 1
                ? 'min(380px, 32vw)'
                : offset === 2
                ? 'min(760px, 58vw)'
                : offset === -1
                ? 'max(-380px, -32vw)'
                : 'max(-760px, -58vw)';

            const scale = isCenter ? 1.0 : absOffset === 1 ? 0.72 : 0.52;
            const zIndex = 30 - absOffset * 10;
            const opacity = isCenter ? 1 : absOffset === 1 ? 0.5 : 0.22;
            const blur = isCenter ? '0px' : `${absOffset * 2.2}px`;

            return (
              <div
                key={look.id}
                onClick={() => handleSelectLook(idx)}
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `blur(${blur})`,
                  cursor: isCenter ? 'default' : 'pointer',
                }}
                className="absolute bottom-6 transition-all duration-700 ease-out flex flex-col items-center select-none"
              >
                {/* Contact Floor Shadow under shoes */}
                <div
                  className="absolute -bottom-2 w-36 sm:w-44 h-6 rounded-full pointer-events-none transition-transform duration-500"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.12) 50%, transparent 75%)',
                    transform: isCenter ? 'scale(1.1)' : 'scale(0.8)',
                  }}
                />

                {/* Model Cutout Image */}
                <div className="relative h-[340px] sm:h-[390px] md:h-[430px] aspect-[2/3] flex items-end justify-center">
                  <img
                    src={look.cutoutImage}
                    alt={look.title}
                    draggable={false}
                    className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-lg"
                  />

                  {/* Hotspot Pins (STRICTLY 2 Pins: Top and Bottom) */}
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
                            {/* Pulsing ring */}
                            <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping opacity-75" />

                            {/* Pin Circle with Number */}
                            <span
                              className={`relative flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold transition-all duration-300 shadow-xl ${
                                isPinActive
                                  ? 'bg-[#ff1100] text-white scale-125 ring-4 ring-[#ff1100]/30'
                                  : 'bg-white/95 text-black hover:bg-black hover:text-white hover:scale-110'
                              }`}
                            >
                              {pinIdx + 1}
                            </span>

                            {/* Floating Hover Label */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap z-50">
                              <div className="bg-black/95 backdrop-blur-md text-white text-[11px] font-mono uppercase px-3 py-1 rounded-md shadow-2xl">
                                <span>{piece.name}</span>
                                <span className="text-[#ff1100] ml-1.5 font-bold">
                                  ₹{piece.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="w-2 h-2 bg-black/95 rotate-45 -mt-1" />
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
                    className="mt-2.5 flex items-center gap-1.5 px-4 py-1.5 bg-black/85 hover:bg-black text-white font-mono text-[11px] uppercase tracking-wider rounded-full shadow-md transition-all active:scale-95"
                  >
                    <span>Tap a dot to shop the look</span>
                    <span className="text-[#ff1100] font-bold">({look.pieces.length} items)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar: Stepper Navigation + AutoPlay Controls */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-3 pt-2 border-t border-neutral-200">
        {/* Navigation Arrows & Play Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
            aria-label="Previous look"
            title="Previous Look (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
            aria-label={isPlaying ? 'Pause runway' : 'Play runway'}
            title={isPlaying ? 'Pause Runway' : 'Auto-Play Runway'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#ff1100]" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
            aria-label="Next look"
            title="Next Look (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Timeline Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none font-mono text-xs uppercase tracking-wider">
          {RUNWAY_LOOKS.map((look, i) => (
            <button
              key={look.id}
              onClick={() => handleSelectLook(i)}
              className={`flex items-center gap-1.5 transition-all py-1 px-3 rounded-full ${
                i === activeIndex
                  ? 'bg-black text-white font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 bg-neutral-200/60'
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

        {/* Look Meta Information */}
        <div className="text-right hidden sm:block">
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block">
            LOOK {currentLook.lookNumber} OF 07
          </span>
          <span className="font-sans text-xs font-semibold text-neutral-800">
            {currentLook.vibe}
          </span>
        </div>
      </div>

      {/* Side Slide-Over Drawer: "In This Look" Showcase (Exactly 2 Pieces) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Sliding Lookbook Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out z-10 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#ff1100]">
                <span>LOOK {currentLook.lookNumber} // COMPLETE OUTFIT</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-neutral-900 mt-0.5">
                {currentLook.title}
              </h3>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          </div>

          {/* Drawer Middle: Curated 2 Pieces (Top & Bottom) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-neutral-500 uppercase tracking-wider pb-1">
              <span>Pieces in this Look ({currentLook.pieces.length})</span>
              <span>100% Authentic H&M</span>
            </div>

            {currentLook.pieces.map((piece, pIdx) => {
              const isAdded = addedItemIds.includes(piece.id);
              const isHighlighted = activePinIndex === pIdx;
              const currentSize = selectedSizes[piece.id] || piece.sizes[0];
              const imgIndex = activeImageIndices[piece.id] || 0;
              const activeImg = piece.images[imgIndex] || piece.image;

              return (
                <div
                  key={piece.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    isHighlighted
                      ? 'border-[#ff1100] bg-red-50/20 shadow-md ring-1 ring-[#ff1100]/20'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex gap-3.5">
                    {/* Piece Image with Multi-Angle Cycler */}
                    <div className="relative w-20 sm:w-24 aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 group/img">
                      <img
                        src={activeImg}
                        alt={piece.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                      />
                      {piece.images.length > 1 && (
                        <button
                          onClick={() => handleCycleImage(piece.id, piece.images.length)}
                          className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono flex items-center gap-0.5 hover:bg-black transition-colors"
                          title="View next angle"
                        >
                          <Layers className="w-2.5 h-2.5" />
                          <span>{imgIndex + 1}/{piece.images.length}</span>
                        </button>
                      )}
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black text-white font-mono text-[10px] flex items-center justify-center font-bold">
                        {pIdx + 1}
                      </span>
                    </div>

                    {/* Piece Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                            {piece.category} // {piece.color}
                          </span>
                          <span className="font-mono text-xs font-bold text-neutral-900">
                            ₹{piece.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-sm text-neutral-900 mt-0.5 line-clamp-1">
                          {piece.name}
                        </h4>
                        <p className="font-mono text-[11px] text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {piece.description}
                        </p>
                      </div>

                      {/* Size Selector and Add Button */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        {/* Size pills */}
                        <div className="flex items-center gap-1">
                          {piece.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeChange(piece.id, sz)}
                              className={`px-1.5 py-0.5 font-mono text-[10px] rounded transition-all ${
                                currentSize === sz
                                  ? 'bg-black text-white font-bold'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>

                        {/* Add single piece button */}
                        <button
                          onClick={() => handleAddSinglePiece(piece)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-900 text-white hover:bg-[#ff1100]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
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
            <div className="p-3.5 rounded-xl bg-neutral-900 text-white">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff1100]" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-200">
                  AI Styling Advice
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-300 leading-relaxed">
                "{currentLook.aiStyling.rationale}"
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                <span className="text-[#ff1100] font-bold">TIP: </span>
                {currentLook.aiStyling.stylingTip}
              </div>
            </div>
          </div>

          {/* Drawer Bottom: Bundle Purchase CTA */}
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 sticky bottom-0">
            <div className="flex justify-between items-baseline mb-2.5">
              <div>
                <span className="font-sans font-bold text-sm text-neutral-900 block">
                  Complete the look
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  Bundle both pieces & save 15%
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-neutral-400 line-through mr-1.5">
                  ₹{totalCurrentPrice.toLocaleString('en-IN')}
                </span>
                <span className="font-sans font-bold text-base text-[#ff1100]">
                  ₹{bundleDiscountPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddFullLook}
              className={`w-full py-3 px-5 rounded-full font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                fullBundleAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-[#ff1100] active:scale-98'
              }`}
            >
              {fullBundleAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Both Pieces Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Look to Bag</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
