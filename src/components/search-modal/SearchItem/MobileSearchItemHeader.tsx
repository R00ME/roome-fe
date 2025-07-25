import { SEARCH_THEME } from '@/constants/searchTheme';
import { truncateTitle } from '@/utils/truncate';
import { toKoreanDate } from '@utils/dateFormat';

interface MobileSearchItemHeaderProps {
  item: SearchItemType;
  type: 'CD' | 'BOOK';
  isExpanded: boolean;
  onClick: () => void;
}

export const MobileSearchItemHeader = ({
  item,
  type,
  isExpanded,
  onClick,
}: MobileSearchItemHeaderProps) => {
  const theme = SEARCH_THEME[type];

  return (
    <div
      className={`flex items-end p-3 cursor-pointer transition-colors duration-200 ${
        theme.searchItemBg
      } ${isExpanded ? 'rounded-b-none' : ''}`}
      onClick={onClick}>
      <div className='flex-1 min-w-0'>
        <h3 className={`font-semibold ${theme.searchItemText}`}>
          {truncateTitle(item.title, 20)}
        </h3>
        <p className={`text-sm ${theme.searchItemName} line-clamp-1`}>
          {type === 'BOOK'
            ? `${item.author} | ${item.publisher || '출판사 정보 없음'}`
            : `${item.artist} | ${item.album_title || ''}`}
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <span
          className={`text-sm ${theme.searchItemText} whitespace-nowrap tabular-nums`}>
          {toKoreanDate(item.date)}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          } ${theme.searchItemText}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
    </div>
  );
};
