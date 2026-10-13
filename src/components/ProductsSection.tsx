import React, { useState } from 'react';
import { Search, MessageSquare, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { ProductItem, BusinessInfo, MAIN_11_PRODUCT_CATEGORIES } from '../types.ts';
import { generateWhatsAppLink } from '../utils/helpers.ts';

interface ProductsSectionProps {
  products: ProductItem[];
  businessInfo: BusinessInfo;
  onOpenQuoteModal: (initialRequirement?: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  businessInfo,
  onOpenQuoteModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});

  // Strictly the 11 requested main product categories
  const categories = ['All', ...MAIN_11_PRODUCT_CATEGORIES];

  const visibleProducts = products.filter((p) => p.isVisible !== false);

  const filteredProducts = visibleProducts.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.design && product.design.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Official Product Catalogue
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              11 Core Fabrication Categories
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore our master collection of round & square pipe railings, luxury glass railings, laser-cut panels, steel jhulas, main gates, windows, beds, pillars, and custom fabrication works.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredProducts.length}</span> designs
            </span>
          </div>
        </div>

        {/* 11 Main Product Categories Mobile & Desktop Explorer */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-600 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-blue-600">
              <Layers className="w-4 h-4" />
              <span>Browse by Category (11 Official Categories):</span>
            </span>
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium underline cursor-pointer"
              >
                View All Categories
              </button>
            )}
          </div>

          {/* Quick Category Mobile Grid (11 categories) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 mb-4">
            <button
              onClick={() => setActiveCategory('All')}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-75">All Designs</div>
              <div className="text-xs font-bold truncate">All 11 Categories</div>
              <div className="text-[10px] mt-1 opacity-80">{visibleProducts.length} items</div>
            </button>

            {MAIN_11_PRODUCT_CATEGORIES.map((cat, idx) => {
              const catCount = visibleProducts.filter((p) => p.category === cat).length;
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-600/20'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider opacity-75">#{idx + 1}</div>
                  <div className="text-xs font-bold truncate">{cat}</div>
                  <div className="text-[10px] mt-1 opacity-80">{catCount} designs</div>
                </button>
              );
            })}
          </div>

          {/* Search Input & Active Category Indicator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-700">
              Active Category:{' '}
              <span className="font-bold text-blue-600">
                {activeCategory === 'All' ? 'All 11 Categories' : activeCategory}
              </span>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search designs, grade 202/304..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-slate-800 font-semibold text-sm">No products found in this category or search.</p>
            <p className="text-slate-500 text-xs mt-1">Try resetting the category filter or searching for another design.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isCustomQuote =
                product.priceUnit === 'Custom quotation' ||
                (product.rateRange && product.rateRange.toLowerCase().includes('custom quotation'));

              const productWhatsApp = generateWhatsAppLink(
                businessInfo.phonePrimary,
                isCustomQuote
                  ? `Hello Rajeshwar Steel, I want to get a custom quotation and site visit for "${product.title}" (${product.category}) in Bhopal.`
                  : `Hello Rajeshwar Steel, I am inquiring about "${product.title}" (${product.category}). Please share current pricing and site visit details for Bhopal.`
              );

              // Multi-photo list
              const photoList: string[] = (() => {
                const list = product.images && product.images.length > 0 ? [...product.images] : [];
                if (product.image && !list.includes(product.image)) {
                  list.unshift(product.image);
                }
                return list.length > 0 ? list : [product.image];
              })();

              const currentPhotoIndex = activePhotoIndices[product.id] || 0;
              const currentPhoto = photoList[currentPhotoIndex] || product.image;

              const handlePrevPhoto = (e: React.MouseEvent) => {
                e.stopPropagation();
                setActivePhotoIndices((prev) => ({
                  ...prev,
                  [product.id]: (currentPhotoIndex - 1 + photoList.length) % photoList.length,
                }));
              };

              const handleNextPhoto = (e: React.MouseEvent) => {
                e.stopPropagation();
                setActivePhotoIndices((prev) => ({
                  ...prev,
                  [product.id]: (currentPhotoIndex + 1) % photoList.length,
                }));
              };

              return (
                <div
                  key={product.id}
                  className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 group shadow-xs"
                >
                  {/* Image Carousel */}
                  <div className="relative h-52 overflow-hidden bg-slate-100 select-none">
                    <img
                      src={currentPhoto}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Category Label */}
                    <span className="absolute top-3 left-3 text-[10px] sm:text-[11px] font-semibold text-slate-800 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs">
                      {product.category}
                    </span>

                    {/* Multi-photo switcher controls */}
                    {photoList.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevPhoto}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-opacity opacity-80 hover:opacity-100"
                          title="Previous photo"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPhoto}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-opacity opacity-80 hover:opacity-100"
                          title="Next photo"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Photo dots */}
                        <div className="absolute bottom-2 left-3 flex items-center gap-1 z-10">
                          {photoList.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                dotIdx === currentPhotoIndex
                                  ? 'bg-blue-500 w-3'
                                  : 'bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Rate Indicator */}
                    {isCustomQuote ? (
                      <div className="absolute bottom-2.5 right-2.5 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs">
                        Custom Quotation
                      </div>
                    ) : product.rateRange ? (
                      <div className="absolute bottom-2.5 right-2.5 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs">
                        {product.rateRange}
                      </div>
                    ) : null}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Custom Quotation vs Grade Prices */}
                      {isCustomQuote ? (
                        <div className="mt-3 bg-blue-50/70 p-2.5 rounded-lg border border-blue-200/70 flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 font-medium">Pricing:</span>
                          <span className="text-blue-700 font-bold">Custom Quote on Site Survey</span>
                        </div>
                      ) : product.gradePrices && product.gradePrices.length > 0 ? (
                        <div className="mt-3 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 space-y-1 text-[11px]">
                          {product.gradePrices.map((gp, gIdx) => (
                            <div key={gIdx} className="flex items-center justify-between">
                              <span className="text-slate-600 font-medium">{gp.grade}:</span>
                              <span className="font-mono font-bold text-blue-700">
                                {gp.price} <span className="text-[10px] text-slate-500 font-normal">{gp.unit}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {/* Technical Specs */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400">Material:</span>
                          <span className="font-medium text-slate-800 text-right truncate ml-2">
                            {product.material}
                          </span>
                        </div>
                        {product.grade && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400">Grade:</span>
                            <span className="font-semibold text-blue-600 text-right truncate ml-2">
                              {product.grade}
                            </span>
                          </div>
                        )}
                        {product.finish && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400">Finish:</span>
                            <span className="font-medium text-slate-700 text-right truncate ml-2">
                              {product.finish}
                            </span>
                          </div>
                        )}
                        {product.design && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400">Design:</span>
                            <span className="font-medium text-slate-800 text-right truncate ml-2">
                              {product.design}
                            </span>
                          </div>
                        )}
                        {product.measurements && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400">Sizing:</span>
                            <span className="font-medium text-slate-800 text-right truncate ml-2">
                              {product.measurements}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onOpenQuoteModal(`${product.title} (${product.category})`)}
                        className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                      >
                        Request Quote
                      </button>

                      <a
                        href={productWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center shadow-xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
