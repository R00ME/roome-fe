import cdEmptyPlayer from '@assets/cd/cd-player.png';
import cd from '@assets/cd/cd.png';
import React, { useEffect } from 'react';

export const CdInfo = React.memo(
  ({ cdInfo, cdPlaying }: { cdInfo: CDInfo; cdPlaying: boolean }) => {
    const textLength = cdInfo?.title.length;
    // console.log('cdInfo'); props의 상태가 변할때만 리렌더링

    useEffect(() => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = cdEmptyPlayer;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }, []);
    return (
      <section
        className='order-1 md:order-2 flex flex-col h-full items-center justify-center gap-4 md:gap-6'>
        <article className='text-white flex flex-col gap-1.5 text-center '>
          <span className='2xl:text-2xl  text-xl font-semibold opacity-70'>
            {cdInfo?.artist}
          </span>
          <h1
            className={` ${
              textLength > 14 ? '2xl:text-[30px]' : '2xl:text-[40px]'
            }  text-2xl font-bold `}>
            {cdInfo?.title}
          </h1>
        </article>

        <article className='w-full relative'>
          <div className='relative w-full max-w-full aspect-square mx-auto'>
            <img
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[6] w-[70%] ${
                cdPlaying && 'animate-spin'
              }`}
              src={cdInfo.coverUrl}
              alt='앨범 커버'
              style={{
                WebkitMaskImage: `url(${cd})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'cover',
                maskImage: `url(${cd})`,
                maskRepeat: 'no-repeat',
                maskSize: 'cover',
                animationDuration: '6s',
              }}
            />

            {/* CD 질감 */}
            <img
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[7] w-[70%] pointer-events-none ${
                cdPlaying && 'animate-spin'
              }`}
              src={cd}
              alt='CD 텍스처'
              style={{
                animationDuration: '6s',
                mixBlendMode: 'overlay', // 핵심! multiply/overlay/screen 중 택1
                opacity: 0.9, // 투명도로 강도 조절
              }}
            />
            <img
              className='w-full h-full object-contain'
              src={cdEmptyPlayer}
              alt='빈 cd플레이어 이미지'
              loading='eager'
            />
          </div>
        </article>
      </section>
    );
  },
);

export default CdInfo;
