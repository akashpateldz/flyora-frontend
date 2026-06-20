import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustBadges from '../components/TrustBadges';
import HowItWorks from '../components/HowItWorks';
import WhyChoose from '../components/WhyChoose';
import ChooseRole from '../components/ChooseRole';
import Stats from '../components/Stats';
import CommunityTestimonials from '../components/CommunityTestimonials';
import CTASection from '../components/CTASection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <TrustBadges />
        <HowItWorks />
        <WhyChoose />
        <ChooseRole />
        <Stats />
        <CommunityTestimonials />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
