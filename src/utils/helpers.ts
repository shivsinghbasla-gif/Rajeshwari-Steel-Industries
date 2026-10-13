import { BusinessInfo } from '../types.ts';

/**
 * Checks if the workshop is currently open based on Indian Standard Time (IST, UTC+5:30)
 */
export function getShopOpenStatus(businessInfo: BusinessInfo): {
  isOpen: boolean;
  statusText: string;
  todayHoursText: string;
} {
  // Current time in IST
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 3600000 * 5.5);

  const dayOfWeek = istDate.getDay(); // 0 is Sunday, 1-6 Mon-Sat
  const currentMinutes = istDate.getHours() * 60 + istDate.getMinutes();

  const isSunday = dayOfWeek === 0;
  const todayHours = isSunday ? businessInfo.businessHours.sunday : businessInfo.businessHours.weekday;

  // Typical hours parse (e.g. 10:00 AM to 8:00 PM / 4:00 PM)
  const openMinutes = 10 * 60; // 10:00 AM
  const closeMinutes = isSunday ? 16 * 60 : 20 * 60; // 4:00 PM or 8:00 PM

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return {
    isOpen,
    statusText: isOpen ? 'Open Now' : 'Closed Now',
    todayHoursText: isSunday
      ? `Sunday: ${businessInfo.businessHours.sunday}`
      : `Today: ${businessInfo.businessHours.weekday}`,
  };
}

/**
 * Generates direct Google Maps URL for exact business coordinates
 */
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Generates direct Google Maps Directions URL to exact coordinates
 */
export function getGoogleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Clean phone number for tel: link
 */
export function getCleanPhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Clean phone number for WhatsApp wa.me link
 */
export function getCleanWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Generate pre-filled WhatsApp link
 */
export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleanNum = getCleanWhatsApp(phone);
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats numbers into Indian Rupee style
 */
export function formatINR(val: number | string): string {
  const num = typeof val === 'number' ? val : Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Compress and convert an image file to Base64 Data URL
 */
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1200px to maintain crispness while avoiding huge memory usage
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // High quality web standard JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
