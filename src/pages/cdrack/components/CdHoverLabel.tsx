import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCdStore } from '../../../store/useCdStore';
import SlidingTitle from './SlidingTitle';

const tips = [
  "👆 클릭하면 음악 페이지로 이동!",
  "▶️ 지금 바로 들어보기 🎶",
  "🎧 좋아하는 곡을 플레이해보세요",
  "✨ 한 번 들어보면 빠져듭니다!",
  "🎵 음악이 당신을 기다리고 있어요",
  "🚀 클릭해서 사운드 여행 시작하기",
  "🎼 궁금하다면 지금 확인해보세요",
  "🕺 리듬에 몸을 맡겨볼까요?",
];
export default function CdHoverLabel() {
  const [randomTip, setRandomTip] = useState('');
  const hoveredCd = useCdStore((set) => set.hoveredCd);

  useEffect(() => {
    if (hoveredCd) {
      setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
    } else {
      setRandomTip('');
    }
  }, [hoveredCd]);

  return (
    <AnimatePresence>
      {hoveredCd && (
        <>
          {/* 카드 */}
          <motion.div
            key={hoveredCd.myCdId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='absolute bottom-14 right-6 w-74 bg-white/80
            text-[#142b4b] p-4 rounded-xl shadow-lg flex gap-4 items-center'>
            <div className='flex items-center gap-5'>
              {/* 앨범 커버 썸네일 */}
              <img
                src={hoveredCd.coverUrl}
                alt={hoveredCd.title}
                className='w-20 h-20 object-cover rounded-md shadow-md'
              />

              {/* 앨범 정보 */}
              <div className='flex flex-col overflow-hidden'>
                <span className='text-sm opacity-70 mb-1'>
                  {hoveredCd.artist} | {hoveredCd.releaseDate?.split('-')[0]}
                </span>

                <SlidingTitle
                  text={hoveredCd.title}
                  width={200}
                />

                {hoveredCd.genres && hoveredCd.genres.length > 0 && (
                  <ul className='flex flex-wrap gap-2 mt-1'>
                    {hoveredCd.genres.slice(0, 2).map((genre, i) => (
                      <li
                        key={i}
                        className='px-2.5 py-0.5 rounded-md bg-[#1d4188] backdrop-blur-sm text-xs text-white'>
                        {genre.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
          <motion.span
            key={`${hoveredCd.myCdId}-tip`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='absolute bottom-6 right-8 text-sm text-white drop-shadow-lg'>
            {randomTip}
          </motion.span>
        </>
      )}
    </AnimatePresence>
  );
}
