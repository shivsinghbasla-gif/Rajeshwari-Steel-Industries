import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import { addLead } from '../services/storage.ts';
import { processImageFile, generateWhatsAppLink } from '../utils/helpers.ts';

interface CustomDesignUploadSectionProps {
  businessInfo: BusinessInfo;
  onLeadSubmitted: (leadName: string) => void;
}

export const CustomDesignUploadSection: React.FC<CustomDesignUploadSectionProps> = ({
  businessInfo,
  onLeadSubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('Stainless Steel Gate');
  const [location, setLocation] = useState('');
  const [approxSize, setApproxSize] = useState('');
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorText(null);
      const dataUrl = await processImageFile(file);
      setImagePreview(dataUrl);
    } catch (err: any) {
      setErrorText(err.message || 'Failed to process image file');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        requirement,
        productOrService: `Custom Design: ${requirement}`,
        location: location.trim() || 'Bhopal',
        approxArea: approxSize.trim(),
        referenceImage: imagePreview || undefined,
        message: message.trim() || 'Custom design uploaded for quotation estimation.',
        source: 'Have a Design in Mind (Custom Upload)',
      });

      setSubmittedLeadId(created.id);
      onLeadSubmitted(name);
    } catch (err) {
      setErrorText('Failed to save your enquiry. Please check storage permissions or try WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setLocation('');
    setApproxSize('');
    setMessage('');
    setImagePreview(null);
    setSubmittedLeadId(null);
    setErrorText(null);
  };

  const successWhatsAppLink = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Mukesh Choudhary, I just submitted my custom design photo on Rajeshwar Steel Industries website.\nName: ${name}\nRequirement: ${requirement}\nApprox Size: ${approxSize || 'Standard'}\nLocation: ${location || 'Bhopal'}`
  );

  return (
    <section id="custom-design" className="py-20 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description Column */}
          <div className="lg:col-span-5">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Have a Design in Mind?
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
              Bring Your Reference Photo or Architect Blueprint
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
              Found a gate design on Pinterest or Instagram? Or did your architect design a custom SS balcony railing?
            </p>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Upload the photo here. Our master fabricator Mukesh Choudhary will inspect the structural feasibility, gauge requirements, and calculate an accurate price quote for you.
            </p>

            <div className="mt-8 space-y-3.5 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>100% exact pattern matching from photos</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Custom scaling to fit your actual boundary or staircase</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>No charges for design feasibility consultation</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl relative">
              {submittedLeadId ? (
                /* Success View */
                <div className="py-8 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-slate-900">
                    Design Received Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-900">{name}</span>. Your reference design and specifications have been recorded in our workshop system.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Mukesh Choudhary or our fabrication supervisor will review your photo and call you at <span className="text-blue-600 font-mono font-semibold">{phone}</span> shortly.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={successWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Forward Directly on WhatsApp</span>
                    </a>
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all cursor-pointer"
                    >
                      Upload Another Design
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorText && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorText}</span>
                    </div>
                  )}

                  {/* Photo Upload Area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Reference Photo / Blueprint (Optional but Recommended)
                    </label>

                    {imagePreview ? (
                      <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Uploaded Reference Preview"
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div className="truncate">
                            <span className="text-xs font-medium text-slate-800 block truncate">
                              Design Photo Attached
                            </span>
                            <span className="text-[11px] text-emerald-600 font-semibold">Ready to submit with inquiry</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30 group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-2 transition-colors">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            Click or tap to upload photo
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            JPEG, PNG, WEBP from your phone gallery or files
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Info row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
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
                        placeholder="e.g. 98260XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Requirement & Approx Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Requirement Type
                      </label>
                      <select
                        value={requirement}
                        onChange={(e) => setRequirement(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Stainless Steel Gate">Stainless Steel Gate</option>
                        <option value="Laser Cut CNC Compound Gate">Laser Cut CNC Compound Gate</option>
                        <option value="Balcony SS & Glass Railing">Balcony SS & Glass Railing</option>
                        <option value="Staircase Handrail">Staircase Handrail</option>
                        <option value="Safety Window Grill">Safety Window Grill</option>
                        <option value="Warehouse / Storage Rack">Warehouse / Storage Rack</option>
                        <option value="Stainless Steel Furniture">Stainless Steel Furniture</option>
                        <option value="Custom Steel Structure">Custom Steel Structure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Approximate Dimensions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12ft x 6ft, or 40 Running Ft"
                        value={approxSize}
                        onChange={(e) => setApproxSize(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Location & Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Site Location in Bhopal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arera Colony, Kolar Road, Govindpura..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Specific Instructions or Design Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 'I want a gate like this photo with mirror polish SS 304 and motorized lock provision.'"
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
                    <span>{isSubmitting ? 'Uploading & Saving...' : 'Submit Design for Free Quote'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
