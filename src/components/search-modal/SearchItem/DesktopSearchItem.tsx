import { SEARCH_THEME } from '@/constants/searchTheme';
import { truncateTitle } from '@/utils/truncate';
import { toKoreanDate } from '@utils/dateFormat';

interface DesktopSearchItemProps {
  item: SearchItemType;
  type: 'CD' | 'BOOK';
  onClick: () => void;
  isSelected: boolean;
}

export const DesktopSearchItem = ({
  item,
  type,
  onClick,
  isSelected,
}: DesktopSearchItemProps) => {
  const theme = SEARCH_THEME[type];

  return (
    <div
      className={`flex items-end p-3 mb-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        theme.searchItemBg
      } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
      onClick={onClick}>
      <div className='flex-1 min-w-0'>
        <h3 className={`font-semibold ${theme.searchItemText}`}>
          {truncateTitle(item.title, 24)}
        </h3>
        <p className={`text-sm ${theme.searchItemName} line-clamp-1`}>
          {type === 'BOOK'
            ? `${item.author} | ${item.publisher || '출판사 정보 없음'}`
            : `${item.artist} | ${item.album_title || ''}`}
        </p>
      </div>
      <span
        className={`ml-4 text-sm ${theme.searchItemText} whitespace-nowrap tabular-nums`}>
        {toKoreanDate(item.date)}
      </span>
    </div>
  );
};
