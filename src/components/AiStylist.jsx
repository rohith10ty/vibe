import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { RUNWAY_LOOKS } from '../data/fashionData';

export default function AiStylist({ onAddToCart, onJumpToRunway }) {
  const [occasion, setOccasion] = useState('Casual');
  const [styleVibe, setStyleVibe] = useState('Modern Grunge');
  const [palette, setPalette] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [addedItemIds, setAddedItemIds] = useState([]);
  const [fullOutfitAdded, setFullOutfitAdded] = useState(false);

  const occasions = ['Casual', 'Streetwear', 'Formal', 'Traditional', 'Party'];
  const vibes = ['Modern Grunge', 'Nordic Minimal', 'Urban Bold', 'Sartorial Tailored', 'Resort Linen'];
  const palettes = ['All', 'Crimson & Black', 'Tonal Earth', 'Emerald Olive', 'Sky Blue & White'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Find matching look or cycle intelligently
      let matching = RUNWAY_LOOKS.findIndex(
        (l) => l.category.toLowerCase() === occasion.toLowerCase()
      );
      if (matching === -1 || matching === currentMatchIndex) {
        matching = (currentMatchIndex + 1) % RUNWAY_LOOKS.length;
      }
      setCurrentMatchIndex(matching);
      setIsGenerating(false);
    }, 800);
  };

  const matchedLook = RUNWAY_LOOKS[currentMatchIndex];

  const handleAddPiece = (piece) => {
    if (onAddToCart) {
      onAddToCart({ ...piece, selectedSize: piece.sizes[0] });
    }
    setAddedItemIds((prev) => [...prev, piece.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== piece.id));
    }, 2000);
  };

  const handleAddFullOutfit = () => {
    matchedLook.pieces.forEach((piece) => {
      if (onAddToCart) {
        onAddToCart({ ...piece, selectedSize: piece.sizes[0] });
      }
    });
    setFullOutfitAdded(true);
    setTimeout(() => setFullOutfitAdded(false), 2500);
  };

  return (
    <section id="ai-stylist" className="relative w-full bg-[#0a0a0c] text-white py-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Ambient neural glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#ff1100]/15 via-red-900/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#ff1100]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff1100] font-semibold">
              NEURAL FASHION SUITE v2.6
            </span>
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight text-white">
            AI Outfit Stylist.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-neutral-400 uppercase tracking-wider mt-2 leading-relaxed">
            Select your preferences and let our styling engine curate an aesthetic wardrobe recommendation.
          </p>
        </div>

        {/* Preference Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md mb-12">
          {/* 1. Occasion */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-neutral-400 mb-3">
              01 // Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setOccasion(occ)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                    occasion === occ
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Style Vibe */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-neutral-400 mb-3">
              02 // Style Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {vibes.map((vb) => (
                <button
                  key={vb}
                  onClick={() => setStyleVibe(vb)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                    styleVibe === vb
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {vb}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Palette */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-neutral-400 mb-3">
              03 // Color Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {palettes.map((pal) => (
                <button
                  key={pal}
                  onClick={() => setPalette(pal)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                    palette === pal
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {pal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="group relative flex items-center gap-3 px-8 py-4 bg-[#ff1100] text-white rounded-full font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-2xl active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{isGenerating ? 'Generating Neural Fit...' : 'Generate AI Recommendation'}</span>
          </button>
        </div>

        {/* AI Recommendation Result Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
          {/* Left Column: Full Cutout Model Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative h-[480px] sm:h-[540px] aspect-[2/3] flex items-end justify-center">
              {/* Floor Shadow */}
              <div
                className="absolute -bottom-4 w-48 sm:w-56 h-8 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 75%)',
                }}
              />

              <img
                src={matchedLook.cutoutImage}
                alt={matchedLook.title}
                className="w-full h-full object-contain object-bottom drop-shadow-2xl"
              />

              {/* Match Score Badge */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  {matchedLook.aiStyling.harmonyScore}% SYNERGY
                </span>
              </div>
            </div>

            <button
              onClick={() => onJumpToRunway(matchedLook.id)}
              className="mt-4 font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-[#ff1100] transition-colors flex items-center gap-1.5"
            >
              <span>Explore on 3D Runway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Column: AI Outfit Breakdown & Insights */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#ff1100] font-semibold">
                  LOOK {matchedLook.lookNumber}
                </span>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  {matchedLook.vibe}
                </span>
              </div>
              <h3 className="font-sans text-3xl sm:text-4xl font-bold text-white mt-1">
                {matchedLook.title}
              </h3>
              <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed">
                {matchedLook.description}
              </p>
            </div>

            {/* AI Insight Box */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#ff1100] tracking-widest font-semibold block">
                  AI Styling Rationale
                </span>
                <p className="font-mono text-xs text-neutral-200 mt-0.5 leading-relaxed">
                  "{matchedLook.aiStyling.rationale}"
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Recommended Accessories:</span>
                  <span className="text-white">{matchedLook.aiStyling.accessories.join(' • ')}</span>
                </div>
              </div>
            </div>

            {/* Included Pieces List */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block">
                Curated Pieces ({matchedLook.pieces.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {matchedLook.pieces.map((piece) => {
                  const isAdded = addedItemIds.includes(piece.id);
                  return (
                    <div
                      key={piece.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 mb-2">
                        <img
                          src={piece.image}
                          alt={piece.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-mono text-[10px] text-neutral-400 uppercase">
                            {piece.category}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            ${piece.price}
                          </span>
                        </div>
                        <h4 className="font-sans text-xs font-semibold text-white mt-0.5 line-clamp-1">
                          {piece.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleAddPiece(piece)}
                        className={`mt-2 w-full py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/10 hover:bg-[#ff1100] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <span>Add Piece</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete Outfit CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <span className="font-mono text-xs text-neutral-400 block">Complete Outfit Bundle:</span>
                <span className="font-sans text-xl font-bold text-white">
                  ${(matchedLook.pieces.reduce((s, p) => s + p.price, 0) * 0.85).toFixed(2)}
                  <span className="font-mono text-xs text-[#ff1100] font-normal ml-2">15% Off Bundle</span>
                </span>
              </div>

              <button
                onClick={handleAddFullOutfit}
                className={`px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-xl ${
                  fullOutfitAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-black hover:bg-[#ff1100] hover:text-white'
                }`}
              >
                {fullOutfitAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Outfit Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Full Look to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
