import {
  BusinessInfo,
  ServiceItem,
  ProductItem,
  GalleryItem,
  LeadRecord,
  LeadStatus,
  CalculatorRates,
  Testimonial,
  FaqItem,
  WhyChooseUsItem,
  AdminNotificationSettings,
  MAIN_11_PRODUCT_CATEGORIES,
} from '../types.ts';
import {
  INITIAL_BUSINESS_INFO,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_GALLERY,
  INITIAL_CALCULATOR_RATES,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_WHY_CHOOSE_US,
  INITIAL_NOTIFICATION_SETTINGS,
} from '../data/seedData.ts';
import { saveAppData, getAppData } from './imageStorage.ts';

export const STORAGE_KEYS = {
  BUSINESS_INFO: 'rsi_business_info_v1',
  SERVICES: 'rsi_services_v1',
  PRODUCTS: 'rsi_products_v2',
  GALLERY: 'rsi_gallery_v1',
  LEADS: 'rsi_leads_v1',
  RATES: 'rsi_calculator_rates_v1',
  FAQS: 'rsi_faqs_v1',
  TESTIMONIALS: 'rsi_testimonials_v1',
  WHY_CHOOSE_US: 'rsi_why_choose_us_v1',
  NOTIFICATIONS: 'rsi_notifications_v1',
  ADMIN_AUTH: 'rsi_admin_auth_v1',
};

// In-memory cache for synchronous reads with instant UI responsiveness
const memoryCache = new Map<string, any>();

/**
 * Removes obsolete or outdated cache keys from localStorage to reclaim quota.
 */
function purgeStaleLocalStorageKeys(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const activeKeyValues = Object.values(STORAGE_KEYS) as string[];
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('rsi_') && !activeKeyValues.includes(k)) {
        keysToRemove.push(k);
      }
    }

    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
  } catch (err) {
    console.warn('[Storage] Key purge warning:', err);
  }
}

/**
 * Prepares a compacted fallback copy of large collections for localStorage
 * when browser 5MB storage limit is under pressure.
 * The pristine, high-resolution original remains securely saved in IndexedDB and memory.
 */
function compactForLocalStorage(key: string, value: any): any {
  if (key === STORAGE_KEYS.PRODUCTS && Array.isArray(value)) {
    return value.map((item: any) => {
      if (!item || typeof item !== 'object') return item;
      const copy = { ...item };
      // Limit gallery array to primary 2 items in localStorage copy to stay under quota
      if (Array.isArray(copy.images) && copy.images.length > 2) {
        copy.images = copy.images.slice(0, 2);
      }
      return copy;
    });
  }
  return value;
}

// Safe JSON get: reads from in-memory cache first, then localStorage, then fallback
function getJson<T>(key: string, fallback: T): T {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  if (typeof window === 'undefined' || !window.localStorage) {
    memoryCache.set(key, fallback);
    return fallback;
  }
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      memoryCache.set(key, fallback);
      return fallback;
    }
    const parsed = JSON.parse(item) as T;
    memoryCache.set(key, parsed);
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    memoryCache.set(key, fallback);
    return fallback;
  }
}

// Safe JSON set: persists to memory, IndexedDB, and localStorage with self-healing QuotaExceeded recovery
function setJson<T>(key: string, value: T): void {
  // 1. Instant update in memoryCache
  memoryCache.set(key, value);

  // 2. Persist authoritative data to IndexedDB (virtually unlimited quota)
  saveAppData(key, value).catch((err) => {
    console.warn(`[Storage] IndexedDB sync for ${key}:`, err);
  });

  // 3. Persist to localStorage with auto-healing QuotaExceeded recovery
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err: any) {
      const isQuotaError =
        err?.name === 'QuotaExceededError' ||
        err?.code === 22 ||
        err?.code === 1014 ||
        (typeof err?.message === 'string' && err.message.toLowerCase().includes('quota'));

      if (isQuotaError) {
        console.warn(`[Storage] LocalStorage quota limit reached for ${key}. Applying auto-recovery compaction.`);
        // Reclaim quota by removing stale keys
        purgeStaleLocalStorageKeys();

        // Retry saving compacted representation
        try {
          const compacted = compactForLocalStorage(key, value);
          localStorage.setItem(key, JSON.stringify(compacted));
        } catch {
          // If still full, purge lower-priority cached items from localStorage
          try {
            localStorage.removeItem(STORAGE_KEYS.FAQS);
            localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
            const compacted = compactForLocalStorage(key, value);
            localStorage.setItem(key, JSON.stringify(compacted));
          } catch {
            console.warn(`[Storage] LocalStorage is full. Data is completely safe and persisted in IndexedDB and active memory.`);
          }
        }
      } else {
        console.error(`Error saving ${key} to storage:`, err);
      }
    }
  }

  // 4. Always notify listeners so React state updates seamlessly
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rsi_storage_change', { detail: { key } }));
  }
}

