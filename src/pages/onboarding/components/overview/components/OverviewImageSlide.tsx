import preview1 from '@/assets/onboarding/preview-image-1.png';
import preview2 from '@/assets/onboarding/preview-image-2.png';
import preview3 from '@/assets/onboarding/preview-image-3.png';
import preview4 from '@/assets/onboarding/preview-image-4.png';

const previewImages = [preview1, preview2, preview3, preview4];

interface OverviewImageSlideProps {
  currentIndex: number;
}

const OverviewImageSlide = ({ currentIndex }: OverviewImageSlideProps) => {
  return (
    <div className='relative aspect-[1093/706] rounded-3xl overflow-hidden z-1'>
      <img
        src={previewImages[currentIndex]}
        alt='기능 미리보기'
        className='w-full h-full object-cover'
      />
    </div>
  );
};

export default OverviewImageSlide;
