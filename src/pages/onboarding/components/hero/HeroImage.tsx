import React from 'react';
import heroImage from '@/assets/onboarding/room-preview.png';
const HeroImage = () => {
  return (
    <img
      src={heroImage}
      alt='hero-image'
      className='w-full aspect-[16/9] object-contain'
    />
  );
};

export default HeroImage;
