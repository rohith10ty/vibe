import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Slide-over panel */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out z-10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ff1100]" />
            <h3 className="font-sans text-xl font-bold text-neutral-900">
              Shopping Bag ({cartItems.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-neutral-400" />
              </div>
              <h4 className="font-sans font-bold text-lg text-neutral-900">Your bag is empty</h4>
              <p className="font-mono text-xs text-neutral-500 mt-1 max-w-xs uppercase tracking-wider">
                Explore the 3D runway or catalogue to add curated pieces.
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex gap-4 p-3 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
              >
                <div className="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                        {item.brand}
                      </span>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-neutral-400 hover:text-[#ff1100] transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h5 className="font-sans font-semibold text-xs text-neutral-900 line-clamp-1 mt-0.5">
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        Size: {item.selectedSize || 'Standard'}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {item.color}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-neutral-900 mt-2">
                    ${item.price}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="uppercase text-neutral-500">Subtotal:</span>
              <span className="font-sans text-xl font-bold text-neutral-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
              Free expedited shipping & atelier packaging included.
            </p>
            <button
              onClick={() => alert('Proceeding to Checkout with your curated VIBE pieces!')}
              className="w-full py-3.5 rounded-full bg-black text-white font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-[#ff1100] transition-colors shadow-lg active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
