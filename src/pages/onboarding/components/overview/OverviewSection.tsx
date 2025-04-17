import { useState } from 'react';
import PreviewTitle from './components/PreviewTitle';
import OverviewImageSlide from './components/OverviewImageSlide';
import FeatureIndex from './components/FeatureIndex';
import FeatureCards from '../FeatureCards';

const features = [
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
    title: '나만의 독서 기록, 특별한 순간',
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
    tag: '친구 추천',
    title: '취향이 통하는 메이트 찾기',
    description:
      '기록이 쌓이면 루미가 비슷한 취향을 가진 친구들을 추천해요!\n서로의 공간에서 특별한 교감을 나눌 수 있어요',
  },
];

// OverviewSection.tsx
const OverviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className='bg-gradient-to-b from-[#F4F8FF] from-0% to-[#D3E1FC] to-100% py-22'>
      <PreviewTitle />
      <div className='relative w-full max-w-[1100px] mx-auto'>
        {' '}
        {/* 컨테이너 추가 */}
        <OverviewImageSlide currentIndex={currentIndex} />
        {/* 우측 태그 */}
        <FeatureIndex
          features={features.map((f) => f.tag)}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />
        {/* 설명 카드 */}
        <div className='absolute bottom-8 left-0 z-2 -translate-x-1/4 translate-y-1/4'>
          <FeatureCards
            className='text-[#08275F] w-[30vw]'
            title={features[currentIndex].title}
            description={features[currentIndex].description}
          />
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
