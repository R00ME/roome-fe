import React, { useEffect, useState } from 'react';
import NoEditStatusItem from './NoEditStatusItem';
import EditStatusItem from './EditStatusItem';
import classNames from 'classnames';
import { SearchInput } from '@components/search-modal/SearchInput';
import { useDebounce } from '@hooks/useDebounce';
import SkeletonItem from '@components/SkeletonItem';
import { bookAPI } from '@/apis/book';
import { deleteCdsFromMyRack } from '@/apis/cd';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useToastStore } from '@/store/useToastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { DATA_LIST_THEMES, DataListType } from '@/constants/dataListTheme';
import { useWindowSize } from '@/hooks/useWindowSize';

interface DataListPropsWithClose extends DataListProps {
  onClose?: () => void;
}

const DataList = React.memo(
  ({
    datas,
    type,
    onDelete,
    hasMore,
    isLoading: isLoadingMore,
    fetchMore,
    userId,
    totalCount,
    setSearchInput,
    count,
    onClose,
  }: DataListPropsWithClose) => {
    const dataListType: DataListType = type === 'book' ? 'book' : 'cd';
    const theme = DATA_LIST_THEMES[dataListType];
    const { width } = useWindowSize();
    const isMobile = width <= 640;

    const navigate = useNavigate();
    const myCdId = Number(useParams().cdId);
    const [isEdit, setIsEdit] = useState(false);
    const [currentInput, setCurrentInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filteredDatas, setFilteredDatas] = useState<DataListInfo[]>(datas);
    const { showToast } = useToastStore();
    const myUserId = useUserStore().user.userId;

    const { listRef, observerRef } = useInfiniteScroll({
      fetchMore,
      isLoading: isLoadingMore,
      hasMore,
    });

    const debouncedQuery = useDebounce(currentInput, 800);

    // 검색어가 변경될 때마다 로컬에서 필터링
    useEffect(() => {
      if (currentInput !== debouncedQuery) {
        setIsSearching(true);
      }

      if (type === 'book') {
        if (debouncedQuery) {
          const filtered = datas.filter(
            (item) =>
              item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              item.author
                .toLowerCase()
                .includes(debouncedQuery.toLowerCase()) ||
              item.publisher
                .toLowerCase()
                .includes(debouncedQuery.toLowerCase()),
          );
          setFilteredDatas(filtered);
        } else {
          setFilteredDatas(datas);
        }
      } else {
        setSearchInput?.(debouncedQuery);
      }

      setIsSearching(false);
    }, [debouncedQuery, datas, type, setSearchInput]);

    // datas가 변경될 때 필터링된 데이터도 업데이트
    useEffect(() => {
      if (type === 'book') {
        if (!currentInput) {
          setFilteredDatas(datas);
        } else {
          const filtered = datas.filter(
            (item) =>
              item.title.toLowerCase().includes(currentInput.toLowerCase()) ||
              item.author.toLowerCase().includes(currentInput.toLowerCase()) ||
              item.publisher.toLowerCase().includes(currentInput.toLowerCase()),
          );
          setFilteredDatas(filtered);
        }
      } else {
        setFilteredDatas(datas);
      }
    }, [datas, currentInput, type]);

    const handleDelete = async () => {
      try {
        if (selectedIds.length === 0) {
          showToast('삭제할 항목을 선택해주세요!', 'error');
          return;
        }

        if (type === 'book') {
          // 도서 삭제 로직
          const myBookIds = selectedIds.join(',');
          await bookAPI.deleteBookFromMyBook(String(userId), myBookIds);
        } else {
          // CD 삭제 로직
          const myCdIds = selectedIds.map((item) => Number(item));
          await deleteCdsFromMyRack(myCdIds);
          if (myCdIds.includes(myCdId)) navigate(`/cdrack/${userId}`);
        }

        // UI 업데이트
        const updatedDatas = datas.filter(
          (data) => !selectedIds.includes(data.id),
        );
        setFilteredDatas(updatedDatas);
        onDelete?.(selectedIds);
        setSelectedIds([]);
        setIsEdit(false); // 편집 모드 종료

        // 성공 메시지
        showToast(`선택한 ${theme.itemLabel}이 삭제되었어요!`, 'success');
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error && 'response' in error
            ? (error as any).response?.data?.message
            : '삭제 중 오류가 발생했어요.';
        console.error('삭제 중 오류가 발생했습니다:', error);
        showToast(errorMessage, 'error');
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

    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: isMobile ? '100%' : '100%' }}
          animate={{
            x: 0,
            transition: { stiffness: 100, damping: 15 },
          }}
          exit={{
            x: isMobile ? '100%' : '100%',
            transition: { duration: 0.3 },
          }}
          className={classNames(
            'absolute top-0 bg-[#FFFAFA] overflow-hidden z-10',
            isMobile
              ? 'left-0 w-full h-full rounded-none'
              : 'right-0 w-[444px] h-screen rounded-tl-3xl rounded-bl-3xl',
          )}>
          <div
            className={classNames(
              'h-[100vh]',
              isMobile
                ? 'px-4 py-8'
                : 'pr-10 pl-11 pt-15 rounded-tl-3xl rounded-bl-3xl',
            )}>
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
                    onClick={handleDelete}>
                    삭제
                  </button>
                  <button
                    className={classNames(
                      `cursor-pointer`,
                      theme.completeColor,
                      isMobile ? 'text-sm' : '',
                    )}
                    onClick={handleComplete}>
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
                    onClick={handleEdit}>
                    편집
                  </button>
                )
              )}
            </div>

            {/* 검색창 */}
            <SearchInput
              value={currentInput}
              onChange={setCurrentInput}
              placeholder='어떤 것이든 검색해보세요!'
              mainColor={theme.mainColor}
              bgColor={theme.inputBgColor}
            />

            {/* 리스트 */}
            <ul
              ref={listRef}
              className={classNames(
                'flex flex-col gap-6 pr-2 overflow-y-auto scrollbar',
                isMobile
                  ? 'max-h-[calc(100vh-320px)]'
                  : 'max-h-[calc(100vh-350px)]',
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
                        onSelect={() => handleItemSelect(data.id)}
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
          </div>
        </motion.div>
      </AnimatePresence>
    );
  },
);

export default DataList;
