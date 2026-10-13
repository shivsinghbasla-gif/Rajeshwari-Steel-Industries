/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  BusinessInfo,
  ServiceItem,
  ProductItem,
  GalleryItem,
  CalculatorRates,
  FaqItem,
  Testimonial,
  WhyChooseUsItem,
  AdminNotificationSettings,
} from './types.ts';
import {
  getBusinessInfo,
  getServices,
  getProducts,
  getGallery,
  getCalculatorRates,
  getFaqs,
  getTestimonials,
  getWhyChooseUs,
  getNotificationSettings,
  isAdminLoggedIn,
} from './services/storage.ts';

// UI Components
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductsSection } from './components/ProductsSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { DesignInspirationSection } from './components/DesignInspirationSection.tsx';
import { CustomDesignUploadSection } from './components/CustomDesignUploadSection.tsx';
import { SmartCalculatorSection } from './components/SmartCalculatorSection.tsx';
import { WhyChooseUsSection } from './components/WhyChooseUsSection.tsx';
import { AboutOwnerSection } from './components/AboutOwnerSection.tsx';
import { GoogleReviewsSection } from './components/GoogleReviewsSection.tsx';
import { LocationSection } from './components/LocationSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { StickyMobileCta } from './components/StickyMobileCta.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { ToastContainer, ToastMessage } from './components/ui/Toast.tsx';

