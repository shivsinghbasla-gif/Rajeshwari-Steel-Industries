import React from 'react';
import { Phone, MessageSquare, Sparkles } from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import { getCleanPhone, generateWhatsAppLink } from '../utils/helpers.ts';

interface StickyMobileCtaProps {
  businessInfo: BusinessInfo;
  onOpenQuoteModal: () => void;
  isAdminView?: boolean;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({
  businessInfo,
  onOpenQuoteModal,
  isAdminView,
}) => {
  if (isAdminView) return null;

  const phoneHref = `tel:${getCleanPhone(businessInfo.phonePrimary)}`;
  const whatsappHref = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Rajeshwar Steel Industries, I am visiting your website on my mobile and would like to request an estimate.`
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-2.5 px-3 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-3 gap-2">
        {/* CALL */}
        <a
          href={phoneHref}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 text-xs font-bold transition-all active:scale-95"
          aria-label="Call Now"
        >
          <Phone className="w-3.5 h-3.5 text-blue-600" />
          <span>CALL</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          aria-label="WhatsApp Us"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WHATSAPP</span>
        </a>

        {/* GET QUOTE */}
        <button
          onClick={onOpenQuoteModal}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
          aria-label="Get Free Quote"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>GET QUOTE</span>
        </button>
      </div>
    </div>
  );
};
