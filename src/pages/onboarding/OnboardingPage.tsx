import React from 'react';
import Footer from './components/footer/Footer';
import HeroSection from './components/hero/HeroSection';
import CtaSection from './components/cta/CtaSection';
import OverviewSection from './components/overview/OverviewSection';

const OnboardingPage = () => {
  return (
    <div className='jalnan w-full h-screen overflow-y-auto'>
      <HeroSection />
      <OverviewSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default OnboardingPage;
