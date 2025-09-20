import addCheck from '@assets/room/addFurniture-icon.svg';
import lock from '@assets/room/lock.png';
import point from '@assets/room/point.png';
import { themeData } from '@constants/roomTheme';

export default function ThemeSettingCard({
  theme,
  isSelected,
  isLocked,
  onClick,
}: ThemeSettingCardProps) {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-2xl rounded-2xl border-2 border-[#FCF7FD]
    drop-shadow-modal flex items-center justify-center
    p-1.5 transition-all duration-300 ease-in-out
    w-full max-w-[252px] min-w-[190px]
    h-auto md:h-68 lg:h-74
    ${
      isSelected
        ? 'scale-100 opacity-100 bg-[#FCF7FD]/20'
        : isLocked
        ? 'scale-90 hover:scale-98 hover:opacity-90 cursor-pointer bg-[#D8E5FF]/50'
        : 'scale-90 opacity-70 hover:scale-98 hover:opacity-90 bg-[#FCF7FD]/20'
    }
    w-full md:w-[200px] lg:w-[220px] 
  `}>
      {/* 잠김 스타일 */}
      {isLocked && (
        <div
          className={`absolute z-10 flex md:flex-col items-center justify-center gap-2 md:gap-4 w-full h-full backdrop-blur-lg rounded-lg drop-shadow-modal p-2 md:p-3
            transition-all duration-300 ease-in-out
          `}>
          <img
            src={lock}
            className='drop-shadow-logo w-6 md:w-8'
          />
          <div className='flex flex-row items-center gap-1 bg-white/30 rounded-full px-2 py-1'>
            <img
              src={point}
              className='w-3 md:w-4'
            />
            <p className='font-medium text-xs md:text-sm text-[#162C63]'>
              400P
            </p>
          </div>
        </div>
      )}
      {/* 테마 컨텐츠 */}
      <div
        className={`
          relative w-full rounded-xl bg-[#FCF7FD]
          transition-transform duration-300
          flex flex-row md:flex-col items-center justify-between
          p-4 md:p-6
          h-auto md:h-64 lg:h-70
          `}>
        {isSelected && (
          <img
            className='absolute -top-2 right-2 w-5 md:w-6 lg:w-7 '
            src={addCheck}
            alt='선택 하기'
          />
        )}
        {/* 이미지 썸네일 */}
        <img
          className='hidden md:block w-24 md:w-32 lg:w-36 mb-3'
          src={themeData[theme].thumbnail}
          alt={themeData[theme].title}
        />
        {/* 테마 소개 */}
        <div
          className='flex flex-col md:items-center md:text-center gap-1
            flex-1'>
          <h2 className='font-bold text-xs sm:text-base lg:text-lg text-[#162C63]'>
            {themeData[theme].title}
          </h2>
          <p className='font-medium text-[10px] sm:text-sm lg:text-base text-[#3E507D]/70'>
            {themeData[theme].description}
          </p>
        </div>
      </div>
    </div>
  );
}
