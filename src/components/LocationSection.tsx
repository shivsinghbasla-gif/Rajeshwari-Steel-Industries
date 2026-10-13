import React from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';
import {
  getGoogleMapsUrl,
  getGoogleMapsDirectionsUrl,
  getShopOpenStatus,
  getCleanPhone,
} from '../utils/helpers.ts';

interface LocationSectionProps {
  businessInfo: BusinessInfo;
  onOpenQuoteModal: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  businessInfo,
  onOpenQuoteModal,
}) => {
  const shopStatus = getShopOpenStatus(businessInfo);
  const mapsSearchUrl = getGoogleMapsUrl(
    businessInfo.coordinates.lat,
    businessInfo.coordinates.lng
  );
  const directionsUrl = getGoogleMapsDirectionsUrl(
    businessInfo.coordinates.lat,
    businessInfo.coordinates.lng
  );

  return (
    <section id="location" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Workshop & Direct Visit
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Find Our Govindpura Workshop
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Visit our fabrication facility in Bhopal to discuss your blueprints, inspect stainless steel pipe gauges, and see sample railing mockups in person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Address & Hours Information */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              {/* Live Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${shopStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-blue-600'}`} />
                  <span className="font-bold text-slate-900 text-base font-heading">
                    {shopStatus.statusText}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {shopStatus.todayHoursText}
                </span>
              </div>

              {/* Verified Physical Address */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Workshop Address</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  {businessInfo.address}
                </p>
                <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Landmark: {businessInfo.landmark}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  GPS: {businessInfo.coordinates.lat}, {businessInfo.coordinates.lng}
                </div>
              </div>

              {/* Working Hours Schedule */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Regular Operating Hours</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Monday – Saturday:</span>
                    <span className="font-semibold text-slate-800">
                      {businessInfo.businessHours.weekday}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Sunday:</span>
                    <span className="font-semibold text-slate-800">
                      {businessInfo.businessHours.sunday}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Active Service & Doorstep Measurement Coverage:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {businessInfo.serviceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Map Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
            <div className="relative flex-1 min-h-[380px] w-full bg-slate-100">
              {/* Embedded Google Maps with Exact Coordinates */}
              <iframe
                title="Rajeshwar Steel Industries Exact Coordinates Location"
                src={`https://maps.google.com/maps?q=${businessInfo.coordinates.lat},${businessInfo.coordinates.lng}&hl=en&z=16&output=embed`}
                className="w-full h-full min-h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Floating Location Badge */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg max-w-xs pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  <span className="text-xs font-bold font-heading text-slate-900 truncate">
                    {businessInfo.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Near Ruchi Hotel, Sobhagya Nagar Industrial Area, Semra Road, Bhopal
                </p>
              </div>
            </div>

            {/* Bottom Bar below map */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Exact Coords:</span>
                <span className="font-mono text-slate-800">
                  {businessInfo.coordinates.lat}, {businessInfo.coordinates.lng}
                </span>
              </div>
              <a
                href={`tel:${getCleanPhone(businessInfo.phonePrimary)}`}
                className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Before Visiting: {businessInfo.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
