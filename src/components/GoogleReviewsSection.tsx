import React from 'react';
import { Star, MapPin, ExternalLink, MessageSquare, Quote } from 'lucide-react';
import { Testimonial, BusinessInfo } from '../types.ts';
import { getGoogleMapsUrl } from '../utils/helpers.ts';

interface GoogleReviewsSectionProps {
  testimonials: Testimonial[];
  businessInfo: BusinessInfo;
  onOpenQuoteModal: () => void;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({
  testimonials,
  businessInfo,
  onOpenQuoteModal,
}) => {
  const googleMapsUrl = getGoogleMapsUrl(
    businessInfo.coordinates.lat,
    businessInfo.coordinates.lng
  );

  return (
    <section id="reviews" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Public Customer Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Verified Google Reviews & Ratings
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Rajeshwar Steel Industries maintains a 4.9–5.0 star reputation across public local business listings with over 70+ customer ratings.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-xs group cursor-pointer"
            >
              <span>View All 70+ Reviews on Google</span>
              <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Aggregate Rating Banner */}
        <div className="mb-10 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-extrabold font-heading text-blue-600">
              {businessInfo.rating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-slate-700 font-medium">
                Overall Google Business Rating · Over {businessInfo.reviewCount}+ Verified Local Reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Govindpura Industrial Area, Bhopal, MP</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all shadow-xs relative group"
            >
              <div>
                <Quote className="w-8 h-8 text-slate-200 mb-3" />
                
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(test.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{test.reviewText}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  {test.author}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{test.location}</span>
                  <span className="text-blue-600 font-medium">{test.date}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Project: {test.projectType}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
