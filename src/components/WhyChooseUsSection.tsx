import React from 'react';
import {
  Hammer,
  ShieldCheck,
  Ruler,
  ReceiptText,
  Sparkles,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { WhyChooseUsItem, BusinessInfo } from '../types.ts';

interface WhyChooseUsSectionProps {
  items: WhyChooseUsItem[];
  businessInfo: BusinessInfo;
  onOpenQuoteModal: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({
  items,
  businessInfo,
  onOpenQuoteModal,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'Ruler':
        return <Ruler className="w-5 h-5 text-blue-600" />;
      case 'ReceiptText':
        return <ReceiptText className="w-5 h-5 text-blue-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            The Fabrication Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Why Bhopal Trusts Rajeshwar Steel Industries
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            We operate an authentic physical workshop in the Sobhagya Nagar Industrial Area, Govindpura. All fabrication is executed in-house with zero subcontracting shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  {getIcon(item.iconName)}
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
