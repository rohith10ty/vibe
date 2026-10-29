import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Plus, ArrowUpRight, Sparkles, Layers } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/fashionData';

export default function ShopPage({ onAddToCart, onJumpToRunway, onOpenAiStylist }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItemIds, setAddedItemIds] = useState([]);
  const [activeImageIndices, setActiveImageIndices] = useState({});

  const categories = [
    { label: 'All Pieces (14)', value: 'All' },
    { label: 'Tops (7)', value: 'Tops' },
    { label: 'Bottoms (7)', value: 'Bottoms' },
  ];

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.lookTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // featured default
    });
  }, [activeCategory, searchQuery, sortBy]);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleCycleImage = (e, productId, total) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }));
  };

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id] || product.sizes[0];
    if (onAddToCart) {
      onAddToCart({ ...product, selectedSize: size });
    }
    setAddedItemIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  return (
    <section id="shop" className="relative w-full bg-white py-20 px-4 sm:px-8 lg:px-16 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#ff1100]">
              <span className="w-2 h-2 rounded-full bg-[#ff1100]"></span>
              <span>H&M INDIA WARDROBE // 14 PIECES</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
              The Wardrobe Pieces.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-500 uppercase tracking-wider mt-2">
              All 14 authentic H&M pieces featured across the 7 Runway Outfits (1 Top & 1 Bottom each).
            </p>
          </div>

          <button
            onClick={onOpenAiStylist}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#ff1100] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff1100]" />
            <span>Generate Outfit with AI</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 py-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-black text-white font-medium shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search piece, color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full font-mono text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by"
                className="appearance-none pl-4 pr-9 py-2 bg-neutral-50 border border-neutral-200 rounded-full font-mono text-xs uppercase tracking-wider text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid: Exactly 14 Items (2 in a row on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const isAdded = addedItemIds.includes(product.id);
            const currentSize = selectedSizes[product.id] || product.sizes[0];
            const images = product.images && product.images.length > 0 ? product.images : [product.image];
            const currentImgIndex = activeImageIndices[product.id] || 0;
            const currentDisplayImage = images[currentImgIndex] || images[0];

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between border border-neutral-200 rounded-xl sm:rounded-2xl overflow-hidden hover:border-neutral-400 hover:shadow-xl transition-all duration-300 bg-white"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                  <img
                    src={currentDisplayImage}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Multiple image cycler indicator */}
                  {images.length > 1 && (
                    <button
                      onClick={(e) => handleCycleImage(e, product.id, images.length)}
                      className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/75 hover:bg-black text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-mono text-[8px] sm:text-[10px] flex items-center gap-1 shadow-md transition-colors"
                      title="Click to view alternate image angle"
                    >
                      <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff1100]" />
                      <span>{currentImgIndex + 1}/{images.length}</span>
                    </button>
                  )}

                  {/* Look badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[8px] sm:text-[10px] uppercase tracking-wider">
                    L{product.lookNumber}
                  </div>

                  {/* Jump to Runway button */}
                  <button
                    onClick={() => onJumpToRunway(product.lookId)}
                    title="View this look on the runway"
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-[#ff1100] text-black hover:text-white flex items-center justify-center shadow-md transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[8px] sm:text-[10px] uppercase text-neutral-400 tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-sans font-semibold text-xs sm:text-base text-neutral-900 mt-0.5 sm:mt-1 line-clamp-1 group-hover:text-[#ff1100] transition-colors leading-tight" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="hidden sm:block font-mono text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2.5 sm:mt-4 sm:pt-4 border-t border-neutral-100">
                    {/* Sizes */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="font-mono text-[8px] sm:text-[10px] text-neutral-400 uppercase">
                        Size:
                      </span>
                      <div className="flex gap-0.5 sm:gap-1 overflow-x-auto">
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleSizeSelect(product.id, sz)}
                            className={`px-1 sm:px-2 py-0.5 font-mono text-[8px] sm:text-[10px] rounded border transition-colors ${
                              currentSize === sz
                                ? 'bg-black text-white border-black'
                                : 'border-neutral-200 text-neutral-600 hover:border-black'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pricing in Indian Rupees & Add to Cart */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <span className="font-mono text-xs sm:text-base font-bold text-neutral-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="hidden sm:inline font-mono text-xs text-neutral-400 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center justify-center gap-1 px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-mono text-[9px] sm:text-xs uppercase tracking-wider transition-all active:scale-95 flex-shrink-0 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-black text-white hover:bg-[#ff1100]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center font-mono text-neutral-500 uppercase tracking-wider">
            No matching pieces found for "{searchQuery}".
          </div>
        )}
      </div>
    </section>
  );
}
