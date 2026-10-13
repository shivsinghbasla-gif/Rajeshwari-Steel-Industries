import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Menu,
  X,
  Shield,
  Calculator,
  Sparkles,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import { getShopOpenStatus, getCleanPhone, generateWhatsAppLink } from '../utils/helpers.ts';

interface NavbarProps {
  businessInfo: BusinessInfo;
  onOpenQuoteModal: (initialRequirement?: string) => void;
  onOpenAdminModal: () => void;
  isAdmin: boolean;
  onNavigateSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessInfo,
  onOpenQuoteModal,
  onOpenAdminModal,
  isAdmin,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shopStatus = getShopOpenStatus(businessInfo);

  const navLinks = [
    { label: 'Products & Railings', id: 'products' },
    { label: 'Projects (50+)', id: 'projects' },
    { label: 'Design Ideas', id: 'designs' },
    { label: 'Price Estimator', id: 'calculator' },
    { label: 'About Us', id: 'about' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Location', id: 'location' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  const whatsappLink = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Rajeshwar Steel Industries, I visited your website and would like to inquire about steel fabrication / railings / gates.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top Utility Bar */}
      <div className="hidden lg:block bg-blue-950 border-b border-blue-900/60 text-xs text-blue-100 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${shopStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
              <span className="font-semibold text-white">{shopStatus.statusText}</span>
              <span className="text-blue-300">·</span>
              <span className="text-blue-200">{shopStatus.todayHoursText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-md">Govindpura Industrial Area, Bhopal (Near Ruchi Hotel)</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-blue-200">
              GSTIN: <span className="font-mono text-white font-medium">{businessInfo.gstin}</span>
            </span>
            <span className="text-blue-800">|</span>
            <a
              href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
              className="flex items-center gap-1.5 text-white font-semibold hover:text-blue-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Call: {businessInfo.phonePrimary}</span>
            </a>
            <button
              onClick={onOpenAdminModal}
              className="text-blue-300 hover:text-white transition-colors p-1 flex items-center gap-1 text-[11px] cursor-pointer"
              title="Admin CMS Access"
            >
              <Lock className="w-3 h-3 text-blue-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Prominent Shop Name and Owner Name */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-left group py-1 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold font-heading text-lg sm:text-xl shadow-xs group-hover:border-blue-400 transition-colors shrink-0 overflow-hidden p-1">
              {businessInfo.logoUrl ? (
                <img
                  src={businessInfo.logoUrl.startsWith('/') && !businessInfo.logoUrl.startsWith('//')
                    ? `${import.meta.env.BASE_URL}${businessInfo.logoUrl.slice(1)}`
                    : businessInfo.logoUrl}
                  alt={businessInfo.name || "Rajeshwar Steel Industries"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}logo.svg`}
                  alt={businessInfo.name || "Rajeshwar Steel Industries"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if missing
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const span = document.createElement('span');
                      span.textContent = 'RSI';
                      target.parentElement.appendChild(span);
                    }
                  }}
                />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              {/* Primary Business Heading */}
              <h1 className="font-heading font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">
                {businessInfo.name || "Rajeshwar Steel Industries"}
              </h1>
              {/* Prominent Owner Name directly below shop name */}
              <div className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide mt-0.5 flex items-center gap-1">
                <span className="text-slate-500 font-medium">Owner:</span>
                <span className="text-blue-600 font-bold">
                  {businessInfo.proprietor || "Mukesh Choudhary"}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-sm font-medium transition-all"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="hidden lg:inline">{businessInfo.phonePrimary}</span>
              <span className="lg:hidden">Call</span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-all"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onOpenQuoteModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Get Free Quote</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-5 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${shopStatus.isOpen ? 'bg-emerald-500' : 'bg-blue-600'}`} />
              <span className="font-semibold text-slate-800">{shopStatus.statusText}</span>
            </div>
            <span className="text-slate-500">{shopStatus.todayHoursText}</span>
          </div>

          <nav className="flex flex-col gap-1 mb-5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-left text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-2 pt-3 border-t border-slate-200">
            <a
              href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Call {businessInfo.phonePrimary}</span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Instant Free Quote</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500 hover:text-blue-600"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
