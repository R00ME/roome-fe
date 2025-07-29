import React from 'react';
import gameSuccess from '@assets/event/game-success.svg';

export default function SuccessScreen({ eventInfo }) {
  return (
    <div className='absolute top-54 left-42 flex flex-col items-center gap-4.5 max-sm:top-[22vw] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:gap-[1.5vw]'>
      <div className='flex flex-col items-center'>
        <img
          src={gameSuccess}
          alt='게임 성공 이미지'
          className='max-sm:w-[25vw] max-sm:h-auto'
        />
      </div>

      <div className='font-semibold max-sm:text-center'>
        <p className='text-white text-center text-[18px] max-sm:text-[3vw]'>
          {`선착순 ${eventInfo?.maxParticipants}명`}
        </p>
        <p className='text-white text-center text-[18px] max-sm:text-[3vw]'>
          {` ${eventInfo?.rewardPoints} 포인트 지급 이벤트`}
        </p>
      </div>
    </div>
  );
}
