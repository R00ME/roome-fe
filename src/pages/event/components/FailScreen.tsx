import gameOver from '@assets/event/game-over.svg';

export default function FailScreen() {
  return (
    <div className='absolute top-54 left-42 flex flex-col items-center gap-4.5 max-sm:top-[22vw] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:gap-[1.5vw]'>
      <div className='flex flex-col items-center'>
        <img
          src={gameOver}
          alt='게임 실패 이미지'
          className='max-sm:w-[25vw] max-sm:h-auto'
        />
      </div>

      <p className='text-white text-center text-[18px] font-semibold max-sm:text-[3vw]'>
        다음 이벤트에 참여해주세요
      </p>
    </div>
  );
}
