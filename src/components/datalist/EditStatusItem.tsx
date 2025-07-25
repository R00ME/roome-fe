import classNames from 'classnames';
import check_logo from '@assets/datalist/check-logo.svg';
import { truncateTitle } from '@utils/truncate';
import { DATA_LIST_THEMES } from '@/constants/dataListTheme';
import { useWindowSize } from '@/hooks/useWindowSize';

const AUTHOR_MAX_LENGTH = 8;

export default function EditStatusItem({
  data,
  isBook,
  isSelected,
  onSelect,
}: {
  data: DataListInfo;
  isBook: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const theme = DATA_LIST_THEMES[isBook ? 'book' : 'cd'];
  const { width } = useWindowSize();
  const isMobile = width <= 640;
  const TITLE_MAX_LENGTH = isMobile ? 10 : 13;

  return (
    <li
      onClick={onSelect}
      style={isSelected ? { borderColor: theme.mainColor } : {}}
      className={classNames(
        'flex items-center gap-7 cursor-pointer rounded-xl border-2 border-transparent',
        theme.itemBgColor,
        isMobile ? 'pl-4 pr-6 py-3' : 'pl-7 pr-9 py-4.5',
      )}>
      <label className='flex relative justify-center items-center w-4 h-4'>
        {/* 체크 박스 */}
        <input
          type='checkbox'
          style={
            isSelected
              ? {
                  backgroundColor: theme.mainColor,
                  borderColor: theme.mainColor,
                }
              : { borderColor: theme.mainColor }
          }
          checked={isSelected}
          onChange={onSelect}
          className='w-4 h-4 bg-center bg-no-repeat rounded-full border appearance-none cursor-pointer'
        />
        {isSelected && (
          <img
            className='absolute w-2.5 h-2.5'
            src={check_logo}
            alt='선택됨'
          />
        )}
      </label>

      <div className='flex flex-col gap-2 flex-1 min-w-0'>
        <div className={classNames('flex items-center gap-2', theme.subColor)}>
          <h4
            className={classNames(
              'font-semibold truncate',
              isMobile ? 'text-base' : 'text-[18px]',
            )}>
            {truncateTitle(data.title, TITLE_MAX_LENGTH)}
          </h4>
          <span className={classNames(isMobile ? 'text-xs' : 'text-[14px]')}>
            {data.artist || truncateTitle(data.author, AUTHOR_MAX_LENGTH)}
          </span>
        </div>

        <div>
          <span
            className={classNames(
              theme.subTextColor,
              isMobile ? 'text-xs' : 'text-sm',
            )}>
            {data.released_year.split('-')[0]}
            {isBook
              ? ` | ${data.publisher}`
              : ` | ${truncateTitle(data.album, isMobile ? 15 : 22)}`}
          </span>
        </div>
      </div>
    </li>
  );
}
