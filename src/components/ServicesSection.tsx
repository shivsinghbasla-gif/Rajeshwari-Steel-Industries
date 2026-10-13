import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Check, Sparkles } from 'lucide-react';
import { ServiceItem, BusinessInfo } from '../types.ts';
import { generateWhatsAppLink } from '../utils/helpers.ts';

interface ServicesSectionProps {
  services: ServiceItem[];
  businessInfo: BusinessInfo;
  onOpenQuoteModal: (initialRequirement?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  businessInfo,
  onOpenQuoteModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <section id="services" className="py-20 bg-stone-950 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
              Comprehensive Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Specialized Fabrication Services
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              From heavy compound sliding gates to precision SS 316 glass railings and custom industrial structures, every element is fabricated with structural rigidity and immaculate finishes.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => onOpenQuoteModal('Custom Fabrication Requirement')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Need a custom size or design?</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filters (Interactive segment tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const serviceWhatsApp = generateWhatsAppLink(
              businessInfo.phonePrimary,
              `Hello Rajeshwar Steel Industries, I am interested in your "${service.title}" service in Bhopal. Could you provide details and a price estimate?`
            );

            return (
              <div
                key={service.id}
                className="group flex flex-col bg-stone-900/70 border border-stone-800/90 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:bg-stone-900 transition-all duration-300 shadow-lg"
              >
                {/* Service Image with subtle scale */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-stone-950">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  
                  {/* Clean unboxed category label */}
                  <div className="absolute top-3 left-3 text-xs font-semibold text-amber-400 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-stone-800">
                    {service.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features checklist */}
                    {service.features && service.features.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-stone-800/60 pt-4">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                            <Check className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onOpenQuoteModal(service.title)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Get Quote</span>
                    </button>

                    <a
                      href={serviceWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all"
                      title="Enquire on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Conversion Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-900/60 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl font-bold font-heading text-white">Have a unique site measurement or drawing?</h3>
            <p className="text-sm text-stone-400 mt-1">
              Share your architect's drawings or sketch on WhatsApp or upload it for an itemized estimate.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuoteModal('Custom Drawing / Measurement')}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
            >
              Request Free Estimation
            </button>
            <a
              href={generateWhatsAppLink(businessInfo.phonePrimary, "Hello Rajeshwar Steel, I have an architect's drawing for steel work. Please take a look.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold"
            >
              Send on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
