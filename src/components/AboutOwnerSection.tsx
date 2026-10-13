import React from 'react';
import { UserCheck, Building2, Award, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import { getCleanPhone } from '../utils/helpers.ts';

interface AboutOwnerSectionProps {
  businessInfo: BusinessInfo;
  onOpenQuoteModal: () => void;
}

export const AboutOwnerSection: React.FC<AboutOwnerSectionProps> = ({
  businessInfo,
  onOpenQuoteModal,
}) => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Workshop / Visual side */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 aspect-4/5">
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80"
                alt="Rajeshwar Steel Industries Fabrication Machinery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

              {/* Verified Owner Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold font-heading text-lg">
                    MC
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                      Business Owner
                    </span>
                    <h4 className="text-base font-bold font-heading text-slate-900">
                      {businessInfo.proprietor || "Mukesh Choudhary"}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Master Fabricator & Business Founder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text and Credibility details */}
          <div className="lg:col-span-7">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Established Fabricator · Bhopal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
              Craftsmanship, Heavy Gauge Materials & Direct Accountability
            </h2>

            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
              {businessInfo.aboutStory}
            </p>

            {/* Highlights List */}
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
              {businessInfo.aboutHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Direct Contact Button */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Speak with Mukesh Choudhary</span>
              </a>

              <button
                onClick={onOpenQuoteModal}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold transition-all cursor-pointer shadow-xs"
              >
                Schedule Site Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