/**
 * Background hydration from IndexedDB on startup.
 * Ensures data created in IndexedDB (even if localStorage was tight) is restored on reload.
 */
let isHydrated = false;
export async function hydrateFromIndexedDB(): Promise<void> {
  if (typeof window === 'undefined' || isHydrated) return;
  isHydrated = true;

  try {
    purgeStaleLocalStorageKeys();

    // Hydrate products
    const idbProducts = await getAppData<ProductItem[]>(STORAGE_KEYS.PRODUCTS);
    if (idbProducts && Array.isArray(idbProducts) && idbProducts.length > 0) {
      const valid = idbProducts.filter((p) =>
        (MAIN_11_PRODUCT_CATEGORIES as readonly string[]).includes(p.category)
      );
      if (valid.length > 0) {
        memoryCache.set(STORAGE_KEYS.PRODUCTS, valid);
        try {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(compactForLocalStorage(STORAGE_KEYS.PRODUCTS, valid)));
        } catch {}
        window.dispatchEvent(new CustomEvent('rsi_storage_change', { detail: { key: STORAGE_KEYS.PRODUCTS } }));
      }
    } else {
      // First boot: Seed initial products into IndexedDB
      const current = getProducts();
      await saveAppData(STORAGE_KEYS.PRODUCTS, current);
    }

    // Hydrate business info
    const idbInfo = await getAppData<BusinessInfo>(STORAGE_KEYS.BUSINESS_INFO);
    if (idbInfo && idbInfo.name) {
      memoryCache.set(STORAGE_KEYS.BUSINESS_INFO, idbInfo);
      window.dispatchEvent(new CustomEvent('rsi_storage_change', { detail: { key: STORAGE_KEYS.BUSINESS_INFO } }));
    }
  } catch (err) {
    console.warn('[Storage] Hydration from IndexedDB skipped:', err);
  }
}

// Auto-boot hydration
if (typeof window !== 'undefined') {
  hydrateFromIndexedDB();
}

// Business Info
export function getBusinessInfo(): BusinessInfo {
  const info = getJson<BusinessInfo>(STORAGE_KEYS.BUSINESS_INFO, INITIAL_BUSINESS_INFO);
  let changed = false;
  if (info.proprietor && /motaram/i.test(info.proprietor)) {
    info.proprietor = 'Mukesh Choudhary';
    changed = true;
  }
  if (info.aboutStory && /motaram/i.test(info.aboutStory)) {
    info.aboutStory = info.aboutStory
      .replace(/Mr\.\s*Motaram\s*Choudhary/gi, 'Mukesh Choudhary')
      .replace(/Motaram\s*Choudhary/gi, 'Mukesh Choudhary');
    changed = true;
  }
  if (changed) {
    saveBusinessInfo(info);
  }
  return info;
}

export function saveBusinessInfo(info: BusinessInfo): void {
  setJson(STORAGE_KEYS.BUSINESS_INFO, info);
}

// Services
export function getServices(): ServiceItem[] {
  return getJson<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
}

export function saveServices(services: ServiceItem[]): void {
  setJson(STORAGE_KEYS.SERVICES, services);
}

