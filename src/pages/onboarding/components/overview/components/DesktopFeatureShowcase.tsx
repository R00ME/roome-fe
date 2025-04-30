import OverviewImageSlide from './OverviewImageSlide';
import FeatureIndex from './FeatureIndex';
import FeatureCards from '../../FeatureCards';

interface DesktopFeatureShowcaseProps {
  features: Feature[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const DesktopFeatureShowcase = ({
  features,
  currentIndex,
  onIndexChange,
}: DesktopFeatureShowcaseProps) => {
  return (
    <div className='relative w-full max-w-[1100px] mx-auto'>
      <OverviewImageSlide currentIndex={currentIndex} />
      <FeatureIndex
        features={features.map((f) => f.tag)}
        currentIndex={currentIndex}
        onIndexChange={onIndexChange}
      />
      <div className='absolute bottom-8 left-0 z-2'>
        <FeatureCards
          key={currentIndex}
          className='text-[#08275F] w-auto min-w-[130px] max-w-[420px] sm:max-w-[280px] sm:px-8 py-6 md:max-w-[340px] md:p-8 lg:max-w-[400px] transform lg:-translate-x-1/8 lg:translate-y-1/4 md:translate-y-1/5 md:translate-x-1/8 item-middle sm:translate-x-1/10 sm:translate-y-1/2 max-sm:translate-x-1/10 max-sm:translate-y-1/2 max-sm:w-[260px] max-sm:px-4 max-sm:rounded-2xl'
          titleClassName='text-3xl max-sm:text-lg sm:text-1.5xl md:text-2.5xl lg:text-3.5xl break-keep'
          descriptionClassName='text-xl max-sm:text-xs sm:text-sm md:text-base lg:text-lg break-keep'
          title={features[currentIndex].title}
          description={features[currentIndex].description}
          withAnimation
        />
      </div>
    </div>
  );
};

export default DesktopFeatureShowcase;
