import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-[#0a0a0c] text-white pt-16 pb-3 sm:pb-4 px-6 sm:px-12 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-semibold uppercase tracking-tight flex items-center gap-1">
              VIBE<span className="italic text-[#ff1100]">*</span>
            </span>
            <p className="font-mono text-xs text-neutral-400 max-w-sm leading-relaxed uppercase tracking-wider">
              Autonomous neural styling atelier blending contemporary high-fashion silhouettes with bespoke algorithmic garment curation.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ATELIER OPEN // AUTUMN 2026 CAPSULE</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
            <span className="text-neutral-500 text-[10px] tracking-widest block font-semibold">
              01 // RUNWAY
            </span>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="#runway" className="hover:text-[#ff1100] transition-colors">The 3D Runway</a></li>
              <li><a href="#runway" className="hover:text-[#ff1100] transition-colors">Complete Looks</a></li>
              <li><a href="#shop" className="hover:text-[#ff1100] transition-colors">H&M Collection</a></li>
              <li><a href="#shop" className="hover:text-[#ff1100] transition-colors">Catalogue Pieces</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
            <span className="text-neutral-500 text-[10px] tracking-widest block font-semibold">
              02 // INTELLIGENCE
            </span>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="#ai-stylist" className="hover:text-[#ff1100] transition-colors">Neural Stylist</a></li>
              <li><a href="#ai-stylist" className="hover:text-[#ff1100] transition-colors">Color Harmony</a></li>
              <li><a href="#ai-stylist" className="hover:text-[#ff1100] transition-colors">Wardrobe Synergies</a></li>
              <li><a href="#ai-stylist" className="hover:text-[#ff1100] transition-colors">Occasion Guide</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <span className="font-mono text-neutral-500 text-[10px] uppercase tracking-widest block font-semibold">
              03 // ATELIER DISPATCH
            </span>
            <p className="font-mono text-xs text-neutral-400">
              Receive private invitations to seasonal AI runway capsules.
            </p>
            <div className="flex items-center border border-white/20 rounded-full p-1 bg-white/[0.04]">
              <input
                type="email"
                placeholder="ENTER EMAIL"
                className="bg-transparent px-3 py-1 font-mono text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#ff1100] text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="Submit newsletter"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
          <span>© 2026 VIBE ATELIER INC. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}