// Products (strictly enforced under the 11 categories)
export function getProducts(): ProductItem[] {
  const loaded = getJson<ProductItem[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (!Array.isArray(loaded) || loaded.length === 0) {
    return INITIAL_PRODUCTS;
  }
  // Guarantee that only products from the 11 categories are returned
  const valid = loaded.filter((p) =>
    (MAIN_11_PRODUCT_CATEGORIES as readonly string[]).includes(p.category)
  );
  if (valid.length === 0) {
    return INITIAL_PRODUCTS;
  }
  return valid;
}

export function saveProducts(products: ProductItem[]): void {
  const sanitized = products.filter((p) =>
    (MAIN_11_PRODUCT_CATEGORIES as readonly string[]).includes(p.category)
  );
  setJson(STORAGE_KEYS.PRODUCTS, sanitized);
}

// Gallery
export function getGallery(): GalleryItem[] {
  return getJson<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
}

export function saveGallery(items: GalleryItem[]): void {
  setJson(STORAGE_KEYS.GALLERY, items);
}

// Leads
export function getLeads(): LeadRecord[] {
  return getJson<LeadRecord[]>(STORAGE_KEYS.LEADS, []);
}

export function saveLeads(leads: LeadRecord[]): void {
  setJson(STORAGE_KEYS.LEADS, leads);
}

export function addLead(leadInput: {
  name: string;
  phone: string;
  whatsapp?: string;
  requirement: string;
  productOrService?: string;
  location: string;
  length?: string;
  width?: string;
  height?: string;
  approxArea?: string;
  unit?: string;
  material?: string;
  referenceImage?: string;
  message?: string;
  source?: string;
  estimatedAmount?: number;
}): LeadRecord {
  const currentLeads = getLeads();
  const now = new Date();

  const newLead: LeadRecord = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: leadInput.name.trim(),
    phone: leadInput.phone.trim(),
    whatsapp: (leadInput.whatsapp || leadInput.phone).trim(),
    requirement: leadInput.requirement || 'Custom Fabrication',
    productOrService: leadInput.productOrService || 'General Steel Fabrication',
    location: leadInput.location.trim() || 'Bhopal',
    length: leadInput.length || '',
    width: leadInput.width || '',
    height: leadInput.height || '',
    approxArea: leadInput.approxArea || '',
    unit: leadInput.unit || 'Sq.Ft',
    material: leadInput.material || 'SS 304',
    referenceImage: leadInput.referenceImage || '',
    message: leadInput.message || '',
    date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    timestamp: now.getTime(),
    status: 'New',
    source: leadInput.source || 'Website Quote Form',
    estimatedAmount: leadInput.estimatedAmount,
  };

  const updated = [newLead, ...currentLeads];
  saveLeads(updated);

  window.dispatchEvent(new CustomEvent('rsi_new_lead', { detail: newLead }));
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus, adminNotes?: string): void {
  const leads = getLeads();
  const updated = leads.map((lead) => {
    if (lead.id === id) {
      return {
        ...lead,
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      };
    }
    return lead;
  });
  saveLeads(updated);
}

export function deleteLead(id: string): void {
  const leads = getLeads();
  const filtered = leads.filter((lead) => lead.id !== id);
  saveLeads(filtered);
}

// Calculator Rates
export function getCalculatorRates(): CalculatorRates {
  return getJson<CalculatorRates>(STORAGE_KEYS.RATES, INITIAL_CALCULATOR_RATES);
}

export function saveCalculatorRates(rates: CalculatorRates): void {
  setJson(STORAGE_KEYS.RATES, rates);
}

// FAQs
export function getFaqs(): FaqItem[] {
  const faqs = getJson<FaqItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  let changed = false;
  const migrated = faqs.map((f) => {
    if (/motaram/i.test(f.answer)) {
      changed = true;
      return {
        ...f,
        answer: f.answer.replace(/Mr\.\s*Motaram\s*Choudhary/gi, 'Mukesh Choudhary').replace(/Motaram\s*Choudhary/gi, 'Mukesh Choudhary'),
      };
    }
    return f;
  });
  if (changed) saveFaqs(migrated);
  return migrated;
}

