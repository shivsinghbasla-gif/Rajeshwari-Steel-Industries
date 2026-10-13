import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  LayoutDashboard,
  Building,
  Briefcase,
  Package,
  Image as ImageIcon,
  Calculator,
  HelpCircle,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit,
  Phone,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Upload,
  Download,
  RotateCcw,
  ExternalLink,
  Save,
  LogOut,
  X,
  Eye,
  EyeOff,
  Bell,
} from 'lucide-react';
import {
  BusinessInfo,
  ServiceItem,
  ProductItem,
  GalleryItem,
  LeadRecord,
  LeadStatus,
  CalculatorRates,
  FaqItem,
  Testimonial,
  AdminNotificationSettings,
  MAIN_11_PRODUCT_CATEGORIES,
  GradePrice,
} from '../../types.ts';
import {
  getLeads,
  saveLeads,
  updateLeadStatus,
  deleteLead,
  saveBusinessInfo,
  saveServices,
  saveProducts,
  saveGallery,
  saveCalculatorRates,
  saveFaqs,
  saveTestimonials,
  saveNotificationSettings,
  exportAllData,
  importAllData,
  resetAllDataToDefault,
  setAdminLoggedIn,
} from '../../services/storage.ts';
import {
  getCleanPhone,
  generateWhatsAppLink,
  formatINR,
  processImageFile,
  getGoogleMapsUrl,
} from '../../utils/helpers.ts';
import { ConfirmModal } from '../ui/ConfirmModal.tsx';
import { ImageUploadField } from '../ui/ImageUploadField.tsx';
import { MultiImageUploadField } from '../ui/MultiImageUploadField.tsx';

