import React, { useState } from 'react';
import { Sparkles, RotateCcw, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onReplay, isLoaded }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Brand / Name */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="group flex flex-col font-mono text-sm tracking-widest font-semibold text-black uppercase hover:opacity-80 transition-opacity"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full inline-block animate-pulse"></span>
              AURA // ATELIER
            </span>
            <span className="text-[10px] tracking-wider text-neutral-400 font-normal">
              AI FASHION COUTURE • SS26
            </span>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-neutral-800">
          <a
            href="#collections"
            className="hover:text-red-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-red-600 hover:after:w-full after:transition-all"
          >
            Archive
          </a>
          <a
            href="#categories"
            className="hover:text-red-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-red-600 hover:after:w-full after:transition-all"
          >
            Categories
          </a>
          <a
            href="#ai-stylist"
            className="flex items-center gap-1.5 text-neutral-900 font-medium hover:text-red-600 transition-colors relative py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            AI Stylist
          </a>
          <a
            href="#lookbook"
            className="hover:text-red-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-red-600 hover:after:w-full after:transition-all"
          >
            Lookbook
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReplay}
            title="Replay Hero Animation"
            className="group flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 rounded-full text-[11px] font-mono uppercase tracking-wider text-neutral-700 hover:text-black hover:border-black bg-white/70 backdrop-blur-sm transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3 h-3 group-hover:-rotate-90 transition-transform duration-300 text-red-600" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <a
            href="#ai-stylist"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-red-600 transition-colors shadow-sm active:scale-95"
          >
            <span>Get Styled</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black hover:text-red-600 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-md md:hidden transition-all duration-300 flex flex-col justify-center px-8 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 font-mono text-lg uppercase tracking-widest text-neutral-200">
          <a
            href="#collections"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-red-500 transition-colors border-b border-neutral-800 pb-3"
          >
            Archive & Collections
          </a>
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-red-500 transition-colors border-b border-neutral-800 pb-3"
          >
            Fashion Categories
          </a>
          <a
            href="#ai-stylist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-white hover:text-red-500 transition-colors border-b border-neutral-800 pb-3"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              AI Stylist Recommendation
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-red-500 transition-colors border-b border-neutral-800 pb-3"
          >
            Complete Lookbook
          </a>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplay();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 border border-neutral-700 text-neutral-300 text-xs tracking-widest uppercase rounded-full hover:border-white hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-500" />
              Replay Intro Experience
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