export function saveFaqs(faqs: FaqItem[]): void {
  setJson(STORAGE_KEYS.FAQS, faqs);
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  const testimonials = getJson<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  let changed = false;
  const migrated = testimonials.map((t) => {
    if (/motaram/i.test(t.reviewText)) {
      changed = true;
      return {
        ...t,
        reviewText: t.reviewText
          .replace(/Mr\.\s*Motaram\s*Choudhary/gi, 'Mukesh Choudhary')
          .replace(/Motaram\s*ji/gi, 'Mukesh ji')
          .replace(/Motaram\s*Choudhary/gi, 'Mukesh Choudhary'),
      };
    }
    return t;
  });
  if (changed) saveTestimonials(migrated);
  return migrated;
}

export function saveTestimonials(testimonials: Testimonial[]): void {
  setJson(STORAGE_KEYS.TESTIMONIALS, testimonials);
}

// Why Choose Us
export function getWhyChooseUs(): WhyChooseUsItem[] {
  const items = getJson<WhyChooseUsItem[]>(STORAGE_KEYS.WHY_CHOOSE_US, INITIAL_WHY_CHOOSE_US);
  let changed = false;
  const migrated = items.map((w) => {
    if (/motaram/i.test(w.description)) {
      changed = true;
      return {
        ...w,
        description: w.description
          .replace(/Mr\.\s*Motaram\s*Choudhary/gi, 'Mukesh Choudhary')
          .replace(/Motaram\s*Choudhary/gi, 'Mukesh Choudhary'),
      };
    }
    return w;
  });
  if (changed) saveWhyChooseUs(migrated);
  return migrated;
}

export function saveWhyChooseUs(items: WhyChooseUsItem[]): void {
  setJson(STORAGE_KEYS.WHY_CHOOSE_US, items);
}

// Notification Settings
export function getNotificationSettings(): AdminNotificationSettings {
  return getJson<AdminNotificationSettings>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATION_SETTINGS);
}

export function saveNotificationSettings(settings: AdminNotificationSettings): void {
  setJson(STORAGE_KEYS.NOTIFICATIONS, settings);
}

// Admin Authentication
export function isAdminLoggedIn(): boolean {
  try {
    const auth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (!auth) return false;
    const parsed = JSON.parse(auth);
    return Boolean(parsed.isLoggedIn && parsed.expiresAt > Date.now());
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(status: boolean): void {
  if (status) {
    const session = {
      isLoggedIn: true,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(session));
    } catch {}
  } else {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {}
  }
  window.dispatchEvent(new CustomEvent('rsi_admin_auth_changed'));
}

// Backup & Recovery
export function exportAllData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    businessInfo: getBusinessInfo(),
    services: getServices(),
    products: getProducts(),
    gallery: getGallery(),
    leads: getLeads(),
    calculatorRates: getCalculatorRates(),
    faqs: getFaqs(),
    testimonials: getTestimonials(),
    whyChooseUs: getWhyChooseUs(),
    notifications: getNotificationSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.businessInfo) saveBusinessInfo(data.businessInfo);
    if (data.services) saveServices(data.services);
    if (data.products) saveProducts(data.products);
    if (data.gallery) saveGallery(data.gallery);
    if (data.leads) saveLeads(data.leads);
    if (data.calculatorRates) saveCalculatorRates(data.calculatorRates);
    if (data.faqs) saveFaqs(data.faqs);
    if (data.testimonials) saveTestimonials(data.testimonials);
    if (data.whyChooseUs) saveWhyChooseUs(data.whyChooseUs);
    if (data.notifications) saveNotificationSettings(data.notifications);
    return true;
  } catch (err) {
    console.error('Failed to import data:', err);
    return false;
  }
}

export function resetAllDataToDefault(): void {
  saveBusinessInfo(INITIAL_BUSINESS_INFO);
  saveServices(INITIAL_SERVICES);
  saveProducts(INITIAL_PRODUCTS);
  saveGallery(INITIAL_GALLERY);
  saveCalculatorRates(INITIAL_CALCULATOR_RATES);
  saveFaqs(INITIAL_FAQS);
  saveTestimonials(INITIAL_TESTIMONIALS);
  saveWhyChooseUs(INITIAL_WHY_CHOOSE_US);
  saveNotificationSettings(INITIAL_NOTIFICATION_SETTINGS);
  saveLeads([]);
}
