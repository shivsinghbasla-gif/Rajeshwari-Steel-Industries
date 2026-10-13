import React, { useState, useId } from 'react';
import {
  Calculator as CalcIcon,
  Sparkles,
  Info,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { CalculatorRates, BusinessInfo } from '../types.ts';
import { formatINR, generateWhatsAppLink } from '../utils/helpers.ts';

interface SmartCalculatorSectionProps {
  rates: CalculatorRates;
  businessInfo: BusinessInfo;
  onRequestQuoteWithCalc: (calcSummary: {
    unit: string;
    measurements: string;
    material: string;
    estimatedAmount: number;
    details: string;
  }) => void;
}

export const SmartCalculatorSection: React.FC<SmartCalculatorSectionProps> = ({
  rates,
  businessInfo,
  onRequestQuoteWithCalc,
}) => {
  const [unit, setUnit] = useState<'Sq.Ft' | 'Sq.M' | 'Running Ft' | 'Running M'>('Sq.Ft');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(6); // or height
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('SS 304 Architectural Grade');
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);
  const [includeTransport, setIncludeTransport] = useState<boolean>(true);
  const [discountPercent, setDiscountPercent] = useState<number>(rates.discountDefault || 0);

  // Material multipliers
  const materialMultiplier = rates.materialMultipliers[selectedMaterial] || 1.0;

  // Base rate based on selected unit
  let baseUnitRate = rates.perSqFt;
  let isAreaUnit = true;

  if (unit === 'Sq.Ft') {
    baseUnitRate = rates.perSqFt;
    isAreaUnit = true;
  } else if (unit === 'Sq.M') {
    baseUnitRate = rates.perSqM;
    isAreaUnit = true;
  } else if (unit === 'Running Ft') {
    baseUnitRate = rates.runningFt;
    isAreaUnit = false;
  } else if (unit === 'Running M') {
    baseUnitRate = rates.runningM;
    isAreaUnit = false;
  }

  // Dimension measurement calculation
  const totalMeasure = isAreaUnit
    ? Math.max(0, length) * Math.max(0, width) * Math.max(1, quantity)
    : Math.max(0, length) * Math.max(1, quantity);

  // Financial components
  const adjustedRate = Math.round(baseUnitRate * materialMultiplier);
  const metalFabricationCost = Math.round(totalMeasure * adjustedRate);
  
  const labourRatePerUnit = isAreaUnit ? rates.labourPerSqFt : Math.round(rates.labourPerSqFt * 1.5);
  const labourCost = Math.round(totalMeasure * labourRatePerUnit);

  const installRatePerUnit = isAreaUnit ? rates.installPerSqFt : Math.round(rates.installPerSqFt * 1.5);
  const installationCost = includeInstallation ? Math.round(totalMeasure * installRatePerUnit) : 0;

  const transportCost = includeTransport ? rates.transportDefault : 0;

  const subtotal = metalFabricationCost + labourCost + installationCost + transportCost;
  const discountAmount = Math.round((subtotal * Math.max(0, discountPercent)) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const gstRate = rates.gstRatePercent || 18;
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const finalEstimatedTotal = taxableAmount + gstAmount;

  const calculationSummaryText = `Dimensions: ${length} x ${isAreaUnit ? width : ''} ${unit} (Qty: ${quantity})\nMaterial: ${selectedMaterial}\nTotal Measure: ${totalMeasure.toFixed(1)} ${unit}\nEstimated Amount: ${formatINR(finalEstimatedTotal)} (incl. ${gstRate}% GST)`;

  const whatsappCalcLink = generateWhatsAppLink(
    businessInfo.phonePrimary,
    `Hello Rajeshwar Steel Industries, I used your online Price & GST Calculator:\n- Requirement: Steel Fabrication\n- Specs: ${length} x ${isAreaUnit ? width : ''} ${unit} (Qty: ${quantity})\n- Material: ${selectedMaterial}\n- Estimated Price: ${formatINR(finalEstimatedTotal)} (incl. ${gstRate}% GST)\nPlease confirm site measurement availability in Bhopal.`
  );

  return (
    <section id="calculator" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Instant Cost Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Smart Price + GST Quotation Calculator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Configure your measurements, grade of stainless steel, and installation options to receive an instant mathematical estimate. Rates are calibrated to current central Indian steel market benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Input Column */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <span className="text-sm font-bold font-heading text-slate-900">
                Fabrication Parameters
              </span>
              <button
                onClick={() => {
                  setLength(10);
                  setWidth(6);
                  setQuantity(1);
                  setUnit('Sq.Ft');
                  setSelectedMaterial('SS 304 Architectural Grade');
                  setIncludeInstallation(true);
                  setIncludeTransport(true);
                  setDiscountPercent(0);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Unit Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Measurement Unit
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Sq.Ft', 'Sq.M', 'Running Ft', 'Running M'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        unit === u
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {isAreaUnit ? 'Length' : 'Total Length'} ({unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                {isAreaUnit && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Height / Width ({unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Material Grade Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Material & Grade Specification
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {Object.keys(rates.materialMultipliers).map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Grade 304 is standard for balcony & gate longevity; Grade 316 is recommended for high chemical/water exposure.
                </span>
              </div>

              {/* Options Checkboxes */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <input
                    type="checkbox"
                    checked={includeInstallation}
                    onChange={(e) => setIncludeInstallation(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span>Include On-Site Installation</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <input
                    type="checkbox"
                    checked={includeTransport}
                    onChange={(e) => setIncludeTransport(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span>Include Bhopal Site Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Breakdown & Total Summary Column */}
          <div className="lg:col-span-5 bg-white border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-lg relative">
            <div className="text-xs font-semibold text-blue-600 mb-1">
              Estimated Mathematical Breakdown
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-4">
              Estimated Quotation Summary
            </h3>

            {/* Calculated Values Table */}
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Computed {isAreaUnit ? 'Area' : 'Length'}:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {totalMeasure.toFixed(1)} {unit}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Base Metal Fabrication:</span>
                <span className="font-mono text-slate-800">
                  {formatINR(metalFabricationCost)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Argon Welding & Buffing Labour:</span>
                <span className="font-mono text-slate-800">{formatINR(labourCost)}</span>
              </div>

              {includeInstallation && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Doorstep Site Fitting & Anchors:</span>
                  <span className="font-mono text-slate-800">{formatINR(installationCost)}</span>
                </div>
              )}

              {includeTransport && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Govindpura Workshop Transport:</span>
                  <span className="font-mono text-slate-800">{formatINR(transportCost)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-semibold">Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special Discount ({discountPercent}%):</span>
                  <span className="font-mono">- {formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-500">
                <span>Taxable Value:</span>
                <span className="font-mono">{formatINR(taxableAmount)}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>GST ({gstRate}% Commercial Input Credit):</span>
                <span className="font-mono">{formatINR(gstAmount)}</span>
              </div>
            </div>

            {/* Total Highlight Card */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 block">
                Estimated Price (Tax Inclusive)
              </span>
              <div className="text-3xl font-extrabold font-heading text-blue-600 font-mono mt-1">
                {formatINR(finalEstimatedTotal)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Includes materials, fabrication, TIG polishing, and GST.
              </span>
            </div>

            {/* Crucial Required Disclaimer */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Important Disclaimer: </span>
                This is an <span className="text-blue-600 font-semibold">Estimated Price</span>. Final quotation may vary after physical site measurement, design complexity, CNC cutting details, and exact material thickness confirmation.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() =>
                  onRequestQuoteWithCalc({
                    unit,
                    measurements: `${length} x ${isAreaUnit ? width : ''} ${unit} (Qty: ${quantity})`,
                    material: selectedMaterial,
                    estimatedAmount: finalEstimatedTotal,
                    details: calculationSummaryText,
                  })
                }
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Request Free Quote with This Calculation</span>
              </button>

              <a
                href={whatsappCalcLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send This Estimate via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
