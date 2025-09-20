import cd_play_btn from '@/assets/datalist/cd-play-btn.svg';
import book_go_btn from '@/assets/datalist/book-go-btn.svg';
import { Link } from 'react-router-dom';
import { truncateTitle } from '@/utils/truncate';
import { useUserStore } from '@/store/useUserStore';
import { DATA_LIST_THEMES } from '@/constants/dataListTheme';
import { useWindowSize } from '@/hooks/useWindowSize';
import classNames from 'classnames';

const AUTHOR_MAX_LENGTH = 8;

export default function NoEditStatusItem({
  data,
  isBook,
  userId,
  onClose,
}: {
  data: DataListInfo;
  isBook: boolean;
  userId: number;
  onClose?: () => void;
}) {
  const { user } = useUserStore();
  const theme = DATA_LIST_THEMES[isBook ? 'book' : 'cd'];
  const { width } = useWindowSize();
  const isMobile = width <= 640;
  const TITLE_MAX_LENGTH = isMobile ? 10 : 12;

  const getBookPath = () => {
    // 현재 로그인한 유저의 ID와 전달받은 userId가 같으면 내 서평
    if (user.userId === userId) {
      return `/book/${data.id}`;
    }
    // 다른 사람의 서평
    return `/book/${data.id}/user/${userId}`;
  };

  return (
    <li
      className={classNames(
        'flex justify-between items-center rounded-xl',
        theme.itemBgColor,
        isMobile ? 'pl-4 pr-3 py-3' : 'pl-7 pr-4 py-4.5',
      )}>
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
              : ` | ${truncateTitle(data.album, TITLE_MAX_LENGTH)}`}
          </span>
        </div>
      </div>
      <Link
        to={isBook ? getBookPath() : `/cd/${data.id}/user/${userId}`}
        onClick={onClose}
        className='hover:translate-x-1 all-200-eio flex-shrink-0 ml-2'>
        <img
          className={classNames(
            'cursor-pointer',
            isMobile ? 'w-6 h-6' : 'w-8 h-8',
          )}
          src={isBook ? book_go_btn : cd_play_btn}
          alt={`이동하기 버튼`}
        />
      </Link>
    </li>
  );
}
