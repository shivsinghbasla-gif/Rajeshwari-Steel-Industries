import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DesignInspiration } from '../types.ts';
import { INITIAL_DESIGN_INSPIRATIONS } from '../data/seedData.ts';

interface DesignInspirationSectionProps {
  onSelectDesign: (designTitle: string) => void;
}

export const DesignInspirationSection: React.FC<DesignInspirationSectionProps> = ({
  onSelectDesign,
}) => {
  const designs = INITIAL_DESIGN_INSPIRATIONS;

  if (!designs || designs.length === 0) {
    return null;
  }

  return (
    <section id="designs" className="py-20 bg-stone-900/50 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
              Architectural Trends
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Design Inspiration Showcase
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Found a contemporary look that fits your architectural style? Click "Use This Design" to instantly preload our quotation engine with these specifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {designs.map((design) => (
            <div
              key={design.id}
              className="flex flex-col bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group shadow-lg"
            >
              <div className="relative h-56 overflow-hidden bg-stone-950">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-xs font-semibold text-stone-200 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded border border-stone-800">
                  {design.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {design.title}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-mono mt-1">
                    {design.specs}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-400 mt-2.5 leading-relaxed">
                    {design.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800">
                  <button
                    onClick={() => onSelectDesign(design.title)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Use This Design & Enquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
