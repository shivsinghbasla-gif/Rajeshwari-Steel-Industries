import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Ruler,
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import { addLead } from '../services/storage.ts';
import { processImageFile, generateWhatsAppLink } from '../utils/helpers.ts';

interface QuoteModalProps {
  isOpen: boolean;
  initialRequirement?: string;
  initialCalculatedDetails?: {
    unit?: string;
    measurements?: string;
    material?: string;
    estimatedAmount?: number;
    details?: string;
  };
  businessInfo: BusinessInfo;
  onClose: () => void;
  onLeadSubmitted: (leadName: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  initialRequirement,
  initialCalculatedDetails,
  businessInfo,
  onClose,
  onLeadSubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [requirement, setRequirement] = useState('Stainless Steel Railing');
  const [productOrService, setProductOrService] = useState('');
  const [location, setLocation] = useState('Bhopal');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [approxArea, setApproxArea] = useState('');
  const [unit, setUnit] = useState('Sq.Ft');
  const [material, setMaterial] = useState('SS 304');
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialRequirement) {
      setRequirement(initialRequirement);
      setProductOrService(initialRequirement);
    }
    if (initialCalculatedDetails) {
      if (initialCalculatedDetails.measurements) setApproxArea(initialCalculatedDetails.measurements);
      if (initialCalculatedDetails.material) setMaterial(initialCalculatedDetails.material);
      if (initialCalculatedDetails.unit) setUnit(initialCalculatedDetails.unit);
      if (initialCalculatedDetails.details) setMessage(initialCalculatedDetails.details);
    }
  }, [initialRequirement, initialCalculatedDetails]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorText(null);
      const dataUrl = await processImageFile(file);
      setImagePreview(dataUrl);
    } catch (err: any) {
      setErrorText(err.message || 'Error processing image');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorText('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorText('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    setErrorText(null);

    try {
      const created = addLead({
        name,
        phone,
        whatsapp: whatsapp.trim() || phone.trim(),
        requirement,
        productOrService: productOrService.trim() || requirement,
        location: location.trim() || 'Bhopal',
        length,
        width,
        height,
        approxArea,
        unit,
        material,
        referenceImage: imagePreview || undefined,
        message: message.trim(),
        source: 'Get Free Quote Form',
        estimatedAmount: initialCalculatedDetails?.estimatedAmount,
      });

      setSubmittedLeadId(created.id);
      onLeadSubmitted(name);
    } catch (err) {
      setErrorText('Could not submit inquiry. Please retry or contact directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setWhatsapp('');
    setMessage('');
    setImagePreview(null);
    setSubmittedLeadId(null);
    setErrorText(null);
    onClose();
  };

  const whatsappDirectLeadLink = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Rajeshwar Steel Industries, I just requested a quotation online.\nName: ${name}\nPhone: ${phone}\nRequirement: ${requirement}\nMaterial: ${material}\nDimensions: ${length ? `${length}x${width || height}` : approxArea || 'Custom'}\nLocation: ${location || 'Bhopal'}`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              No Obligation Free Estimation
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900">
              Get Official Quotation
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {submittedLeadId ? (
            /* Success confirmation */
            <div className="py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold font-heading text-slate-900">
                Quotation Request Recorded!
              </h4>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you <span className="font-semibold text-slate-900">{name}</span>. Your requirements have been logged directly into our workshop lead system.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Our proprietor Mukesh Choudhary or technical head will reach out on <span className="text-blue-600 font-mono font-semibold">{phone}</span> to discuss site measurement and finalize the quotation.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappDirectLeadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Requirements on WhatsApp Now</span>
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorText && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Row 1: Name and Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9826012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp Number & Site Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    WhatsApp Number (if different)
                  </label>
                  <input
                    type="tel"
                    placeholder="WhatsApp contact"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Site Location in Bhopal *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kolar, Govindpura, Arera Colony..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Requirement & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Requirement Category
                  </label>
                  <select
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Round Pipe Railing">Round Pipe Railing</option>
                    <option value="Square Pipe Railing">Square Pipe Railing</option>
                    <option value="Premium Railing Design">Premium Railing Design</option>
                    <option value="Glass Railing">Glass Railing</option>
                    <option value="Laser Cut Railing Design">Laser Cut Railing Design</option>
                    <option value="Steel Jhula">Steel Jhula</option>
                    <option value="Steel Gate">Steel Gate</option>
                    <option value="Steel Window">Steel Window</option>
                    <option value="Steel Bed">Steel Bed</option>
                    <option value="SS Main Pillar">SS Main Pillar</option>
                    <option value="Steel Fabrication">Steel Fabrication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Material Grade
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="SS 304 Architectural Grade">SS 304 Architectural Grade</option>
                    <option value="SS 316 Marine Grade">SS 316 Marine Grade</option>
                    <option value="SS 202 Commercial Grade">SS 202 Commercial Grade</option>
                    <option value="Mild Steel (MS)">Mild Steel (MS)</option>
                    <option value="Cast / Wrought Iron">Cast / Wrought Iron</option>
                  </select>
                </div>
              </div>

              {/* Dimensions Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-2">
                  Approximate Dimensions (if known)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Length"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Sq.Ft">Sq.Ft</option>
                      <option value="Running Ft">Running Ft</option>
                      <option value="Sq.M">Sq.M</option>
                      <option value="Inches">Inches</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reference Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reference Photo (Optional)
                </label>
                {imagePreview ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="text-xs text-slate-800">Photo Attached</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 text-xs text-slate-600 hover:text-blue-600 flex items-center justify-center gap-2 bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload drawing / sample photo</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specific Requirements or Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your requirements or site conditions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isSubmitting ? 'Recording Inquiry...' : 'Get Free Quote'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
