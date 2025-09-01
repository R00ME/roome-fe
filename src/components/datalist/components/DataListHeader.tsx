import React from 'react';
import classNames from 'classnames';
import { DATA_LIST_THEMES, DataListType } from '@/constants/dataListTheme';
import { useWindowSize } from '@/hooks/useWindowSize';

interface DataListHeaderProps {
  type: 'book' | 'cd';
  count: number;
  totalCount: number;
  isEdit: boolean;
  userId: number;
  myUserId: number;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onClose?: () => void;
}

export const DataListHeader: React.FC<DataListHeaderProps> = ({
  type,
  count,
  totalCount,
  isEdit,
  userId,
  myUserId,
  onEdit,
  onComplete,
  onDelete,
  onClose,
}) => {
  const dataListType: DataListType = type === 'book' ? 'book' : 'cd';
  const theme = DATA_LIST_THEMES[dataListType];
  const { width } = useWindowSize();
  const isMobile = width <= 640;

  return (
    <>
      {/* 모바일 닫기 버튼 */}
      {isMobile && onClose && (
        <div className='flex justify-end mb-4'>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
            aria-label='닫기'>
            <svg
              className='w-6 h-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      )}

      {/* 제목 */}
      <h3
        className={classNames(
          'font-bold leading-normal text-center block',
          isMobile ? 'text-3xl mb-6' : 'text-4xl',
          `text-[${theme.mainColor}]`,
        )}>
        {theme.title}
      </h3>

      {/* 총 갯수, 편집 버튼 */}
      <div
        className={classNames(
          'flex gap-4 justify-between items-center font-semibold',
          isMobile ? 'mb-4 mt-4' : 'mb-7 mt-15',
        )}>
        <span
          className={classNames(
            theme.subColor,
            'font-semibold',
            isMobile ? 'text-base' : 'text-[18px]',
          )}>
          {`총 ${type === 'book' ? count : totalCount}개`}
        </span>

        {isEdit ? (
          <div className='flex items-center gap-4.5'>
            <button
              className={`cursor-pointer text-[${theme.mainColor}] ${
                isMobile ? 'text-sm' : ''
              }`}
              onClick={onDelete}>
              삭제
            </button>
            <button
              className={classNames(
                `cursor-pointer`,
                theme.completeColor,
                isMobile ? 'text-sm' : '',
              )}
              onClick={onComplete}>
              완료
            </button>
          </div>
        ) : (
          userId === myUserId && (
            <button
              className={classNames(
                `font-semibold cursor-pointer text-[${theme.mainColor}]`,
                isMobile ? 'text-sm' : 'text-[16px]',
              )}
              onClick={onEdit}>
              편집
            </button>
          )
        )}
      </div>
    </>
  );
};
