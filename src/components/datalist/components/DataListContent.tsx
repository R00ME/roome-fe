import React from 'react';
import classNames from 'classnames';
import NoEditStatusItem from '../NoEditStatusItem';
import EditStatusItem from '../EditStatusItem';
import SkeletonItem from '@components/SkeletonItem';
import { useWindowSize } from '@/hooks/useWindowSize';

interface DataListContentProps {
  type: 'book' | 'cd';
  isEdit: boolean;
  isSearching: boolean;
  filteredDatas: DataListInfo[];
  selectedIds: string[];
  userId: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  observerRef: React.RefObject<HTMLDivElement>;
  onItemSelect: (id: string) => void;
}

export const DataListContent: React.FC<DataListContentProps> = ({
  type,
  isEdit,
  isSearching,
  filteredDatas,
  selectedIds,
  userId,
  hasMore,
  isLoadingMore,
  observerRef,
  onItemSelect,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= 640;
  const isBook = type === 'book';

  return (
    <ul
      className={classNames(
        'flex flex-col gap-6 overflow-y-auto',
        isMobile ? 'max-h-[calc(100vh-320px)]' : 'max-h-[calc(100vh-350px)]',
        isBook ? 'scrollbar' : 'scrollbar-purple',
      )}>
      {isSearching ? (
        Array(5)
          .fill(0)
          .map((_, index) => (
            <SkeletonItem
              key={`skeleton-${index}`}
              isBook={type === 'book'}
            />
          ))
      ) : filteredDatas.length > 0 ? (
        <>
          {filteredDatas.map((data, index) => {
            return isEdit ? (
              <EditStatusItem
                key={index}
                data={data}
                isBook={type === 'book'}
                isSelected={selectedIds.includes(data.id)}
                onSelect={() => onItemSelect(data.id)}
              />
            ) : (
              <NoEditStatusItem
                key={index}
                data={data}
                isBook={type === 'book'}
                userId={userId}
              />
            );
          })}
          {hasMore && (
            <div
              ref={observerRef}
              className='py-2'>
              {isLoadingMore && (
                <div className='flex flex-col gap-6'>
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <SkeletonItem
                        key={`loading-more-${index}`}
                        isBook={type === 'book'}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className='flex flex-col justify-center items-center h-40 text-gray-500'>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </ul>
  );
};
