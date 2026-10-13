import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FaqItem, BusinessInfo } from '../types.ts';
import { generateWhatsAppLink } from '../utils/helpers.ts';

interface FaqSectionProps {
  faqs: FaqItem[];
  businessInfo: BusinessInfo;
  onOpenQuoteModal: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqs,
  businessInfo,
  onOpenQuoteModal,
}) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const whatsappFaqLink = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Rajeshwar Steel, I have a specific question about custom fabrication that isn't answered in your FAQ.`
  );

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Clear information about custom sizing, materials, on-site measurements, timelines, and payment options for projects in Bhopal.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all hover:border-blue-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-semibold text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 bg-blue-50' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-sm font-medium text-slate-700">
            Have a question not listed here? Ask Mukesh Choudhary directly.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappFaqLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              onClick={onOpenQuoteModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Submit Custom Query</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
