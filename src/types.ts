export type LeadStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Converted' | 'Lost';

export interface BusinessInfo {
  name: string;
  proprietor: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  address: string;
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  gstin: string;
  logoUrl?: string;
  instagramUrl: string;
  youtubeUrl: string;
  serviceAreas: string[];
  businessHours: {
    weekday: string;
    sunday: string;
  };
  heroTagline: string;
  heroSubtitle: string;
  heroImage: string;
  aboutStory: string;
  aboutHighlights: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  order?: number;
}

export const MAIN_11_PRODUCT_CATEGORIES = [
  'Round Pipe Railing',
  'Square Pipe Railing',
  'Premium Railing Design',
  'Glass Railing',
  'Laser Cut Railing Design',
  'Steel Jhula',
  'Steel Gate',
  'Steel Window',
  'Steel Bed',
  'SS Main Pillar',
  'Steel Fabrication',
] as const;

export type MainCategoryName = (typeof MAIN_11_PRODUCT_CATEGORIES)[number];

export interface GradePrice {
  grade: string;
  price: string;
  unit?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  description: string;
  material: string;
  design: string;
  measurements: string;
  rateRange: string;
  image: string;
  images?: string[];
  features: string[];
  featured?: boolean;
  grade?: string;
  finish?: string;
  priceUnit?: 'Per running foot' | 'Per square foot' | 'Per kilogram' | 'Fixed price' | 'Custom quotation' | string;
  gradePrices?: GradePrice[];
  designDetails?: string;
  isVisible?: boolean;
  order?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  material: string;
  measurements: string;
  location: string;
  priceApprox: string;
  image: string;
  featured: boolean;
  order: number;
}

export interface DesignInspiration {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  suitableFor?: string;
  materialRecommendation?: string;
  specs?: string | string[];
  tags?: string[];
}

export interface LeadRecord {
  id: string;
  name: string;
  customerName?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  requirement: string;
  serviceOrProduct?: string;
  productOrService?: string;
  location?: string;
  length?: string;
  width?: string;
  height?: string;
  approxArea?: string;
  unit?: string;
  material?: string;
  estimatedAmount?: number | string;
  message?: string;
  description?: string;
  approxDimensions?: string;
  referenceImage?: string;
  designPhotoUrl?: string;
  addressOrSiteLocation?: string;
  status: LeadStatus;
  source?: string;
  calculatorDetails?: any;
  notes?: string;
  date?: string;
  time?: string;
  timestamp?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalculatorRates {
  perSqFt: number;
  perSqM: number;
  runningFt: number;
  runningM: number;
  labourPerSqFt: number;
  installPerSqFt: number;
  transportDefault: number;
  discountDefault: number;
  gstRatePercent: number;
  materialMultipliers: Record<string, number>;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  reviewText: string;
  projectType: string;
  date: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface AdminNotificationSettings {
  whatsappAlertNumber: string;
  alertEmail: string;
  notifySound: boolean;
}

// Additional legacy / relational models for compatibility
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at?: string;
  product_count?: number;
}

export type StainlessSteelGrade = 'SS 304' | 'SS 202' | 'SS 316' | 'Both SS 304 & SS 202' | 'Custom';

export type ProductFinish =
  | 'Mirror Polish'
  | 'Satin Matte'
  | 'Black Matte'
  | 'Golden PVD'
  | 'Rose Gold'
  | 'Bronze / Brown'
  | 'Custom Powder Coated';

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  grade: StainlessSteelGrade | string;
  finish: ProductFinish | string;
  material: string;
  dimensions?: string;
  customization_details?: string;
  location?: string;
  contact_info?: string;
  featured: boolean;
  is_popular: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at?: string;
}

export interface ProjectImage {
  id: string;
  project_id?: string;
  image_url: string;
  caption?: string;
  is_primary: boolean;
  display_order: number;
}

export interface Project {
  id: string;
  category_id?: string;
  category_name?: string;
  title: string;
  description: string;
  location: string;
  client_name?: string;
  completion_date?: string;
  featured: boolean;
  images: ProjectImage[];
  created_at: string;
  updated_at?: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  address: string;
  logo_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  opening_hours: string;
  google_maps_link: string;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  homepage_headline: string;
  homepage_description: string;
  updated_at?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Discussion' | 'Quotation Sent' | 'Completed' | 'Cancelled';

export interface Enquiry {
  id: string;
  customer_name: string;
  phone_number: string;
  product_service: string;
  description: string;
  preferred_design?: string;
  dimensions?: string;
  status: EnquiryStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  token?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalProjects: number;
  totalEnquiries: number;
  newEnquiriesCount: number;
  recentProducts: Product[];
}
