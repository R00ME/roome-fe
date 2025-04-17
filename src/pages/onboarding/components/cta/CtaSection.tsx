import React from 'react'
import SectionTitle from '../SectionTitle'
import CtaButton from '../CtaButton'
import ctaBackground from '@/assets/onboarding/cta-background.png'

const CtaSection = () => {
  return (
    <div className='w-full h-[577px] py-16 relative flex flex-col items-center justify-center'>
      <img src={ctaBackground} alt='' className='absolute top-0 left-0 w-auto h-[577px] aspect-[1920/577] object-cover z-[-1]' />
      <SectionTitle
        lowerTitle='이제, 당신의 방을 만들어볼 차례예요'
        lowerTitleClassName='text-4xl'
        description='소셜 로그인으로 간편하게 RoomE를 이용해보세요!'
      />
      <CtaButton />
    </div>
  )
}

export default CtaSection