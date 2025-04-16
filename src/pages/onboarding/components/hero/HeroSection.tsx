import heroBackground from '@/assets/onboarding/page-background-image.png';
import SectionTitle from '../SectionTitle';
import CtaButton from '../CtaButton';
import HeroImage from './HeroImage';
import flowerIcon from '@/assets/onboarding/flower-icon.png';
import bookIcon from '@/assets/onboarding/book-icon.png';
import musicIcon from '@/assets/onboarding/music-icon.png';
import FloatingIcon from './FloatingIcon';
import FeatureCards from './FeatureCards';

const HeroSection = () => {
  return (
    <section
      className='w-full flex flex-col gap-10 bg-cover bg-center bg-no-repeat aspect-[1920/2160] p-20'
      style={{ backgroundImage: `url(${heroBackground})` }}>
      <SectionTitle
        upperTitle='나만의 디지털 공간을'
        lowerTitle='채워가는 새로운 경험'
        description='책과 음악으로 채워지는 나만의 공간, 나의 감성과 우리를 기록해요'
      />
      <CtaButton />

      <div className='relative'>
        <HeroImage />
        <FloatingIcon
          src={flowerIcon}
          alt='꽃 아이콘'
          position='top-0 right-[15vw] sm:top-0 sm:right-[12vw] md:top-0 md:right-[10vw]'
          size='w-[10vw]'
          delay='0s'
        />
        <FloatingIcon
          src={bookIcon}
          alt='책 아이콘'
          position='top-[15vw] left-[15vw] sm:top-[25vw] sm:left-[6vw] md:top-[20vw] md:left-[10vw]'
          size='w-[9vw]'
          delay='0.3s'
        />
        <FloatingIcon
          src={musicIcon}
          alt='음악 아이콘'
          position='bottom-0 right-[15vw] sm:bottom-[12vw] sm:right-[25vw] md:bottom-[10vw] md:right-[20vw]'
          size='w-[6vw]'
          delay='0.6s'
        />
      </div>

      <SectionTitle
        upperTitle='취향이 통하는'
        lowerTitle='사람들과의 특별한 만남'
        description='내 취향의 책과 음악을 기록하면 취향이 맞는 다른 사용자를 추천해요'
      />

      <div className='flex justify-center gap-4 px-6 max-w-[1100px] mx-auto'>
        <FeatureCards
          title='취향 알고리즘'
          description='나와 취향 키워드가 비슷한 유저를 "취향 알고리즘"을 통해 매칭'
        />
        <FeatureCards
          title='방명록'
          description='서로의 공간에 남기는 진심 어린 메시지로 교감하는 소통 공간'
        />
        <FeatureCards
          title='하우스메이트'
          description='취향이 비슷한 메이트와 함께 만들어가는 특별한 디지털 하우스'
        />
      </div>
    </section>
  );
};

export default HeroSection;
