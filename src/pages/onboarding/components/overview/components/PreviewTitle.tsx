import gooroomeIcon from '@/assets/onboarding/goorooome-icon.png';

const PreviewTitle = () => {
  return (
    <div className='flex flex-col items-center justify-center text-[#4983EF] mb-10 relative z-10'>
      <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold flex items-center gap-2 mb-4'>
        <img
          src={gooroomeIcon}
          alt=''
          className='w-[24px] sm:w-[30px] md:w-[36px] lg:w-[48px] aspect-square object-contain'
        />
        overview
      </h2>
      <p className='opacity-80 text-sm sm:text-base md:text-lg'>
        구룸이가 당신을 기다리고 있어요! 구룸이와 함께 RoomE의 기능을
        알아볼까요?
      </p>
    </div>
  );
};

export default PreviewTitle;
