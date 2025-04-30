import React from 'react';
import heroImage from '@/assets/onboarding/room-preview.png';
const HeroImage = () => {
  return (
    <img
      src={heroImage}
      alt='hero-image'
      className='w-full object-contain max-lg:aspect-square lg:aspect-[16/9] transition-all duration-300'
    />
  );
};

export default HeroImage;
