import { twMerge } from 'tailwind-merge';

interface GenreCardProps {
  title: string;
  genres: string[];
  className?: string;
  contentClassName?: string;
  chipClassName?: string;
}

const GenreCard = ({
  title,
  genres,
  className,
  contentClassName,
  chipClassName,
}: GenreCardProps) => {
  return (
    <div
      className={twMerge(
        'item-row gap-2 bg-[#F9F4FB] rounded-2xl px-6 py-4 w-full max-sm:px-4 max-sm:py-3 max-sm:rounded-xl max-sm:font-sm',
        className,
      )}>
      <h4 className='font-semibold text-[#224DBA] text-sm'>{title}</h4>
      <div
        className={twMerge(
          'flex gap-2 overflow-x-auto flex-nowrap',
          contentClassName,
        )}>
        {genres.length > 0 ? (
          genres.map((genre, index) => (
            <span
              key={`${genre}-${index}`}
              className={twMerge(
                'text-xs text-[#3E507D] bg-[#73A1F7]/20 rounded-lg px-2 py-1 min-w-15 item-middle font-medium item-middle text-center whitespace-nowrap flex-shrink-0',
                chipClassName,
              )}>
              {genre}
            </span>
          ))
        ) : (
          <span
            className={twMerge(
              'text-xs text-[#3E507D] bg-[#73A1F7]/20 rounded-lg px-2 py-1 min-w-15 item-middle font-medium item-middle text-center whitespace-nowrap flex-shrink-0',
              chipClassName,
            )}>
            딱 맞는 취향을 찾는 중
          </span>
        )}
      </div>
    </div>
  );
};

export default GenreCard;
