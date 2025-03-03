import { useEffect, useState, useRef } from 'react';
import NoEditStatusItem from './NoEditStatusItem';
import EditStatusItem from './EditStatusItem';
import classNames from 'classnames';
import { SearchInput } from '@components/search-modal/SearchInput';
import { useDebounce } from '@hooks/useDebounce';
import SkeletonItem from '@components/SkeletonItem';
import { bookAPI } from '@/apis/book';
import { deleteCdsFromMyRack } from '@/apis/cd';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import axiosInstance from '@/apis/axiosInstance';

interface DataListProps {
  datas: DataListInfo[];
  type: string;
  onDelete?: (deletedIds: string[]) => void;
  hasMore: boolean;
  isLoading: boolean;
  fetchMore: () => void;
  userId: number;
}

export default function DataList({
  datas,
  type,
  onDelete,
  hasMore,
  isLoading: isLoadingMore,
  fetchMore,
  userId,
}: DataListProps) {
  const isBook = type === 'book' ? true : false;
  const mainColor = isBook ? '#2656CD' : '#7838AF';
  const subColor = isBook ? 'text-[#3E507D]' : 'text-[#60308C]';
  const completeColor = isBook ? 'text-[#3E507D80]' : 'text-[#60308C]/70';
  const inputBgColor = isBook ? 'bg-[#C3D7FF26]' : 'bg-[#DDC3FF26]';

  const [isEdit, setIsEdit] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [filteredDatas, setFilteredDatas] = useState<DataListInfo[]>(datas);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(currentInput, 1000);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { listRef, observerRef } = useInfiniteScroll({
    fetchMore,
    isLoading: isLoadingMore,
    hasMore,
  });

  // datas가 변경될 때마다 filteredDatas 업데이트
  useEffect(() => {
    setFilteredDatas(datas);
  }, [datas]);

  // 검색어가 변경될 때마다 필터링
  useEffect(() => {
    const filteredResults = datas.filter((data) => {
      const searchTerm = currentInput.toLowerCase();
      return (
        data.author?.toLowerCase().includes(searchTerm) ||
        data.publisher?.toLowerCase().includes(searchTerm) ||
        data.released_year?.toLowerCase().includes(searchTerm) ||
        data.artist?.toLowerCase().includes(searchTerm) ||
        data.title?.toLowerCase().includes(searchTerm)
      );
    });

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setFilteredDatas(filteredResults);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [currentInput, datas]);

  const handleDelete = async () => {
    try {
      if (selectedIds.length > 0) {
        if (isBook) {
          // 도서 삭제 로직
          const myBookIds = selectedIds.join(',');
          await bookAPI.deleteBookFromMyBook(String(userId), myBookIds);
        } else {
          // CD 삭제 로직
          if (selectedIds.length === 1) {
            // 단일 CD 삭제
            await axiosInstance.delete(
              `/api/my-cd?userId=${userId}&myCdIds=${selectedIds[0]}`,
            );
          } else {
            // 다중 CD 삭제
            const myCdIds = selectedIds.join(',');
            await axiosInstance.delete(
              `/api/my-cd?userId=${userId}&myCdIds=${myCdIds}`,
            );
          }
        }

        const updatedDatas = filteredDatas.filter(
          (data) => !selectedIds.includes(data.id),
        );
        setFilteredDatas(updatedDatas);
        onDelete?.(selectedIds);
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('삭제 중 오류가 발생했습니다:', error);
    }
  };

  const handleItemSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleEdit = () => {
    setIsEdit(true);
    setCurrentInput('');
  };

  const handleComplete = () => {
    setIsEdit(false);
  };

  useEffect(() => {
    if (currentInput !== debouncedQuery) {
      setIsSearching(true);
    }

    const filteredDatas = datas.filter((data) => {
      return (
        data.author?.includes(debouncedQuery) ||
        data.publisher?.includes(debouncedQuery) ||
        data.released_year?.includes(debouncedQuery) ||
        data.artist?.includes(debouncedQuery) ||
        data.title?.includes(debouncedQuery)
      );
    });
    setFilteredDatas(filteredDatas);
    setIsSearching(false);
  }, [debouncedQuery]);

  useEffect(() => {
    if (currentInput !== debouncedQuery) {
      setIsSearching(true);
    }
  }, [currentInput, debouncedQuery]);

  return (
    <div className='absolute top-0 right-0  w-[444px] h-screen bg-[#FFFAFA] overflow-hidden rounded-tl-3xl rounded-bl-3xl z-10'>
      <div className='h-full pr-10 pl-11 pt-15 rounded-tl-3xl rounded-bl-3xl '>
        <span
          className={classNames(
            `text-center text-4xl  font-bold leading-normal`,
            `text-[${mainColor}]`,
          )}>
          PlayList
        </span>

        {/* 총 갯수, 편집 버튼 */}
        <div
          className={`flex  items-center justify-between gap-4 mt-15 mb-7 font-semibold   `}>
          <span
            className={classNames(
              `text-[18px] `,
              `${subColor}`,
              'font-semibold',
            )}>{`총 ${datas.length}개`}</span>

          {isEdit ? (
            <div className='flex items-center gap-4.5'>
              <button
                className={`text-[${mainColor}]  cursor-pointer`}
                onClick={handleDelete}>
                삭제
              </button>
              <button
                className={classNames(`cursor-pointer `, `${completeColor}`)}
                onClick={handleComplete}>
                완료
              </button>
            </div>
          ) : (
            <button
              className={classNames(
                `cursor-pointer text-[16px] font-semibold`,
                `text-[${mainColor}]`,
              )}
              onClick={handleEdit}>
              편집
            </button>
          )}
        </div>

        {/* 검색창 */}
        <SearchInput
          value={currentInput}
          onChange={setCurrentInput}
          placeholder='어떤 것이든 검색해보세요!'
          mainColor={mainColor}
          bgColor={inputBgColor}
        />
        <ul
          ref={listRef}
          className='flex flex-col max-h-[calc(100vh-200px)] gap-6 pr-2 overflow-y-auto scrollbar'>
          {isSearching ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <SkeletonItem
                  key={`skeleton-${index}`}
                  isBook={isBook}
                />
              ))
          ) : filteredDatas.length > 0 ? (
            <>
              {filteredDatas.map((data, index) => {
                return isEdit ? (
                  <EditStatusItem
                    key={index}
                    data={data}
                    isBook={isBook}
                    isSelected={selectedIds.includes(data.id)}
                    onSelect={() => handleItemSelect(data.id)}
                  />
                ) : (
                  <NoEditStatusItem
                    key={index}
                    data={data}
                    isBook={isBook}
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
                            isBook={isBook}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center h-40 text-gray-500'>
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
