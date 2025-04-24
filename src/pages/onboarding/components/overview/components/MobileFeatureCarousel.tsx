import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import OverviewImageSlide from './OverviewImageSlide';
import FeatureCards from '../../FeatureCards';

interface MobileFeatureCarouselProps {
  features: Feature[];
  onSlideChange: (index: number) => void;
}

const MobileFeatureCarousel = ({
  features,
  onSlideChange,
}: MobileFeatureCarouselProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      speed={800}
      onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
      className='w-full h-full overview-swiper'
      spaceBetween={30}>
      {features.map((feature, index) => (
        <SwiperSlide
          key={feature.id}
          className='overview-slide'>
          <OverviewImageSlide currentIndex={index} />
          <div className='flex flex-col items-center absolute -bottom-20 left-10 z-2'>
            <FeatureCards
              className='text-[#08275F] w-auto min-w-[130px] max-w-[420px] sm:max-w-[280px] sm:p-6 md:max-w-[340px] md:p-8 lg:max-w-[400px] mt-8 overview-card max-sm:p-4 max-sm:rounded-2xl max-sm:w-[260px]'
              title={feature.title}
              description={feature.description}
              titleClassName='max-sm:text-xl text-3xl sm:text-xl md:text-2xl lg:text-3xl text-center break-keep'
              descriptionClassName='max-sm:text-xs text-xl sm:text-base md:text-lg lg:text-xl text-center break-keep'
              withAnimation
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MobileFeatureCarousel;
