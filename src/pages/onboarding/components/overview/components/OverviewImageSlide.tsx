import preview1 from '@/assets/onboarding/preview-image-1.png';
import preview2 from '@/assets/onboarding/preview-image-2.png';
import preview3 from '@/assets/onboarding/preview-image-3.png';
import preview4 from '@/assets/onboarding/preview-image-4.png';

const previewImages = [preview1, preview2, preview3, preview4];

interface OverviewImageSlideProps {
  currentIndex: number;
}

import { motion, AnimatePresence } from 'framer-motion';

const OverviewImageSlide = ({ currentIndex }: OverviewImageSlideProps) => {
  return (
    <div className='relative aspect-[1093/706] rounded-3xl overflow-hidden z-1'>
      <AnimatePresence mode='wait'>
        <motion.img
          key={currentIndex} // 키가 변경될 때마다 애니메이션 트리거
          src={previewImages[currentIndex]}
          alt='기능 미리보기'
          className='w-full h-full object-contain'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
};

export default OverviewImageSlide;