export default function App() {
  // Website State
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(getBusinessInfo());
  const [services, setServices] = useState<ServiceItem[]>(getServices());
  const [products, setProducts] = useState<ProductItem[]>(getProducts());
  const [gallery, setGallery] = useState<GalleryItem[]>(getGallery());
  const [calculatorRates, setCalculatorRates] = useState<CalculatorRates>(getCalculatorRates());
  const [faqs, setFaqs] = useState<FaqItem[]>(getFaqs());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getTestimonials());
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>(getWhyChooseUs());
  const [notificationSettings, setNotificationSettings] = useState<AdminNotificationSettings>(getNotificationSettings());

  // Navigation & Modals State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteInitialRequirement, setQuoteInitialRequirement] = useState<string | undefined>();
  const [quoteInitialCalcDetails, setQuoteInitialCalcDetails] = useState<any>();

  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title,
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload all data from storage
  const refreshAllData = useCallback(() => {
    setBusinessInfo(getBusinessInfo());
    setServices(getServices());
    setProducts(getProducts());
    setGallery(getGallery());
    setCalculatorRates(getCalculatorRates());
    setFaqs(getFaqs());
    setTestimonials(getTestimonials());
    setWhyChooseUs(getWhyChooseUs());
    setNotificationSettings(getNotificationSettings());
    setIsAdmin(isAdminLoggedIn());
  }, []);

  // Listen to storage events & auth events
  useEffect(() => {
    const handleStorageChange = () => {
      refreshAllData();
    };

    const handleAuthChange = () => {
      setIsAdmin(isAdminLoggedIn());
    };

    window.addEventListener('rsi_storage_change', handleStorageChange);
    window.addEventListener('rsi_admin_auth_changed', handleAuthChange);

    return () => {
      window.removeEventListener('rsi_storage_change', handleStorageChange);
      window.removeEventListener('rsi_admin_auth_changed', handleAuthChange);
    };
  }, [refreshAllData]);

  // Smooth Navigation Handler
  const handleNavigateSection = (sectionId: string) => {
    if (isAdminDashboardOpen) {
      setIsAdminDashboardOpen(false);
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open Quote Modal with specific context
  const handleOpenQuoteModal = (initialReq?: string) => {
    setQuoteInitialRequirement(initialReq);
    setQuoteInitialCalcDetails(undefined);
    setIsQuoteModalOpen(true);
  };

  // Open Quote Modal prefilled from Calculator
  const handleOpenQuoteWithCalc = (calcSummary: any) => {
    setQuoteInitialRequirement('Quotation Request from Calculator');
    setQuoteInitialCalcDetails(calcSummary);
    setIsQuoteModalOpen(true);
  };

  // Trigger from Design Inspiration card
  const handleSelectDesignInspiration = (designTitle: string) => {
    handleOpenQuoteModal(`Design Selected: ${designTitle}`);
  };

  // Handle lead submission callback
  const handleLeadSubmitted = (name: string) => {
    showToast(
      'Inquiry Submitted Successfully!',
      `Thank you ${name}. Mukesh Choudhary will contact you shortly.`,
      'success'
    );
  };

  // Admin access click
  const handleAdminClick = () => {
    if (isAdminLoggedIn()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* If Admin Dashboard is active, render full Admin UI */}
      {isAdminDashboardOpen && isAdmin ? (
        <AdminDashboard
          businessInfo={businessInfo}
          services={services}
          products={products}
          gallery={gallery}
          calculatorRates={calculatorRates}
          faqs={faqs}
          testimonials={testimonials}
          notificationSettings={notificationSettings}
          onRefreshAllData={refreshAllData}
          onExitAdmin={() => setIsAdminDashboardOpen(false)}
          onShowToast={showToast}
        />
      ) : (
        /* Public Facing Website */
        <>
          <Navbar
            businessInfo={businessInfo}
            onOpenQuoteModal={handleOpenQuoteModal}
            onOpenAdminModal={handleAdminClick}
            isAdmin={isAdmin}
            onNavigateSection={handleNavigateSection}
          />

          <main className="flex-1">
            {/* 1. Hero Section */}
            <Hero
              businessInfo={businessInfo}
              onOpenQuoteModal={handleOpenQuoteModal}
              onNavigateSection={handleNavigateSection}
            />

            {/* 2. Official 11 Fabrication Categories Product Catalogue */}
            <ProductsSection
              products={products}
              businessInfo={businessInfo}
              onOpenQuoteModal={handleOpenQuoteModal}
            />

            {/* 4. Project Gallery (50+ photos) */}
            <GallerySection
              gallery={gallery}
              businessInfo={businessInfo}
              onOpenQuoteModal={handleOpenQuoteModal}
            />

            {/* 5. Design Inspiration */}
            <DesignInspirationSection
              onSelectDesign={handleSelectDesignInspiration}
            />

            {/* 6. Have a Design in Mind? Custom Design Upload */}
            <CustomDesignUploadSection
              businessInfo={businessInfo}
              onLeadSubmitted={handleLeadSubmitted}
            />

            {/* 7. Smart Price + GST Calculator */}
            <SmartCalculatorSection
              rates={calculatorRates}
              businessInfo={businessInfo}
              onRequestQuoteWithCalc={handleOpenQuoteWithCalc}
            />

            {/* 8. Why Choose Us */}
            <WhyChooseUsSection
              items={whyChooseUs}
              businessInfo={businessInfo}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
            />

            {/* 9. About Proprietor & Workshop */}
            <AboutOwnerSection
              businessInfo={businessInfo}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
            />

            {/* 10. Verified Reviews */}
            <GoogleReviewsSection
              testimonials={testimonials}
              businessInfo={businessInfo}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
            />

            {/* 11. Location & Interactive Google Maps */}
            <LocationSection
              businessInfo={businessInfo}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
            />

            {/* 12. Expandable FAQs */}
            <FaqSection
              faqs={faqs}
              businessInfo={businessInfo}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
            />
          </main>

          {/* Footer */}
          <Footer
            businessInfo={businessInfo}
            onOpenQuoteModal={handleOpenQuoteModal}
            onOpenAdminModal={handleAdminClick}
            onNavigateSection={handleNavigateSection}
          />

          {/* Sticky Mobile Action Bar */}
          <StickyMobileCta
            businessInfo={businessInfo}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
            isAdminView={isAdminDashboardOpen}
          />
        </>
      )}

      {/* Get Free Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        initialRequirement={quoteInitialRequirement}
        initialCalculatedDetails={quoteInitialCalcDetails}
        businessInfo={businessInfo}
        onClose={() => setIsQuoteModalOpen(false)}
        onLeadSubmitted={handleLeadSubmitted}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginModalOpen(false);
          setIsAdmin(true);
          setIsAdminDashboardOpen(true);
          showToast('Welcome, Administrator', 'Logged into Rajeshwar Steel Industries Admin', 'success');
        }}
      />

      {/* Floating Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
