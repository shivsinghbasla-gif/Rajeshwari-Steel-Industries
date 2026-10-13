import React from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  ExternalLink,
  Instagram,
  Youtube,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import {
  getCleanPhone,
  generateWhatsAppLink,
  getGoogleMapsUrl,
  getShopOpenStatus,
} from '../utils/helpers.ts';

interface FooterProps {
  businessInfo: BusinessInfo;
  onOpenQuoteModal: (initialRequirement?: string) => void;
  onOpenAdminModal: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  businessInfo,
  onOpenQuoteModal,
  onOpenAdminModal,
  onNavigateSection,
}) => {
  const shopStatus = getShopOpenStatus(businessInfo);
  const mapsUrl = getGoogleMapsUrl(
    businessInfo.coordinates.lat,
    businessInfo.coordinates.lng
  );

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold font-heading text-lg shrink-0 overflow-hidden shadow-xs">
                {businessInfo.logoUrl ? (
                  <img
                    src={businessInfo.logoUrl}
                    alt={businessInfo.name || "Rajeshwar Steel Industries"}
                    className="w-full h-full object-contain p-0.5"
                  />
                ) : (
                  <span>RSI</span>
                )}
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-slate-900 block">
                  RAJESHWAR STEEL INDUSTRIES
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  Owner: {businessInfo.proprietor || "Mukesh Choudhary"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Precision stainless steel fabrication, heavy compound gates, architectural balcony railings, and commercial storage systems tailored to custom measurements across Bhopal, MP.
            </p>

            <div className="text-xs text-slate-500 space-y-1">
              <div>
                GSTIN: <span className="font-mono text-slate-800 font-medium">{businessInfo.gstin}</span>
              </div>
              <div>
                Official Billing & Tax Compliant Fabricator
              </div>
            </div>

            {/* Configurable Social Media Links (Instagram & YouTube) */}
            <div className="flex items-center gap-3 pt-2">
              {businessInfo.instagramUrl && businessInfo.instagramUrl.trim() !== '' && (
                <a
                  href={businessInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 border border-slate-200 transition-colors"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {businessInfo.youtubeUrl && businessInfo.youtubeUrl.trim() !== '' && (
                <a
                  href={businessInfo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-600 border border-slate-200 transition-colors"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold font-heading text-slate-900 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  11 Product Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Railing & Gate Designs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('projects')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Projects Gallery (50+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('designs')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Design Inspirations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('calculator')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Price + GST Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('reviews')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Google Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq')}
                  className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  FAQ & Policies
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Offerings */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-heading text-slate-900 uppercase tracking-wider">
              Popular Works
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Round & Square Pipe Railings</li>
              <li>• SS 304 & 316 Toughened Glass Railings</li>
              <li>• CNC Laser Cut Decorative Railings</li>
              <li>• Heavy Stainless Steel Gates</li>
              <li>• Designer Steel Jhula (Swings)</li>
              <li>• SS Safety Windows & Steel Beds</li>
              <li>• SS Master Starting Pillars</li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-heading text-slate-900 uppercase tracking-wider">
              Contact Workshop
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Primary: {businessInfo.phonePrimary}</span>
              </a>

              {businessInfo.phoneSecondary && (
                <a
                  href={`tel:${getCleanPhone(businessInfo.phoneSecondary)}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Alternate: {businessInfo.phoneSecondary}</span>
                </a>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  C4, Shop 01, Near Ruchi Hotel, Sobhagya Nagar Industrial Area, Semra Rd, Govindpura, Bhopal - 462023
                </span>
              </a>

              <div className="pt-2 text-slate-600 flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div>Mon–Sat: {businessInfo.businessHours.weekday}</div>
                  <div>Sun: {businessInfo.businessHours.sunday}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Rajeshwar Steel Industries. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <span>Google Maps Pin (23.2675, 77.4328)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <button
              onClick={onOpenAdminModal}
              className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
