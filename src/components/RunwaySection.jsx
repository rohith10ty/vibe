import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { RUNWAY_LOOKS } from '../data/fashionData';

/* Sleek Illustrated Speech Callout (Consistent across all 7 looks, no red border) */
function OutfitCalloutBubble({ look }) {
  return (
    <div className="relative w-44 sm:w-50 h-16 sm:h-17 select-none filter drop-shadow-xl animate-in fade-in duration-300">
      <svg viewBox="0 0 200 66" className="absolute inset-0 w-full h-full overflow-visible">
        {/* Sleek solid matte black bubble with tail pointing right — NO RED BORDER */}
        <path
          d="M 12 4 H 170 Q 180 4 180 14 V 24 L 196 33 L 180 42 V 52 Q 180 62 170 62 H 12 Q 2 62 2 52 V 14 Q 2 4 12 4 Z"
          fill="#0e0e11"
        />
      </svg>
      <div className="relative z-10 w-full h-full flex flex-col justify-center pr-6 pl-3.5 py-1 text-left">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#ff1100] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1100] animate-pulse" />
          <span>LOOK {look.lookNumber}</span>
        </div>
        <h3 className="font-sans font-bold text-xs sm:text-[13px] text-white tracking-wide truncate max-w-[145px] leading-tight mt-0.5" title={look.title}>
          {look.title}
        </h3>
        <span className="font-mono text-[8.5px] text-neutral-400 uppercase tracking-wider truncate max-w-[145px] mt-0.5">
          {look.vibe}
        </span>
      </div>
    </div>
  );
}

