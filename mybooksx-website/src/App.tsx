import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { HeroSection } from './sections/HeroSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { ProductsSection } from './sections/ProductsSection';
import { OffersSection } from './sections/OffersSection';
import { WhyChooseUsSection } from './sections/WhyChooseUsSection';
import { DigitalGrowthSection } from './sections/DigitalGrowthSection';
import { ProcessSection } from './sections/ProcessSection';
import { FaqSection } from './sections/FaqSection';
import { CustomSolutionForm } from './sections/CustomSolutionForm';
import { Footer } from './components/Footer';
import { SpinWheelModal } from './components/SpinWheelModal';
import { OjasAiModal } from './components/OjasAiModal';
import { MessageSquareText } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [wheelOpen, setWheelOpen] = useState(false);
  const [ojasOpen, setOjasOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: string } | null>(null);

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
      />

      {/* Clean Hero Section without the mock window box */}
      <HeroSection
        onOpenWheel={() => setWheelOpen(true)}
        onOpenOjas={() => setOjasOpen(true)}
      />

      {/* Client Reviews Section: Pankaj Patidar, Nayan Panchal (Custom Android App), Harshit Choudhary */}
      <ReviewsSection />

      {/* Flagship Products Section with Expandable Cards & Yearly/Permanent Slider */}
      <ProductsSection onSelectProduct={handleSelectPlan} />

      {/* Custom Software Development Offers & Deals */}
      <OffersSection onSelectPlan={handleSelectPlan} />

      {/* Why Choose Us Panel */}
      <WhyChooseUsSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Digital Growth Services: Social Media Management & Email Marketing */}
      <DigitalGrowthSection onSelectService={handleSelectPlan} />

      {/* Project Inquiry, Dual WhatsApp/Email Transmission & Final Invoice Page */}
      <CustomSolutionForm
        preselectedService={selectedPlan}
        appliedPromo={appliedPromo}
      />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Luxury Footer in matching Light Warm Linen/Brown Theme */}
      <Footer />

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