interface AdminDashboardProps {
  businessInfo: BusinessInfo;
  services: ServiceItem[];
  products: ProductItem[];
  gallery: GalleryItem[];
  calculatorRates: CalculatorRates;
  faqs: FaqItem[];
  testimonials: Testimonial[];
  notificationSettings: AdminNotificationSettings;
  onRefreshAllData: () => void;
  onExitAdmin: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

type AdminTab =
  | 'leads'
  | 'business'
  | 'services'
  | 'products'
  | 'gallery'
  | 'calculator'
  | 'faqs'
  | 'testimonials'
  | 'system';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businessInfo: initialBusinessInfo,
  services: initialServices,
  products: initialProducts,
  gallery: initialGallery,
  calculatorRates: initialRates,
  faqs: initialFaqs,
  testimonials: initialTestimonials,
  notificationSettings: initialNotifications,
  onRefreshAllData,
  onExitAdmin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('leads');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  
  // Local editable copies
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialBusinessInfo);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [rates, setRates] = useState<CalculatorRates>(initialRates);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [notifications, setNotifications] = useState<AdminNotificationSettings>(initialNotifications);

  // Leads Filter & Search
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>('');
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<LeadRecord | null>(null);

  // Gallery Filter
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('All');
  const [gallerySearchQuery, setGallerySearchQuery] = useState<string>('');

  // Products Category Filter
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');

  // Modals & Confirmation States
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Edit / Add Item States
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isAddingGalleryItem, setIsAddingGalleryItem] = useState(false);
  const [isBulkAddingGallery, setIsBulkAddingGallery] = useState(false);

  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // Load leads on mount & listen for real-time lead events
  useEffect(() => {
    setLeads(getLeads());

    const handleStorageChange = () => {
      setLeads(getLeads());
    };

    const handleNewLead = (e: any) => {
      setLeads(getLeads());
      onShowToast('New Lead Received!', `${e.detail.name} submitted an enquiry`, 'info');
    };

    window.addEventListener('rsi_storage_change', handleStorageChange);
    window.addEventListener('rsi_new_lead', handleNewLead);

    return () => {
      window.removeEventListener('rsi_storage_change', handleStorageChange);
      window.removeEventListener('rsi_new_lead', handleNewLead);
    };
  }, []);

  // Update local states when props change
  useEffect(() => {
    setBusinessInfo(initialBusinessInfo);
    setServices(initialServices);
    setProducts(initialProducts);
    setGallery(initialGallery);
    setRates(initialRates);
    setFaqs(initialFaqs);
    setTestimonials(initialTestimonials);
    setNotifications(initialNotifications);
  }, [
    initialBusinessInfo,
    initialServices,
    initialProducts,
    initialGallery,
    initialRates,
    initialFaqs,
    initialTestimonials,
    initialNotifications,
  ]);

  // Lead metrics calculations (100% REAL stored database data)
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const contactedLeadsCount = leads.filter((l) => l.status === 'Contacted').length;
  const quotationSentCount = leads.filter((l) => l.status === 'Quotation Sent').length;
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;
  const lostCount = leads.filter((l) => l.status === 'Lost').length;

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = leadStatusFilter === 'All' || lead.status === leadStatusFilter;
    const matchesSearch =
      leadSearchQuery === '' ||
      lead.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.phone.includes(leadSearchQuery) ||
      lead.requirement.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      (lead.location ? lead.location.toLowerCase().includes(leadSearchQuery.toLowerCase()) : false);
    return matchesStatus && matchesSearch;
  });

  // Status Updater
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    updateLeadStatus(leadId, newStatus);
    const updated = getLeads();
    setLeads(updated);
    if (selectedLeadForDetail && selectedLeadForDetail.id === leadId) {
      setSelectedLeadForDetail({ ...selectedLeadForDetail, status: newStatus });
    }
    onShowToast('Status Updated', `Lead moved to ${newStatus}`, 'success');
  };

  // Lead Deletion
  const handleDeleteLead = (leadId: string, leadName: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Delete Customer Lead',
      message: `Are you sure you want to permanently delete the lead from "${leadName}"? This action cannot be reversed.`,
      onConfirm: () => {
        deleteLead(leadId);
        setLeads(getLeads());
        setSelectedLeadForDetail(null);
        setConfirmModalState({ ...confirmModalState, isOpen: false });
        onShowToast('Lead Deleted', 'The lead has been removed', 'info');
      },
    });
  };

  // Save Business Info
  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveBusinessInfo(businessInfo);
    onRefreshAllData();
    onShowToast('Business Profile Saved', 'Updated details are now live on the public site', 'success');
  };

  // Save Calculator Rates
  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    saveCalculatorRates(rates);
    onRefreshAllData();
    onShowToast('Calculator Rates Saved', 'New rates and GST percentage are live', 'success');
  };

  // Save Notification Settings
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    saveNotificationSettings(notifications);
    onRefreshAllData();
    onShowToast('Alert Settings Saved', 'Notification parameters updated', 'success');
  };

  // Logout
  const handleLogout = () => {
    setAdminLoggedIn(false);
    onExitAdmin();
  };

  // Export Data JSON
  const handleExportData = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rajeshwar-steel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Backup Exported', 'Database downloaded as JSON', 'success');
  };

  // Import Data JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      if (success) {
        onRefreshAllData();
        setLeads(getLeads());
        onShowToast('Backup Restored', 'All data successfully loaded from backup', 'success');
      } else {
        onShowToast('Import Failed', 'Invalid JSON backup file structure', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Reset to seed defaults
  const handleResetToDefaults = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Reset All Data to Factory Defaults',
      message: 'This will reset all business details, services, products, and gallery items back to the verified seed data. Are you sure?',
      onConfirm: () => {
        resetAllDataToDefault();
        onRefreshAllData();
        setLeads(getLeads());
        setConfirmModalState({ ...confirmModalState, isOpen: false });
        onShowToast('Factory Reset Complete', 'All data restored to verified initial state', 'info');
      },
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 font-bold font-heading flex items-center justify-center text-base">
              RSI
            </div>
            <div>
              <div className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>{businessInfo.name || "Rajeshwar Steel Industries"}</span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5 flex items-center gap-1">
                <span className="text-slate-600 font-medium">Owner:</span>
                <span className="text-blue-600 font-bold">{businessInfo.proprietor || "Mukesh Choudhary"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Sub-Navigation Bar */}
      <div className="bg-stone-900/60 border-b border-stone-800 px-4 sm:px-8 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-2">
          {[
            { id: 'leads', label: `Leads & CRM (${newLeadsCount} New)`, icon: Users },
            { id: 'business', label: 'Business Profile', icon: Building },
            { id: 'services', label: `Services (${services.length})`, icon: Briefcase },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon },
            { id: 'calculator', label: 'Estimator Rates & GST', icon: Calculator },
            { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
            { id: 'testimonials', label: `Reviews (${testimonials.length})`, icon: Star },
            { id: 'system', label: 'Backup & Alerts', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* ========================================================= */}
        {/* TAB 1: LEADS & CRM                                        */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Real Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Total Leads
                </span>
                <div className="text-2xl font-extrabold font-heading text-white mt-1">
                  {totalLeadsCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-amber-500/40 bg-amber-500/5">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                  New (Unattended)
                </span>
                <div className="text-2xl font-extrabold font-heading text-amber-400 mt-1">
                  {newLeadsCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-blue-500/40 bg-blue-500/5">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                  Contacted
                </span>
                <div className="text-2xl font-extrabold font-heading text-blue-400 mt-1">
                  {contactedLeadsCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-purple-500/40 bg-purple-500/5">
                <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                  Quote Sent
                </span>
                <div className="text-2xl font-extrabold font-heading text-purple-400 mt-1">
                  {quotationSentCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-emerald-500/40 bg-emerald-500/5">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                  Converted
                </span>
                <div className="text-2xl font-extrabold font-heading text-emerald-400 mt-1">
                  {convertedCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Lost / Closed
                </span>
                <div className="text-2xl font-extrabold font-heading text-stone-400 mt-1">
                  {lostCount}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-stone-900 border border-stone-800">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['All', 'New', 'Contacted', 'Quotation Sent', 'Converted', 'Lost'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      leadStatusFilter === st
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, location..."
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Leads Table or Cards */}
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-stone-900 border border-stone-800">
                <Users className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h4 className="font-heading font-bold text-base text-white">No Leads Found</h4>
                <p className="text-xs text-stone-400 mt-1">
                  {leads.length === 0
                    ? 'No leads recorded yet. Submissions from the website quote form, calculator, or custom design upload will appear here in real time.'
                    : 'No leads matched the current filter or search criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredLeads.map((lead) => {
                  const leadPhoneClean = getCleanPhone(lead.phone);
                  const leadWaLink = generateWhatsAppLink(
                    lead.whatsapp || lead.phone,
                    `Hello ${lead.name}, this is Mukesh Choudhary from Rajeshwar Steel Industries, Bhopal. We received your requirement for "${lead.requirement}". Would you like us to schedule a site measurement?`
                  );

                  const statusColors: Record<LeadStatus, string> = {
                    New: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    Contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    'Quotation Sent': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    Converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    Lost: 'bg-stone-800 text-stone-400 border-stone-700',
                  };

                  return (
                    <div
                      key={lead.id}
                      className="p-4 sm:p-5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {lead.referenceImage ? (
                          <img
                            src={lead.referenceImage}
                            alt="Reference"
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-700 cursor-pointer"
                            onClick={() => setSelectedLeadForDetail(lead)}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-500 shrink-0 font-bold font-heading">
                            {lead.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-heading font-bold text-base text-white truncate">
                              {lead.name}
                            </h4>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                statusColors[lead.status]
                              }`}
                            >
                              {lead.status}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {lead.date} · {lead.time}
                            </span>
                          </div>

                          <div className="text-xs text-stone-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span>
                              Req: <strong className="text-amber-400">{lead.requirement}</strong>
                            </span>
                            <span>Loc: <strong>{lead.location}</strong></span>
                            {lead.material && <span>Mat: <strong>{lead.material}</strong></span>}
                            {lead.approxArea && <span>Dim: <strong>{lead.approxArea}</strong></span>}
                            {lead.estimatedAmount && (
                              <span className="text-emerald-400 font-mono font-semibold">
                                Est: {formatINR(lead.estimatedAmount)}
                              </span>
                            )}
                          </div>

                          {lead.message && (
                            <p className="text-xs text-stone-400 mt-1.5 italic line-clamp-1">
                              "{lead.message}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Lead Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-800">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)
                          }
                          className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quotation Sent">Quotation Sent</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>

                        <a
                          href={`tel:${leadPhoneClean}`}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white"
                          title={`Call ${lead.name}`}
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                        </a>

                        <a
                          href={leadWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white"
                          title={`WhatsApp ${lead.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lead Detail Modal */}
        {selectedLeadForDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-heading text-lg">
                  {selectedLeadForDetail.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {selectedLeadForDetail.name}
                  </h3>
                  <span className="text-xs text-stone-400">
                    Lead Source: {selectedLeadForDetail.source} · {selectedLeadForDetail.date}
                  </span>
                </div>
              </div>

              {/* Status Select */}
              <div className="mb-6 p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-semibold">Lead Status:</span>
                <select
                  value={selectedLeadForDetail.status}
                  onChange={(e) =>
                    handleUpdateLeadStatus(
                      selectedLeadForDetail.id,
                      e.target.value as LeadStatus
                    )
                  }
                  className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Specs Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-300 border-t border-stone-800 pt-4">
                <div className="flex justify-between py-1 border-b border-stone-800/40">
                  <span className="text-stone-400">Phone:</span>
                  <a
                    href={`tel:${getCleanPhone(selectedLeadForDetail.phone)}`}
                    className="font-mono font-semibold text-amber-400 underline"
                  >
                    {selectedLeadForDetail.phone}
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/40">
                  <span className="text-stone-400">WhatsApp:</span>
                  <span className="font-mono">{selectedLeadForDetail.whatsapp || selectedLeadForDetail.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/40">
                  <span className="text-stone-400">Site Location:</span>
                  <span className="font-semibold text-white">{selectedLeadForDetail.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/40">
                  <span className="text-stone-400">Requirement:</span>
                  <span className="font-semibold text-white">{selectedLeadForDetail.requirement}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/40">
                  <span className="text-stone-400">Material Grade:</span>
                  <span>{selectedLeadForDetail.material || 'Standard SS 304'}</span>
                </div>
                {selectedLeadForDetail.approxArea && (
                  <div className="flex justify-between py-1 border-b border-stone-800/40">
                    <span className="text-stone-400">Dimensions / Sizing:</span>
                    <span className="font-mono">{selectedLeadForDetail.approxArea}</span>
                  </div>
                )}
                {selectedLeadForDetail.estimatedAmount && (
                  <div className="flex justify-between py-1 border-b border-stone-800/40">
                    <span className="text-stone-400">Calculated Estimate:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {formatINR(selectedLeadForDetail.estimatedAmount)}
                    </span>
                  </div>
                )}
                {selectedLeadForDetail.message && (
                  <div className="py-2 border-b border-stone-800/40">
                    <span className="text-stone-400 block mb-1">Customer Notes:</span>
                    <p className="text-stone-200 bg-stone-950 p-2.5 rounded-lg">
                      {selectedLeadForDetail.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Uploaded Reference Photo View */}
              {selectedLeadForDetail.referenceImage && (
                <div className="mt-4 pt-4 border-t border-stone-800">
                  <span className="text-xs font-semibold text-stone-300 block mb-2">
                    Customer Uploaded Reference Photo:
                  </span>
                  <div className="rounded-xl overflow-hidden border border-stone-700 bg-black max-h-64 flex items-center justify-center">
                    <img
                      src={selectedLeadForDetail.referenceImage}
                      alt="Customer Reference"
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${getCleanPhone(selectedLeadForDetail.phone)}`}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>

                <a
                  href={generateWhatsAppLink(
                    selectedLeadForDetail.whatsapp || selectedLeadForDetail.phone,
                    `Hello ${selectedLeadForDetail.name}, this is Mukesh Choudhary from Rajeshwar Steel Industries regarding your requirement for "${selectedLeadForDetail.requirement}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reply on WhatsApp</span>
                </a>

                <button
                  onClick={() =>
                    handleDeleteLead(
                      selectedLeadForDetail.id,
                      selectedLeadForDetail.name
                    )
                  }
                  className="p-2.5 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white"
                  title="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BUSINESS PROFILE & MAPS                            */}
        {/* ========================================================= */}
        {activeTab === 'business' && (
          <form onSubmit={handleSaveBusinessInfo} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Business Profile & Public Information
                </h3>
                <p className="text-xs text-stone-400">
                  Update owner details, address, coordinates, hours, and social media URLs.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            {/* Business Logo Upload */}
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-3">
              <div>
                <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                  Official Shop Logo
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Upload, change, or remove the shop logo. Displayed on the website header, footer, and inquiry forms.
                </p>
              </div>
              <ImageUploadField
                label="Shop Logo Image"
                value={businessInfo.logoUrl || ''}
                onChange={(logoUri) =>
                  setBusinessInfo({ ...businessInfo, logoUrl: logoUri })
                }
                recommendedSizeText="Upload from phone gallery or files (PNG with transparent background or JPEG)"
                entityId="shop_logo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-900 p-6 rounded-2xl border border-stone-800">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Publicly Listed Proprietor
                </label>
                <input
                  type="text"
                  required
                  value={businessInfo.proprietor}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, proprietor: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Primary Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={businessInfo.phonePrimary}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phonePrimary: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Alternate Public Contact
                </label>
                <input
                  type="text"
                  value={businessInfo.phoneSecondary}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phoneSecondary: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Publicly Listed GSTIN
                </label>
                <input
                  type="text"
                  value={businessInfo.gstin}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Address & GPS Section */}
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Workshop Location & GPS Coordinates
              </h4>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Full Workshop Address
                </label>
                <textarea
                  rows={2}
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Landmark
                </label>
                <input
                  type="text"
                  value={businessInfo.landmark}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, landmark: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={businessInfo.coordinates.lat}
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        coordinates: {
                          ...businessInfo.coordinates,
                          lat: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={businessInfo.coordinates.lng}
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        coordinates: {
                          ...businessInfo.coordinates,
                          lng: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={getGoogleMapsUrl(
                    businessInfo.coordinates.lat,
                    businessInfo.coordinates.lng
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Current Coordinates in Google Maps ({businessInfo.coordinates.lat}, {businessInfo.coordinates.lng})</span>
                </a>
              </div>
            </div>

            {/* Business Hours & Social URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-900 p-6 rounded-2xl border border-stone-800">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Weekday Hours (Monday – Saturday)
                </label>
                <input
                  type="text"
                  value={businessInfo.businessHours.weekday}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      businessHours: {
                        ...businessInfo.businessHours,
                        weekday: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Sunday Hours
                </label>
                <input
                  type="text"
                  value={businessInfo.businessHours.sunday}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      businessHours: {
                        ...businessInfo.businessHours,
                        sunday: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Instagram Profile URL (Optional - Leave blank to hide)
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/rajeshwarsteel"
                  value={businessInfo.instagramUrl}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, instagramUrl: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  YouTube Channel URL (Optional - Leave blank to hide)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@rajeshwarsteel"
                  value={businessInfo.youtubeUrl}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, youtubeUrl: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Hero Background Image URL (Editable)
                </label>
                <input
                  type="text"
                  value={businessInfo.heroImage}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, heroImage: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SERVICES CMS                                       */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Manage Fabrication Services
                </h3>
                <p className="text-xs text-stone-400">
                  Add, edit, replace image, change categories or delete services.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    id: `srv-${Date.now()}`,
                    title: '',
                    category: 'Railings',
                    description: '',
                    image: '',
                    features: ['Custom Dimensions', 'Verified SS 304/316', 'On-Site Installation'],
                    order: services.length + 1,
                  });
                  setIsAddingService(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv, index) => (
                <div
                  key={srv.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 bg-stone-950 relative">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold text-amber-400 bg-stone-950/80 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="font-heading font-bold text-base text-white">
                        {srv.title}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
                        {srv.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-stone-800 flex items-center justify-between bg-stone-950/40">
                    <span className="text-[11px] text-stone-500">Order #{index + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setIsAddingService(false);
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setConfirmModalState({
                            isOpen: true,
                            title: 'Delete Service',
                            message: `Are you sure you want to delete "${srv.title}"?`,
                            onConfirm: () => {
                              const updated = services.filter((s) => s.id !== srv.id);
                              saveServices(updated);
                              setServices(updated);
                              onRefreshAllData();
                              setConfirmModalState({ ...confirmModalState, isOpen: false });
                              onShowToast('Service Deleted', '', 'info');
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add Service Modal */}
            {editingService && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
                role="dialog"
                aria-modal="true"
              >
                <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setEditingService(null)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-bold font-heading text-white mb-4">
                    {isAddingService ? 'Add Fabrication Service' : 'Edit Service'}
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editingService.image || !editingService.image.trim()) {
                        onShowToast('Image Required', 'Please upload an image for this service before saving.', 'error');
                        return;
                      }
                      let updated: ServiceItem[];
                      if (isAddingService) {
                        updated = [...services, editingService];
                      } else {
                        updated = services.map((s) =>
                          s.id === editingService.id ? editingService : s
                        );
                      }
                      saveServices(updated);
                      setServices(updated);
                      onRefreshAllData();
                      setEditingService(null);
                      onShowToast(
                        isAddingService ? 'Service Added Successfully' : 'Service Saved Successfully',
                        `"${editingService.title}" is saved with image`,
                        'success'
                      );
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.category}
                        onChange={(e) =>
                          setEditingService({ ...editingService, category: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    {/* Image Upload from Device Gallery with Preview, Change & Remove */}
                    <ImageUploadField
                      value={editingService.image}
                      onChange={(imageUri) =>
                        setEditingService({ ...editingService, image: imageUri })
                      }
                      label="Service Photo"
                      recommendedSizeText="Upload from phone gallery (e.g., Balcony Railing, Compound Gate, Shed)"
                      entityId={editingService.id}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({ ...editingService, description: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm cursor-pointer"
                    >
                      Save Service
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PRODUCTS CMS                                       */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Manage Product Catalog ({products.length} Products)
                </h3>
                <p className="text-xs text-stone-400">
                  Manage products under the 11 official categories with multi-photo uploads, grade prices, and visibility.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    title: '',
                    category: MAIN_11_PRODUCT_CATEGORIES[0],
                    description: '',
                    material: 'SS 304 / SS 202',
                    design: 'Custom Blueprint Design',
                    measurements: 'Standard site measurements',
                    rateRange: '₹350 – ₹450 / Running Ft',
                    priceUnit: 'Per running foot',
                    gradePrices: [
                      { grade: 'Grade 202', price: '₹350', unit: 'per running foot' },
                      { grade: 'Grade 304', price: '₹450', unit: 'per running foot' },
                    ],
                    image: '',
                    images: [],
                    features: ['Argon TIG seamless welding', 'Corrosion resistant', 'Heavy anchor base'],
                    isVisible: true,
                  });
                  setIsAddingProduct(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* 11 Main Product Categories Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 no-scrollbar">
              <button
                onClick={() => setProductCategoryFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  productCategoryFilter === 'All'
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                All Categories ({products.length})
              </button>
              {MAIN_11_PRODUCT_CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      productCategoryFilter === cat
                        ? 'bg-amber-500 text-stone-950 font-bold shadow'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Products Grid */}
            {(() => {
              const displayed = products.filter(
                (p) => productCategoryFilter === 'All' || p.category === productCategoryFilter
              );

              if (displayed.length === 0) {
                return (
                  <div className="p-12 text-center bg-stone-900/60 rounded-2xl border border-stone-800">
                    <Package className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                    <p className="text-stone-300 font-semibold text-sm">
                      No products found in "{productCategoryFilter}"
                    </p>
                    <p className="text-stone-500 text-xs mt-1">
                      Click "Add Product" to add a new design under this category.
                    </p>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: `prod-${Date.now()}`,
                          title: '',
                          category: productCategoryFilter === 'All' ? MAIN_11_PRODUCT_CATEGORIES[0] : productCategoryFilter,
                          description: '',
                          material: 'SS 304 / SS 202',
                          design: 'Custom Blueprint Design',
                          measurements: 'Standard site measurements',
                          rateRange: '₹350 – ₹450 / Running Ft',
                          priceUnit: 'Per running foot',
                          gradePrices: [
                            { grade: 'Grade 202', price: '₹350', unit: 'per running foot' },
                            { grade: 'Grade 304', price: '₹450', unit: 'per running foot' },
                          ],
                          image: '',
                          images: [],
                          features: ['Argon TIG seamless welding', 'Corrosion resistant', 'Heavy anchor base'],
                          isVisible: true,
                        });
                        setIsAddingProduct(true);
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                    >
                      + Add Product to this Category
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayed.map((prod) => {
                    const photoCount = prod.images && prod.images.length > 0 ? prod.images.length : (prod.image ? 1 : 0);
                    const isVisible = prod.isVisible !== false;

                    return (
                      <div
                        key={prod.id}
                        className={`bg-stone-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                          isVisible ? 'border-stone-800' : 'border-stone-800/50 opacity-75'
                        }`}
                      >
                        <div>
                          <div className="h-44 bg-stone-950 relative overflow-hidden">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs">
                                No image
                              </div>
                            )}

                            {/* Category badge */}
                            <span className="absolute top-2 left-2 text-[10px] font-semibold text-stone-200 bg-stone-950/90 backdrop-blur px-2 py-0.5 rounded border border-stone-800">
                              {prod.category}
                            </span>

                            {/* Photo count indicator */}
                            {photoCount > 1 && (
                              <span className="absolute top-2 right-2 text-[10px] font-semibold text-amber-400 bg-black/80 px-2 py-0.5 rounded border border-amber-500/40">
                                📷 {photoCount} photos
                              </span>
                            )}

                            {/* Visibility indicator */}
                            <span
                              className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                                isVisible
                                  ? 'bg-emerald-500/90 text-stone-950'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {isVisible ? 'Visible' : 'Hidden'}
                            </span>
                          </div>

                          <div className="p-4">
                            <h4 className="font-heading font-bold text-sm text-white line-clamp-1">
                              {prod.title}
                            </h4>
                            <p className="text-[11px] text-amber-400 font-mono mt-1 font-semibold">
                              {prod.rateRange}
                            </p>
                            {prod.gradePrices && prod.gradePrices.length > 0 && (
                              <div className="mt-1 space-y-0.5 text-[10px] text-stone-400">
                                {prod.gradePrices.slice(0, 2).map((gp, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span className="text-stone-500">{gp.grade}:</span>
                                    <span className="text-stone-300 font-mono">{gp.price} {gp.unit}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-[11px] text-stone-400 mt-2 line-clamp-2">
                              {prod.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 border-t border-stone-800 flex items-center justify-between bg-stone-950/40">
                          {/* Toggle visibility */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = products.map((p) =>
                                p.id === prod.id ? { ...p, isVisible: !isVisible } : p
                              );
                              saveProducts(updated);
                              setProducts(updated);
                              onRefreshAllData();
                              onShowToast(
                                isVisible ? 'Product Hidden' : 'Product Visible',
                                `"${prod.title}" public visibility updated`,
                                'info'
                              );
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                            title={isVisible ? 'Hide from public catalogue' : 'Show on public catalogue'}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-stone-500" />}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct({
                                  ...prod,
                                  images: prod.images || (prod.image ? [prod.image] : []),
                                  isVisible: prod.isVisible !== false,
                                });
                                setIsAddingProduct(false);
                              }}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmModalState({
                                  isOpen: true,
                                  title: 'Delete Product',
                                  message: `Are you sure you want to permanently delete "${prod.title}" from ${prod.category}? This will not affect other products.`,
                                  onConfirm: () => {
                                    const updated = products.filter((p) => p.id !== prod.id);
                                    saveProducts(updated);
                                    setProducts(updated);
                                    onRefreshAllData();
                                    setConfirmModalState({ ...confirmModalState, isOpen: false });
                                    onShowToast('Product Deleted', `Removed "${prod.title}"`, 'info');
                                  },
                                });
                              }}
                              className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Edit / Add Product Modal */}
            {editingProduct && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
                role="dialog"
                aria-modal="true"
              >
                <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-heading text-white">
                      {isAddingProduct ? 'Add Product / Design' : 'Edit Product'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Categorized under the 11 main product categories. Upload multiple photographs and configure grade-specific rates.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      try {
                        if (!editingProduct.image || !editingProduct.image.trim()) {
                          onShowToast('Image Required', 'Please upload at least one photograph for this product.', 'error');
                          return;
                        }
                        let updated: ProductItem[];
                        if (isAddingProduct) {
                          updated = [...products, editingProduct];
                        } else {
                          updated = products.map((p) =>
                            p.id === editingProduct.id ? editingProduct : p
                          );
                        }
                        saveProducts(updated);
                        setProducts(updated);
                        onRefreshAllData();
                        setEditingProduct(null);
                        onShowToast(
                          isAddingProduct ? 'Product Added Successfully' : 'Product Saved Successfully',
                          `"${editingProduct.title}" saved under ${editingProduct.category}`,
                          'success'
                        );
                      } catch (err: any) {
                        console.error('Failed to save product:', err);
                        onShowToast('Save Error', err?.message || 'Could not save product', 'error');
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Round Pipe Balcony Railing with 3 Lines"
                        value={editingProduct.title}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, title: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Strictly the 11 categories */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Product Category * (11 Main Categories)
                        </label>
                        <select
                          required
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, category: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                        >
                          {MAIN_11_PRODUCT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-stone-400 mt-1">
                          Products must belong to one of the 11 official categories.
                        </p>
                      </div>

                      {/* Public Visibility Toggle */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Website Visibility
                        </label>
                        <label className="flex items-center gap-2.5 p-2 bg-stone-950 border border-stone-800 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.isVisible !== false}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                isVisible: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                          />
                          <span className="text-xs text-stone-200 font-medium">
                            {editingProduct.isVisible !== false
                              ? 'Visible on public catalog'
                              : 'Hidden (draft mode)'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Multi-Photo Upload Manager */}
                    <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-2">
                      <MultiImageUploadField
                        images={editingProduct.images || (editingProduct.image ? [editingProduct.image] : [])}
                        mainImage={editingProduct.image || ''}
                        onChange={(newImages, newMain) => {
                          setEditingProduct({
                            ...editingProduct,
                            images: newImages,
                            image: newMain,
                          });
                        }}
                        label="Product Photographs (Gallery & Multi-Angle Photos)"
                        recommendedSizeText="Upload from phone gallery or camera. Select primary cover photo, reorder, or delete."
                        entityId={editingProduct.id}
                      />
                    </div>

                    {/* Pricing Management */}
                    <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                            Price & Rate Management
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            Support pricing per running foot, per sq.ft, per kg, fixed price, or custom quotation.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Pricing Unit *
                          </label>
                          <select
                            value={editingProduct.priceUnit || 'Per running foot'}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                priceUnit: e.target.value,
                              })
                            }
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                          >
                            <option value="Per running foot">Per running foot (Railings)</option>
                            <option value="Per square foot">Per square foot (Gates, Grills, Laser Panels)</option>
                            <option value="Per kilogram">Per kilogram (Fabrication, Heavy Structures)</option>
                            <option value="Fixed price">Fixed price (Jhula, Beds, Pillars)</option>
                            <option value="Custom quotation">Custom quotation (Turnkey Projects)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Catalog Display Rate Range
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., ₹350 – ₹450 / Running Ft"
                            value={editingProduct.rateRange}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, rateRange: e.target.value })
                            }
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                          />
                        </div>
                      </div>

                      {/* Grade-specific prices */}
                      <div className="pt-2 border-t border-stone-800/80">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-semibold text-stone-300">
                            Steel Grade & Specification Rates (e.g. Grade 202 vs Grade 304)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const existing = editingProduct.gradePrices || [];
                              setEditingProduct({
                                ...editingProduct,
                                gradePrices: [
                                  ...existing,
                                  { grade: 'Grade 304', price: '₹450', unit: editingProduct.priceUnit || 'per running foot' },
                                ],
                              });
                            }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                          >
                            + Add Grade Rate
                          </button>
                        </div>

                        {editingProduct.gradePrices && editingProduct.gradePrices.length > 0 ? (
                          <div className="space-y-2">
                            {editingProduct.gradePrices.map((gp, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Grade (e.g. Grade 202, Grade 304, 12mm Glass)"
                                  value={gp.grade}
                                  onChange={(e) => {
                                    const updated = [...(editingProduct.gradePrices || [])];
                                    updated[idx].grade = e.target.value;
                                    setEditingProduct({ ...editingProduct, gradePrices: updated });
                                  }}
                                  className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Rate (e.g. ₹350)"
                                  value={gp.price}
                                  onChange={(e) => {
                                    const updated = [...(editingProduct.gradePrices || [])];
                                    updated[idx].price = e.target.value;
                                    setEditingProduct({ ...editingProduct, gradePrices: updated });
                                  }}
                                  className="w-24 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono"
                                />
                                <input
                                  type="text"
                                  placeholder="Unit (e.g. per running foot)"
                                  value={gp.unit || ''}
                                  onChange={(e) => {
                                    const updated = [...(editingProduct.gradePrices || [])];
                                    updated[idx].unit = e.target.value;
                                    setEditingProduct({ ...editingProduct, gradePrices: updated });
                                  }}
                                  className="w-32 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (editingProduct.gradePrices || []).filter((_, i) => i !== idx);
                                    setEditingProduct({ ...editingProduct, gradePrices: updated });
                                  }}
                                  className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10"
                                  title="Remove this grade price"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-stone-500 italic">
                            No specific grade pricing rows added. Click "+ Add Grade Rate" above.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Material & Steel Grade
                        </label>
                        <input
                          type="text"
                          placeholder="SS 304 / SS 202 / Heavy MS"
                          value={editingProduct.material}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, material: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Surface Finish
                        </label>
                        <input
                          type="text"
                          placeholder="Mirror Polish / Satin Hairline / Golden PVD"
                          value={editingProduct.finish || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, finish: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Design Details
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 50mm Handrail with 3 Intermediate Pipes"
                          value={editingProduct.design}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, design: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Measurements / Sizing
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Height 36&quot; to 42&quot;, custom lengths"
                          value={editingProduct.measurements}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, measurements: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detailed description of fabrication quality, welding standards, application areas, and customer options..."
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm cursor-pointer shadow-lg"
                    >
                      {isAddingProduct ? 'Save & Publish Product' : 'Save Product Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: GALLERY CMS (50+ Items)                            */}
        {/* ========================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Project Gallery Manager ({gallery.length} Photos)
                </h3>
                <p className="text-xs text-stone-400">
                  Supports 50+ photos. Add, edit metadata, replace photo without recreating, or delete with confirmation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingGalleryItem({
                      id: `gal-${Date.now()}`,
                      title: 'Custom Steel Project',
                      category: 'Gates',
                      description: 'Fabricated and installed in Bhopal.',
                      material: 'SS 304 Grade',
                      measurements: 'Custom Size',
                      location: 'Bhopal, MP',
                      priceApprox: '₹35,000 (Estimate)',
                      image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
                      featured: false,
                      order: gallery.length + 1,
                    });
                    setIsAddingGalleryItem(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  'All',
                  'Gates',
                  'Railings',
                  'Staircases',
                  'Balconies',
                  'Grills',
                  'Furniture',
                  'Racks',
                  'Custom Fabrication',
                  'Workshop',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      galleryCategoryFilter === cat
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter gallery..."
                  value={gallerySearchQuery}
                  onChange={(e) => setGallerySearchQuery(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Gallery Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery
                .filter((item) => {
                  const matchCat =
                    galleryCategoryFilter === 'All' || item.category === galleryCategoryFilter;
                  const matchSearch =
                    gallerySearchQuery === '' ||
                    item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
                    item.location.toLowerCase().includes(gallerySearchQuery.toLowerCase());
                  return matchCat && matchSearch;
                })
                .map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 bg-black">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] bg-stone-950/80 px-2 py-0.5 rounded text-amber-400">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-3.5">
                        <h4 className="font-heading font-bold text-xs text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="text-[11px] text-stone-400 mt-1 truncate">
                          {item.location} · {item.material}
                        </div>
                        <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                          {item.priceApprox}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 border-t border-stone-800 flex items-center justify-between bg-stone-950/40">
                      <span className="text-[10px] text-stone-500">#{idx + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingGalleryItem(item);
                            setIsAddingGalleryItem(false);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                          title="Edit Details / Replace Photo"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setConfirmModalState({
                              isOpen: true,
                              title: 'Delete Photo',
                              message: `Are you sure you want to delete this photo "${item.title}"?`,
                              onConfirm: () => {
                                const updated = gallery.filter((g) => g.id !== item.id);
                                saveGallery(updated);
                                setGallery(updated);
                                onRefreshAllData();
                                setConfirmModalState({ ...confirmModalState, isOpen: false });
                                onShowToast('Photo Deleted', '', 'info');
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Replace / Add Gallery Item Modal */}
            {editingGalleryItem && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
                role="dialog"
                aria-modal="true"
              >
                <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setEditingGalleryItem(null)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-bold font-heading text-white mb-4">
                    {isAddingGalleryItem ? 'Add Gallery Photo' : 'Edit / Replace Photo'}
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      let updated: GalleryItem[];
                      if (isAddingGalleryItem) {
                        updated = [editingGalleryItem, ...gallery];
                      } else {
                        updated = gallery.map((g) =>
                          g.id === editingGalleryItem.id ? editingGalleryItem : g
                        );
                      }
                      saveGallery(updated);
                      setGallery(updated);
                      onRefreshAllData();
                      setEditingGalleryItem(null);
                      onShowToast('Gallery Photo Saved', '', 'success');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Photo Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingGalleryItem.title}
                        onChange={(e) =>
                          setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Category
                        </label>
                        <select
                          value={editingGalleryItem.category}
                          onChange={(e) =>
                            setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        >
                          <option value="Gates">Gates</option>
                          <option value="Railings">Railings</option>
                          <option value="Staircases">Staircases</option>
                          <option value="Balconies">Balconies</option>
                          <option value="Grills">Grills</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Racks">Racks</option>
                          <option value="Custom Fabrication">Custom Fabrication</option>
                          <option value="Workshop">Workshop</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Site Location in Bhopal
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.location}
                          onChange={(e) =>
                            setEditingGalleryItem({ ...editingGalleryItem, location: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Material
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.material}
                          onChange={(e) =>
                            setEditingGalleryItem({ ...editingGalleryItem, material: e.target.value })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Approx Price (Labeled Estimate)
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.priceApprox}
                          onChange={(e) =>
                            setEditingGalleryItem({
                              ...editingGalleryItem,
                              priceApprox: e.target.value,
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>
                    </div>

                    {/* Project Photo Upload with Preview, Change & Remove */}
                    <ImageUploadField
                      value={editingGalleryItem.image}
                      onChange={(imageUri) =>
                        setEditingGalleryItem({ ...editingGalleryItem, image: imageUri })
                      }
                      label="Project Photo"
                      recommendedSizeText="Upload real work photo from phone gallery (Gates, Railings, Stairs, Furniture, Racks)"
                      entityId={editingGalleryItem.id}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingGalleryItem.description}
                        onChange={(e) =>
                          setEditingGalleryItem({
                            ...editingGalleryItem,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm cursor-pointer"
                    >
                      Save Gallery Photo
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CALCULATOR RATES & GST                             */}
        {/* ========================================================= */}
        {activeTab === 'calculator' && (
          <form onSubmit={handleSaveRates} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Calculator Rates & GST Configuration
                </h3>
                <p className="text-xs text-stone-400">
                  Configure base rates per unit, labour charges, installation, transport, and official GST percentage.
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Rate Matrix</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-stone-900 p-6 rounded-2xl border border-stone-800">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Base Rate / Sq.Ft (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.perSqFt}
                  onChange={(e) => setRates({ ...rates, perSqFt: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Base Rate / Sq.Meter (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.perSqM}
                  onChange={(e) => setRates({ ...rates, perSqM: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Base Rate / Running Ft (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.runningFt}
                  onChange={(e) => setRates({ ...rates, runningFt: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Base Rate / Running Meter (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.runningM}
                  onChange={(e) => setRates({ ...rates, runningM: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Labour Rate / Sq.Ft (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.labourPerSqFt}
                  onChange={(e) =>
                    setRates({ ...rates, labourPerSqFt: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Installation Rate / Sq.Ft (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.installPerSqFt}
                  onChange={(e) =>
                    setRates({ ...rates, installPerSqFt: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Default Bhopal Delivery (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rates.transportDefault}
                  onChange={(e) =>
                    setRates({ ...rates, transportDefault: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                <label className="block text-xs font-bold text-amber-400 mb-1.5">
                  GST Rate Percentage (%)
                </label>
                <input
                  type="number"
                  required
                  value={rates.gstRatePercent}
                  onChange={(e) =>
                    setRates({ ...rates, gstRatePercent: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-stone-950 border border-amber-500/50 rounded-lg px-3.5 py-2 text-sm text-amber-400 font-mono font-bold"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Never hardcoded. Editable anytime.
                </span>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 7: FAQS CMS                                           */}
        {/* ========================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Manage FAQ Questions & Answers
                </h3>
                <p className="text-xs text-stone-400">
                  Update customer answers regarding site measurements, fabrication, and payments.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({
                    id: `faq-${Date.now()}`,
                    question: '',
                    answer: '',
                    category: 'Fabrication',
                  });
                  setIsAddingFaq(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-white">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {faq.answer}
                    </p>
                    <span className="text-[10px] text-amber-400 bg-stone-950 px-2 py-0.5 rounded mt-2 inline-block border border-stone-800">
                      {faq.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsAddingFaq(false);
                      }}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmModalState({
                          isOpen: true,
                          title: 'Delete FAQ',
                          message: 'Are you sure you want to delete this FAQ item?',
                          onConfirm: () => {
                            const updated = faqs.filter((f) => f.id !== faq.id);
                            saveFaqs(updated);
                            setFaqs(updated);
                            onRefreshAllData();
                            setConfirmModalState({ ...confirmModalState, isOpen: false });
                            onShowToast('FAQ Deleted', '', 'info');
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add FAQ Modal */}
            {editingFaq && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
                role="dialog"
                aria-modal="true"
              >
                <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold font-heading text-white mb-4">
                    {isAddingFaq ? 'Add New FAQ' : 'Edit FAQ'}
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      let updated: FaqItem[];
                      if (isAddingFaq) {
                        updated = [...faqs, editingFaq];
                      } else {
                        updated = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
                      }
                      saveFaqs(updated);
                      setFaqs(updated);
                      onRefreshAllData();
                      setEditingFaq(null);
                      onShowToast('FAQ Saved', '', 'success');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Question *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingFaq.question}
                        onChange={(e) =>
                          setEditingFaq({ ...editingFaq, question: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editingFaq.category}
                        onChange={(e) =>
                          setEditingFaq({ ...editingFaq, category: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Answer *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editingFaq.answer}
                        onChange={(e) =>
                          setEditingFaq({ ...editingFaq, answer: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm cursor-pointer"
                    >
                      Save FAQ
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: TESTIMONIALS CMS                                   */}
        {/* ========================================================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Customer Reviews & Testimonials
                </h3>
                <p className="text-xs text-stone-400">
                  Manage verified customer testimonials from Bhopal projects.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTestimonial({
                    id: `test-${Date.now()}`,
                    author: '',
                    location: 'Bhopal',
                    rating: 5,
                    reviewText: '',
                    projectType: 'SS Balcony Railing',
                    date: 'March 2026',
                  });
                  setIsAddingTestimonial(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="p-5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading font-bold text-sm text-white">
                        {test.author}
                      </h4>
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-300 italic">
                      "{test.reviewText}"
                    </p>
                    <div className="text-[11px] text-stone-400 mt-2">
                      {test.location} · {test.projectType}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">{test.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingTestimonial(test);
                          setIsAddingTestimonial(false);
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmModalState({
                            isOpen: true,
                            title: 'Delete Review',
                            message: `Are you sure you want to delete review from "${test.author}"?`,
                            onConfirm: () => {
                              const updated = testimonials.filter((t) => t.id !== test.id);
                              saveTestimonials(updated);
                              setTestimonials(updated);
                              onRefreshAllData();
                              setConfirmModalState({ ...confirmModalState, isOpen: false });
                              onShowToast('Review Deleted', '', 'info');
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add Testimonial Modal */}
            {editingTestimonial && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
                role="dialog"
                aria-modal="true"
              >
                <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
                  <button
                    onClick={() => setEditingTestimonial(null)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold font-heading text-white mb-4">
                    {isAddingTestimonial ? 'Add Review' : 'Edit Review'}
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      let updated: Testimonial[];
                      if (isAddingTestimonial) {
                        updated = [...testimonials, editingTestimonial];
                      } else {
                        updated = testimonials.map((t) =>
                          t.id === editingTestimonial.id ? editingTestimonial : t
                        );
                      }
                      saveTestimonials(updated);
                      setTestimonials(updated);
                      onRefreshAllData();
                      setEditingTestimonial(null);
                      onShowToast('Review Saved', '', 'success');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingTestimonial.author}
                        onChange={(e) =>
                          setEditingTestimonial({ ...editingTestimonial, author: e.target.value })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.location}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              location: e.target.value,
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Rating (1 to 5)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={editingTestimonial.rating}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              rating: parseInt(e.target.value, 10) || 5,
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Project Done
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.projectType}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            projectType: e.target.value,
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Review Text *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingTestimonial.reviewText}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            reviewText: e.target.value,
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm cursor-pointer"
                    >
                      Save Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: NOTIFICATIONS & BACKUP / RESTORE                   */}
        {/* ========================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-stone-800">
              <h3 className="text-xl font-bold font-heading text-white">
                Alert Settings, Backup & Disaster Recovery
              </h3>
              <p className="text-xs text-stone-400">
                Configure owner WhatsApp alerts, export full website JSON backups, or restore data.
              </p>
            </div>

            {/* Notification Settings */}
            <form onSubmit={handleSaveNotifications} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Lead Notification Routing
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    WhatsApp Alert Number
                  </label>
                  <input
                    type="text"
                    value={notifications.whatsappAlertNumber}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        whatsappAlertNumber: e.target.value,
                      })
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Mobile number configured to receive instant lead details via WhatsApp.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Alert Email Address
                  </label>
                  <input
                    type="email"
                    value={notifications.alertEmail}
                    onChange={(e) =>
                      setNotifications({ ...notifications, alertEmail: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Configurable owner email address for lead notifications.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
              >
                Save Notification Settings
              </button>
            </form>

            {/* Data Export / Import Card */}
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Full Database Export & Import
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Download a complete JSON snapshot of all leads, business settings, 50+ gallery photos, calculator rates, and testimonials. You can restore this file at any time.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Backup File (.json)</span>
                </button>

                <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore from Backup (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors ml-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Factory Seeds</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
      />
    </div>
  );
};
