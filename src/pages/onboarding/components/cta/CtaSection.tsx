import React from 'react';
import SectionTitle from '../SectionTitle';
import CtaButton from '../CtaButton';
import ctaBackground from '@/assets/onboarding/cta-background.png';

const CtaSection = () => {
  return (
    <section className='w-full h-[577px] py-16 relative flex flex-col items-center justify-center'>
      <img
        src={ctaBackground}
        alt=''
        className='absolute top-0 left-0 w-auto h-[577px] aspect-[1920/577] object-cover z-0'
      />
      <div className='relative z-10'>
        <SectionTitle
          lowerTitle='이제, 당신의 방을 만들어볼 차례예요'
          lowerTitleClassName='text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
          description='소셜 로그인으로 간편하게 RoomE를 이용해보세요!'
          descriptionClassName='text-base sm:text-lg md:text-xl lg:text-2xl'
        />
        <CtaButton />
      </div>
    </section>
  );
};

export default CtaSection;
