import { AnimatePresence, motion } from 'framer-motion';
import { useCdStore } from '../../../store/useCdStore';
import SlidingTitle from './SlidingTitle';

export default function CdHoverLabel() {
  const hoveredCd = useCdStore((set) => set.hoveredCd);

  return (
    <AnimatePresence>
      {hoveredCd && (
        <motion.div
          key={hoveredCd.myCdId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className='absolute bottom-6 right-6 w-72 bg-white/80
          text-[#142b4b] p-4 rounded-xl shadow-lg flex gap-4 items-center'>
          <div
            className='flex items-center gap-3'>
            {/* 앨범 커버 썸네일 */}
            <img
              src={hoveredCd.coverUrl}
              alt={hoveredCd.title}
              className='w-20 h-20 object-cover rounded-md shadow-md'
            />

            {/* 엘범 정보 */}
            <div className='flex flex-col overflow-hidden flex-1'>
              <span className='text-sm opacity-70 mb-1'>
                {hoveredCd.artist} | {hoveredCd.releaseDate?.split('-')[0]}
              </span>

              <SlidingTitle
                text={hoveredCd.title}
                width={200}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
