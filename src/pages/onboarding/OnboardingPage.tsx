import React from 'react'
import Footer from './components/footer/Footer'
import HeroSection from './components/hero/HeroSection'
import CtaSection from './components/cta/CtaSection'

const OnboardingPage = () => {
  return (
    <div className='jalnan w-full h-screen overflow-y-auto'>
      <HeroSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default OnboardingPage