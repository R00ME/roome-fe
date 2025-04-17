import gooroomeIcon from '@/assets/onboarding/goorooome-icon.png';

const PreviewTitle = () => {
  return (
    <div className='flex flex-col items-center justify-center text-[#4983EF] mb-10'>
      <h2 className='text-5xl font-bold flex items-center gap-2'>
        <img
          src={gooroomeIcon}
          alt=''
        />
        overview
      </h2>
      <p className='opacity-80 text-lg'>
        구룸이가 당신을 기다리고 있어요! 구룸이와 함께 RoomE의 기능을
        알아볼까요?
      </p>
    </div>
  );
};

export default PreviewTitle;
