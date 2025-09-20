import addCheck from '@assets/room/addFurniture-icon.svg';

export default function PreferenceSettingCard({
  title,
  thumbnail,
  maxCount,
  savedCount,
  writtenCount,
  isAdd,
  onClick,
  level,
  genres,
}: PreferenceSettingCardProps) {
  const isMusic = title === '음악';

  return (
    <section
      onClick={onClick}
      className={`prefer-card backdrop-blur-2xl rounded-xl md:rounded-3xl drop-shadow-modal items-center justify-center p-2 border-2
        ${
          isAdd ? 'border-4 border-[#4983EF]' : 'border-2 border-[#FCF7FD]'
        } cursor-pointer relative
    `}>
      {isAdd && (
        <img
          src={addCheck}
          alt=''
          className={`absolute top-[-4px] right-6 w-5 md:w-6 lg:w-7 drop-shadow-logo`}
        />
      )}
      <article
        className={`w-full h-full rounded-lg md:rounded-2xl bg-[#FCF7FD] p-3 flex place-content-center sm:p-6 md:p-8 lg:p-10`}>
        {/* 선택 카드 내용 */}
        <div className='flex flex-row items-center gap-4 md:gap-6 lg:gap-8 xl:gap-9'>
          <img
            src={thumbnail}
            className='hidden md:block w-24 md:w-34 drop-shadow-logo'
            alt={`${title}`}
          />
          <div className='flex flex-col items-start gap-3 md:gap-4'>
            {/* 가구명 & 레벨 */}
            <header>
              <div className='flex flex-row items-baseline gap-2'>
                <p className='font-bold md:text-xl lg:text-2xl text-[#162C63]'>
                  {title}
                </p>
                <p className='font-semibold text-[#3E507D]'>Lv.{level}</p>
              </div>
              <p className='text-[#3E507D]/70 text-[10px] md:text-xs lg:text-sm font-medium'>
                최대 저장 가능한 갯수 {maxCount}개
              </p>
            </header>

            {/* 현황 */}
            <ul className='list-disc text-[#162C63] font-medium text-xs md:text-sm lg:text-base '>
              <li className='ml-3 md:ml-4'>
                {isMusic ? '현재 저장한 음악' : '현재 저장한 도서'}{' '}
                <strong>{savedCount}</strong>
                {isMusic ? '곡' : '권'}
              </li>
              <li className='ml-3 md:ml-4'>
                {isMusic ? '현재 기록한 감상' : '현재 기록한 서평'}{' '}
                <strong>{writtenCount}</strong>개
              </li>
            </ul>

            {/* 취향 키워드 */}
            <div className='hidden lg:flex flex-wrap items-center gap-2 font-medium mt-1 ml-[-5px] text-[10px] md:text-xs min-w-[180px]'>
              {genres.length > 0 ? (
                genres.map((genre) => {
                  const isLongText = genre.length >= 3;
                  return (
                  <span
                  key={genre}
                  className={`px-1.5 py-0.5 bg-[#4E7ACF]/10 rounded-full text-[#4E7ACF] ${
                    isLongText ? 'line-clamp-2 break-words' : ''}`}>
                    {genre}
                  </span>
                )
              })
              ) : (
                <span className='px-3 py-0.5 bg-[#4E7ACF]/10 rounded-full text-[#4E7ACF]'>딱 맞는 취향을 찾는중 ...</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
