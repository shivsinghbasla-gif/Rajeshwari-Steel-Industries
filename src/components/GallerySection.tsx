import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Sparkles,
  MessageSquare,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { GalleryItem, BusinessInfo } from '../types.ts';
import { generateWhatsAppLink } from '../utils/helpers.ts';

interface GallerySectionProps {
  gallery: GalleryItem[];
  businessInfo: BusinessInfo;
  onOpenQuoteModal: (initialRequirement?: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  businessInfo,
  onOpenQuoteModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const categories = [
    'All',
    'Gates',
    'Railings',
    'Staircases',
    'Balconies',
    'Grills',
    'Furniture',
    'Racks',
    'Custom Fabrication',
    'Workshop',
  ];

  const filteredGallery = activeCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const displayedItems = filteredGallery.slice(0, visibleCount);

  const handleOpenLightbox = (item: GalleryItem) => {
    const idx = filteredGallery.findIndex((i) => i.id === item.id);
    setSelectedItemIndex(idx !== -1 ? idx : 0);
  };

  const handleCloseLightbox = () => {
    setSelectedItemIndex(null);
  };

  const handleNext = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex + 1) % filteredGallery.length);
    }
  };

  const handlePrev = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  const currentLightboxItem = selectedItemIndex !== null ? filteredGallery[selectedItemIndex] : null;

  return (
    <section id="projects" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Completed Works Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Real Project Gallery ({gallery.length}+ Works)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore authentic fabrication jobs executed across residential bungalows, commercial complexes, and industrial plants throughout Bhopal and MP.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{displayedItems.length}</span> of {filteredGallery.length} in this category
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(16);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-xs hover:border-blue-400 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Top Meta */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-semibold text-blue-300 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700">
                  {item.category}
                </span>

                <div className="w-7 h-7 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-1">
                  <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-200 mt-1.5 pt-1.5 border-t border-slate-700/80">
                  <span className="truncate max-w-[140px] text-slate-300">{item.material}</span>
                  <span className="font-semibold text-blue-300">{item.priceApprox}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredGallery.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 16, filteredGallery.length))}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-blue-600 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              Load More Projects ({filteredGallery.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {currentLightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
            aria-label="Close photo view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Navigation */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
            {/* Image Preview */}
            <div className="lg:w-3/5 bg-slate-950 flex items-center justify-center relative min-h-[300px] lg:min-h-[500px]">
              <img
                src={currentLightboxItem.image}
                alt={currentLightboxItem.title}
                className="max-h-[60vh] lg:max-h-[85vh] w-full object-contain"
              />
              <span className="absolute bottom-3 left-3 text-xs bg-black/80 px-2.5 py-1 rounded text-white">
                {(selectedItemIndex ?? 0) + 1} of {filteredGallery.length}
              </span>
            </div>

            {/* Project Details Sidebar */}
            <div className="lg:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-white text-slate-900">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
                  <span>{currentLightboxItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">Rajeshwar Steel Portfolio</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  {currentLightboxItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {currentLightboxItem.description}
                </p>

                {/* Specs Sheet */}
                <div className="mt-6 space-y-2.5 border-t border-slate-200 pt-4 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Material Grade:</span>
                    <span className="font-semibold text-slate-800">{currentLightboxItem.material}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-semibold text-slate-800">{currentLightboxItem.measurements}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Site Location:</span>
                    <span className="font-semibold text-slate-800">{currentLightboxItem.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Estimated Cost:</span>
                    <span className="font-bold text-blue-600">{currentLightboxItem.priceApprox}</span>
                  </div>
                </div>
              </div>

              {/* Direct Inquiry CTAs */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    handleCloseLightbox();
                    onOpenQuoteModal(`Project Inquiry: ${currentLightboxItem.title}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Enquire About This Project</span>
                </button>

                <a
                  href={generateWhatsAppLink(
                    businessInfo.phonePrimary,
                    `Hello Rajeshwar Steel, I saw this project in your gallery: "${currentLightboxItem.title}" at ${currentLightboxItem.location} (${currentLightboxItem.material}). I would like something similar for my site.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
