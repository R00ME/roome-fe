import { useState, useEffect } from 'react';
import PreviewTitle from './components/PreviewTitle';
import MobileFeatureCarousel from './components/MobileFeatureCarousel';
import DesktopFeatureShowcase from './components/DesktopFeatureShowcase';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@styles/OverviewSection.css';

const features: Feature[] = [
  {
    id: 1,
    tag: '테마 설정',
    title: '다양한 테마, 새로운 느낌!',
    description:
      '기본 테마 외에도 두 가지의 테마가 더 준비되어 있어요\n다양한 활동과 이벤트로 모은 포인트로 테마를 구입할 수 있어요',
  },
  {
    id: 2,
    tag: '도서 기록',
    title: '나만의 기록, 특별한 순간',
    description:
      '읽은 책에 대한 감상과 생각을 자유롭게 기록해보세요\n나의 취향을 담은 독서 일기가 쌓여갑니다',
  },
  {
    id: 3,
    tag: '음악 기록',
    title: '감성을 채우는 플레이리스트',
    description:
      '지금 이 순간의 감정을 음악으로 표현해보세요\n나만의 음악 취향으로 공간을 더욱 특별하게 만들 수 있어요',
  },
  {
    id: 4,
    tag: '룸 프리뷰',
    title: '나와 친구들의 공간 둘러보기',
    description:
      '메인 페이지에서 나의 공간과 팔로우한 친구들의 공간을 한눈에 볼 수 있어요!\n서로의 일상을 공유하며 더 가까워질 수 있어요',
  },
];

const OverviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className='bg-gradient-to-b from-[#F4F8FF] from-0% to-[#D3E1FC] to-100% py-22'>
      <PreviewTitle />
      <div className='relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8'>
        {!isWideScreen ? (
          <MobileFeatureCarousel
            features={features}
            onSlideChange={setCurrentIndex}
          />
        ) : (
          <DesktopFeatureShowcase
            features={features}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
          />
        )}
      </div>
    </section>
  );
};

export default OverviewSection;
