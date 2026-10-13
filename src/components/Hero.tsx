import React from 'react';
import {
  Sparkles,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Star,
  Ruler,
  CheckCircle,
  Building2,
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import { getCleanPhone, generateWhatsAppLink } from '../utils/helpers.ts';

interface HeroProps {
  businessInfo: BusinessInfo;
  onOpenQuoteModal: (initialRequirement?: string) => void;
  onNavigateSection: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  businessInfo,
  onOpenQuoteModal,
  onNavigateSection,
}) => {
  const whatsappHeroLink = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Rajeshwar Steel Industries, I am looking for custom steel fabrication / railings / gates for my property in Bhopal. Please share details.`
  );

  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-200">
      {/* Background with clean bright atmosphere and industrial workshop image */}
      <div className="absolute inset-0 z-0">
        <img
          src={businessInfo.heroImage}
          alt="Rajeshwar Steel Industries Fabrication Workshop"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out opacity-25"
        />
        {/* Multilayered high-contrast white & subtle blue overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-blue-50/60" />
        <div className="absolute inset-0 steel-mesh opacity-60 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Subtle location & proprietor kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-blue-600 mb-4 tracking-wider uppercase">
            <span>Govindpura Industrial Area, Bhopal</span>
            <span aria-hidden="true">·</span>
            <span>Owner: {businessInfo.proprietor || "Mukesh Choudhary"}</span>
            <span aria-hidden="true">·</span>
            <span>GST Registered</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.1] mb-6">
            Architectural Stainless Steel & Precision Metal Fabrication
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed font-normal">
            Bhopal's trusted fabrication workshop for precision round & square pipe railings, luxury glass railings, laser-cut panels, steel jhulas, compound gates, and custom steel fabrication. Built to exact custom measurements.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={() => onOpenQuoteModal()}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>Get Free Quote</span>
            </button>

            <a
              href={whatsappHeroLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageSquare className="w-5 h-5" />
              <span>WhatsApp Inquiry</span>
            </a>

            <a
              href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-base shadow-xs transition-all"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              <span>Call: {businessInfo.phonePrimary}</span>
            </a>

            <button
              onClick={() => onNavigateSection('projects')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 transition-all text-sm font-semibold cursor-pointer shadow-xs"
            >
              <span>Explore 50+ Real Works</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Trust Indicators Bar */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {/* Rating */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-heading font-bold text-lg text-slate-900">4.9 / 5.0</span>
              </div>
              <span className="text-xs text-slate-500">70+ Public Reviews</span>
            </div>

            {/* In-House Fabrication */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-slate-900 mb-1">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="font-heading font-bold text-sm text-slate-900">In-House Workshop</span>
              </div>
              <span className="text-xs text-slate-500">Govindpura Industrial</span>
            </div>

            {/* Grade Certified */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-slate-900 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-heading font-bold text-sm text-slate-900">SS 304 & SS 316</span>
              </div>
              <span className="text-xs text-slate-500">Certified Anti-Rust</span>
            </div>

            {/* Custom Sizing */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-slate-900 mb-1">
                <Ruler className="w-4 h-4 text-blue-600" />
                <span className="font-heading font-bold text-sm text-slate-900">Site Measured</span>
              </div>
              <span className="text-xs text-slate-500">Doorstep Laser Survey</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