export default function RunwaySection({
  onAddToCart,
  onOpenShop,
  onOpenAiStylist,
  onDrawerStateChange,
  isEmbedded = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePinIndex, setActivePinIndex] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItemIds, setAddedItemIds] = useState([]);
  const [activeImageIndices, setActiveImageIndices] = useState({});
  const [showBottomPieces, setShowBottomPieces] = useState(false);

  const currentLook = RUNWAY_LOOKS[activeIndex];

  // Close product callout and bottom tray when clicking anywhere outside
  useEffect(() => {
    if (activePinIndex === null && !showBottomPieces) return;
    const handleGlobalClick = (e) => {
      if (
        !e.target.closest('.product-callout-popover') &&
        !e.target.closest('.hotspot-pin-btn') &&
        !e.target.closest('.bottom-explore-tray') &&
        !e.target.closest('.explore-pieces-btn')
      ) {
        setActivePinIndex(null);
        setShowBottomPieces(false);
      }
    };
    window.addEventListener('pointerdown', handleGlobalClick);
    return () => window.removeEventListener('pointerdown', handleGlobalClick);
  }, [activePinIndex, showBottomPieces]);

  // Close callout when changing look
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
    // Toggle if clicking same pin, otherwise switch to clicked pin
    setActivePinIndex((prev) => (prev === pinIdx ? null : pinIdx));
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

  return (
    <section
      id="runway"
      className={`relative w-full h-full max-h-screen overflow-hidden select-none flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 lg:px-16 ${
        isEmbedded ? 'bg-transparent' : 'bg-[#f4f0e6]'
      }`}
    >
      {/* Background blobs (only if standalone) */}
      {!isEmbedded && (
        <div className="jelly-blobs">
          <div className="jelly-blob jelly-blob--1" />
          <div className="jelly-blob jelly-blob--2" />
          <div className="jelly-blob jelly-blob--3" />
        </div>
      )}

      {/* Top Header: Compact Title (On laptop, Catalogue is beside Bag in top-right header; on mobile it sits right below Try the Look) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center pt-2 sm:pt-4 pb-1">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5 font-mono text-[10px] uppercase tracking-widest text-[#ff1100]">
            <span className="w-2 h-2 rounded-full bg-[#ff1100] animate-pulse"></span>
            <span>VIBE // 3D RUNWAY EDIT</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-none">
            Try the Look.
          </h2>

          {/* Catalogue button: ONLY on mobile screens, directly below "Try the Look." */}
          <div className="block sm:hidden mt-2">
            <button
              onClick={onOpenShop}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-300 hover:border-black bg-white/90 backdrop-blur-sm transition-all shadow-sm active:scale-95 text-neutral-800 hover:bg-black hover:text-white font-mono text-[10px] uppercase tracking-wider"
            >
              <ShoppingBag className="w-3 h-3 text-[#ff1100]" />
              <span>Catalogue (14)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Runway Stage: Balanced Proportions (Full model visible with breathing room, no top clipping) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto h-[340px] sm:h-[370px] md:h-[410px] lg:h-[440px] flex items-center justify-center my-auto">
        {/* Floating Left and Right Navigation Buttons */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-black text-neutral-800 hover:text-white backdrop-blur-md border border-neutral-300 shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 group cursor-pointer pointer-events-auto"
          aria-label="Previous Outfit"
          title="Previous Look (←)"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform pointer-events-none" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-black text-neutral-800 hover:text-white backdrop-blur-md border border-neutral-300 shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 group cursor-pointer pointer-events-auto"
          aria-label="Next Outfit"
          title="Next Look (→)"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform pointer-events-none" />
        </button>

        {/* Runway Models Carousel: wide spacing */}
        <div className="relative w-full h-full flex items-center justify-center">
          {RUNWAY_LOOKS.map((look, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null;

            const translateX =
              offset === 0
                ? '0px'
                : offset === 1
                ? 'min(360px, 30vw)'
                : offset === 2
                ? 'min(720px, 56vw)'
                : offset === -1
                ? 'max(-360px, -30vw)'
                : 'max(-720px, -56vw)';

            const scale = isCenter ? 1.0 : absOffset === 1 ? 0.72 : 0.52;
            const zIndex = 30 - absOffset * 10;
            const opacity = isCenter ? 1 : absOffset === 1 ? 0.5 : 0.22;
            const blur = isCenter ? '0px' : `${absOffset * 2.2}px`;

            return (
              <div
                key={look.id}
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `blur(${blur})`,
                }}
                className="absolute bottom-2 transition-all duration-700 ease-out flex flex-col items-center select-none pointer-events-none"
              >
                {/* Contact Floor Shadow under shoes */}
                <div
                  className="absolute -bottom-2 w-44 sm:w-56 md:w-64 h-6 rounded-full pointer-events-none transition-transform duration-500"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.12) 50%, transparent 75%)',
                    transform: isCenter ? 'scale(1.15)' : 'scale(0.85)',
                  }}
                />

                {/* Model Cutout Image (Perfected size: slightly bigger than original, fits fully on screen without clipping) */}
                <div className="relative h-[320px] sm:h-[350px] md:h-[385px] lg:h-[415px] aspect-[2/3] flex items-end justify-center">
                  <img
                    src={look.cutoutImage}
                    alt={look.title}
                    draggable={false}
                    className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-lg"
                  />

                  {/* Illustrated Callout Shape beside the Active Center Model (Laptop/Desktop only; on mobile it sits at the bottom) */}
                  {isCenter && (
                    <div className="hidden sm:block absolute -left-36 sm:-left-42 md:-left-46 top-[34%] -translate-y-1/2 z-30 pointer-events-none transition-all duration-300">
                      <OutfitCalloutBubble look={currentLook} />
                    </div>
                  )}

                  {/* Hotspot Pins (STRICTLY 2 Small Dots: Top and Bottom) */}
                  {isCenter && (
                    <div className="absolute inset-0 pointer-events-auto">
                      {/* Transparent backdrop: Clicking anywhere on screen closes the product callout */}
                      {activePinIndex !== null && (
                        <div
                          className="fixed inset-0 z-40 bg-transparent cursor-default pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePinIndex(null);
                          }}
                        />
                      )}

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
                            className="hotspot-pin-btn group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-40 p-2 cursor-pointer pointer-events-auto"
                            title={`View ${piece.name}`}
                            aria-label={`View ${piece.name}`}
                          >
                            {/* Subtle ripple pulse */}
                            <span className="absolute inset-1.5 rounded-full bg-white/70 animate-ping opacity-60 pointer-events-none" />
                            {/* Small Sleek Dot */}
                            <span
                              className={`relative block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white shadow-md transition-all duration-300 ${
                                isPinActive
                                  ? 'bg-[#ff1100] scale-125 ring-2 ring-[#ff1100]/40'
                                  : 'bg-neutral-950 group-hover:bg-[#ff1100] group-hover:scale-125'
                              }`}
                            />
                          </button>
                        );
                      })}

                      {/* In-place Product Callout Popover on the Active Dot */}
                      {activePinIndex !== null && currentLook.pieces[activePinIndex] && (() => {
                        const piece = currentLook.pieces[activePinIndex];
                        const isAdded = addedItemIds.includes(piece.id);
                        const currentSize = selectedSizes[piece.id] || piece.sizes[0];
                        const imgIndex = activeImageIndices[piece.id] || 0;
                        const activeImg = piece.images[imgIndex] || piece.image;

                        return (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              top: piece.pin.top,
                              left: `calc(${piece.pin.left} + 18px)`,
                            }}
                            className="product-callout-popover absolute -translate-y-1/2 z-50 w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200/90 p-3.5 pointer-events-auto text-left transition-all animate-in fade-in zoom-in-95 duration-200"
                          >
                            {/* Pointer notch */}
                            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-white/95 filter drop-shadow-sm" />

                            {/* Header: Category & Clean Close Button */}
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
                                {piece.category} // {piece.color}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePinIndex(null);
                                }}
                                className="w-5 h-5 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center transition-colors text-neutral-500"
                                aria-label="Close product callout"
                                title="Close"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Thumbnail & Product Details */}
                            <div className="flex gap-3 py-2.5 items-center">
                              <div className="relative w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-100">
                                <img
                                  src={activeImg}
                                  alt={piece.name}
                                  className="w-full h-full object-cover"
                                />
                                {piece.images.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCycleImage(piece.id, piece.images.length);
                                    }}
                                    className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[8px] font-mono flex items-center gap-0.5 hover:bg-black transition-colors"
                                    title="Alternate angle"
                                  >
                                    <Layers className="w-2 h-2" />
                                    <span>{imgIndex + 1}/{piece.images.length}</span>
                                  </button>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-sans font-bold text-xs sm:text-sm text-neutral-900 leading-snug truncate" title={piece.name}>
                                  {piece.name}
                                </h4>
                                <div className="font-mono text-xs font-bold text-[#ff1100] mt-0.5">
                                  ₹{piece.price.toLocaleString('en-IN')}
                                </div>

                                {/* Size Selector */}
                                <div className="flex items-center gap-1 mt-2">
                                  {piece.sizes.map((sz) => (
                                    <button
                                      key={sz}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSizeChange(piece.id, sz);
                                      }}
                                      className={`px-1.5 py-0.5 text-[9px] font-mono uppercase rounded transition-colors ${
                                        currentSize === sz
                                          ? 'bg-black text-white font-bold'
                                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Add to Bag Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSinglePiece(piece);
                              }}
                              className={`w-full py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-900 hover:bg-[#ff1100] text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added to Bag</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>Add to Bag • ₹{piece.price.toLocaleString('en-IN')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile-Only Outfit Info Box (Clean curved-edges box centered at the bottom, no callout tail) */}
      <div className="block sm:hidden relative z-30 mx-auto px-4 pb-1 pointer-events-none animate-in fade-in duration-200">
        <div className="flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-full bg-[#0e0e11] text-white shadow-lg border border-white/10 max-w-[320px] mx-auto">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#ff1100] font-bold flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1100] animate-pulse" />
            <span>LOOK {currentLook.lookNumber}</span>
          </div>
          <span className="font-sans font-bold text-[11px] text-white tracking-wide truncate max-w-[140px]">
            {currentLook.title}
          </span>
          <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider truncate max-w-[85px]">
            {currentLook.vibe.split('•')[0]}
          </span>
        </div>
      </div>

      {/* Numbers ONLY Row for all 7 Outfits (Smaller & Refined) */}
      <div className="relative z-30 flex items-center justify-center gap-1.5 sm:gap-2 py-1 px-2">
        {RUNWAY_LOOKS.map((look, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={look.id}
              onClick={() => handleSelectLook(i)}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full font-mono text-[10px] sm:text-[11px] font-bold flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 ${
                isActive
                  ? 'bg-neutral-900 text-white ring-1.5 ring-neutral-900/30 ring-offset-1 scale-105'
                  : 'bg-white/80 hover:bg-white text-neutral-600 border border-neutral-300/70 hover:border-black'
              }`}
              title={`Select Look ${look.lookNumber}: ${look.title}`}
            >
              <span className={isActive ? 'text-[#ff1100]' : 'text-neutral-600'}>
                {look.lookNumber}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Explore Tray: Strictly Top & Bottom 2 Pieces Side-by-Side */}
      {showBottomPieces && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="bottom-explore-tray absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-300/90 p-3.5 sm:p-4 animate-in fade-in slide-in-from-bottom-3 duration-250 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff1100] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                LOOK {currentLook.lookNumber} // 2 PIECES INCLUDED (TOP & BOTTOM)
              </span>
            </div>
            <button
              onClick={() => setShowBottomPieces(false)}
              className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center transition-colors text-neutral-600"
              title="Close Tray"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2 Pieces: 1 Top and 1 Bottom Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentLook.pieces.map((piece, pIdx) => {
              const isAdded = addedItemIds.includes(piece.id);
              const currentSize = selectedSizes[piece.id] || piece.sizes[0];
              const imgIndex = activeImageIndices[piece.id] || 0;
              const activeImg = piece.images[imgIndex] || piece.image;

              return (
                <div
                  key={piece.id}
                  className="flex gap-2.5 p-2 rounded-xl bg-neutral-50/90 border border-neutral-200/80 items-center"
                >
                  <div className="relative w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                    <img
                      src={activeImg}
                      alt={piece.name}
                      className="w-full h-full object-cover"
                    />
                    {piece.images.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCycleImage(piece.id, piece.images.length);
                        }}
                        className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[8px] font-mono flex items-center gap-0.5 hover:bg-black transition-colors"
                        title="Alternate angle"
                      >
                        <Layers className="w-2 h-2" />
                        <span>{imgIndex + 1}/{piece.images.length}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[8.5px] uppercase tracking-wider text-neutral-500 font-semibold">
                      {pIdx === 0 ? '01 // TOP' : '02 // BOTTOM'}
                    </div>
                    <h4 className="font-sans font-bold text-xs text-neutral-900 leading-tight truncate mt-0.5" title={piece.name}>
                      {piece.name}
                    </h4>
                    <div className="font-mono text-xs font-bold text-[#ff1100] mt-0.5">
                      ₹{piece.price.toLocaleString('en-IN')}
                    </div>

                    {/* Sizes & Add */}
                    <div className="flex items-center justify-between gap-1 mt-2">
                      <div className="flex items-center gap-1">
                        {piece.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSizeChange(piece.id, sz);
                            }}
                            className={`px-1.5 py-0.5 text-[8.5px] font-mono uppercase rounded transition-colors ${
                              currentSize === sz
                                ? 'bg-black text-white font-bold'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-black'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSinglePiece(piece);
                        }}
                        className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-black text-white hover:bg-[#ff1100]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-2.5 h-2.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-2.5 h-2.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bundle Add Both */}
          <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500">
              Set Total: ₹{(currentLook.pieces.reduce((sum, p) => sum + p.price, 0)).toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => {
                currentLook.pieces.forEach((p) => handleAddSinglePiece(p));
              }}
              className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-[#ff1100] text-white font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add Both Pieces to Bag</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Row (Line removed below numbers) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center px-4 pb-2 pt-1 font-mono text-[11px] text-neutral-500">
        <span className="uppercase tracking-widest text-[10px] sm:text-[11px]">
          {currentLook.lookNumber} OF 07 // {currentLook.category}
        </span>
        <button
          onClick={() => setShowBottomPieces((prev) => !prev)}
          className="explore-pieces-btn flex items-center gap-1.5 text-neutral-900 hover:text-[#ff1100] uppercase tracking-wider font-semibold transition-colors text-[10px] sm:text-[11px] cursor-pointer"
        >
          <span>{showBottomPieces ? 'Close Pieces' : 'Explore Pieces (2)'}</span>
          <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showBottomPieces ? '-rotate-90 text-[#ff1100]' : ''}`} />
        </button>
      </div>
    </section>
  );
}
