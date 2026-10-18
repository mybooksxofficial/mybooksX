import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { HeroSection } from './sections/HeroSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { ProductsSection } from './sections/ProductsSection';
import { OffersSection } from './sections/OffersSection';
import { WhyChooseUsSection } from './sections/WhyChooseUsSection';
import { DigitalGrowthSection } from './sections/DigitalGrowthSection';
import { FaqSection } from './sections/FaqSection';
import { CustomSolutionForm } from './sections/CustomSolutionForm';
import { Footer } from './components/Footer';
import { SpinWheelModal } from './components/SpinWheelModal';
import { OjasAiModal } from './components/OjasAiModal';
import { OwnerPanelModal } from './components/OwnerPanelModal';
import { MessageSquareText } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [wheelOpen, setWheelOpen] = useState(false);
  const [ojasOpen, setOjasOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: string } | null>(null);

  // Allow direct access via #owner or #admin URL hash
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#owner' || window.location.hash === '#admin') {
        setOwnerOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleApplyCode = (code: string, discount: string) => {
    setAppliedPromo({ code, discount });
    const targetElement = document.getElementById('custom-solution');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (planTitle: string) => {
    setSelectedPlan(planTitle);
    const targetElement = document.getElementById('custom-solution');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mybooksx-app-container">
      {/* Minimal Navbar with Sidebar toggle */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Spacious Navigation Sidebar Drawer */}
      <SidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenWheel={() => setWheelOpen(true)}
        onOpenOjas={() => setOjasOpen(true)}
        onSelectProduct={handleSelectPlan}
        onOpenOwner={() => setOwnerOpen(true)}
      />

      {/* Clean Hero Section */}
      <HeroSection
        onOpenWheel={() => setWheelOpen(true)}
        onOpenOjas={() => setOjasOpen(true)}
      />

      {/* Client Reviews Section */}
      <ReviewsSection />

      {/* Flagship Products Section with Mobile Accordion Dropdown & Desktop Grid */}
      <ProductsSection onSelectProduct={handleSelectPlan} />

      {/* Custom Software Development Offers & Deals */}
      <OffersSection onSelectPlan={handleSelectPlan} />

      {/* Why Choose Us Panel with Mobile Accordion Dropdown & Desktop Grid */}
      <WhyChooseUsSection />

      {/* Digital Growth Services: Social Media Management & Email Marketing */}
      <DigitalGrowthSection onSelectService={handleSelectPlan} />

      {/* Clean Project Booking Form (No login required for clients) */}
      <CustomSolutionForm
        preselectedService={selectedPlan}
        appliedPromo={appliedPromo}
      />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Luxury Footer with Owner Portal link */}
      <Footer onOpenOwner={() => setOwnerOpen(true)} />

      {/* Lucky Discount Spin Wheel Modal */}
      <SpinWheelModal
        isOpen={wheelOpen}
        onClose={() => setWheelOpen(false)}
        onApplyCode={handleApplyCode}
      />

      {/* Floating Chat with Ojas Button */}
      <button
        type="button"
        className="ojas-floating-trigger"
        onClick={() => setOjasOpen(true)}
        aria-label="Chat with Ojas"
      >
        <div className="floating-avatar-circle">
          <img src="/logo/ojas-ai-logo.svg" alt="Ojas AI" />
        </div>
        <div className="floating-trigger-text">
          <strong>Chat with Ojas <MessageSquareText size={13} className="text-royal" /></strong>
          <span>Try Ojas • Instant AI Help</span>
        </div>
      </button>

      {/* Ojas AI Chatbot Modal */}
      <OjasAiModal
        isOpen={ojasOpen}
        onClose={() => setOjasOpen(false)}
      />

      {/* Owner / Admin Management Panel Modal */}
      <OwnerPanelModal
        isOpen={ownerOpen}
        onClose={() => {
          setOwnerOpen(false);
          if (window.location.hash === '#owner' || window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
