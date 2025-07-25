import React from 'react';
import classNames from 'classnames';

// components
import { DataListHeader } from './components/DataListHeader';
import { DataListSearch } from './components/DataListSearch';
import { DataListContent } from './components/DataListContent';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserStore } from '@/store/useUserStore';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useDataListState } from './hooks/useDataListState';
import { useDataListSearch } from './hooks/useDataListSearch';
import { useDataListDelete } from './hooks/useDataListDelete';

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
    const { width } = useWindowSize();
    const isMobile = width <= 640;
    const myUserId = useUserStore().user.userId;

    const {
      isEdit,
      selectedIds,
      handleEdit,
      handleComplete,
      handleItemSelect,
      resetSelection,
    } = useDataListState();

    const {
      currentInput,
      isSearching,
      filteredDatas,
      setCurrentInput,
      clearSearch,
    } = useDataListSearch({
      datas,
      type: type as 'book' | 'cd',
      setSearchInput,
    });

    const { handleDelete: executeDelete } = useDataListDelete({
      type: type as 'book' | 'cd',
      userId,
      onDelete,
    });

    const { listRef, observerRef } = useInfiniteScroll({
      fetchMore,
      isLoading: isLoadingMore,
      hasMore,
    });

    // 삭제 처리
    const handleDelete = async () => {
      const success = await executeDelete(selectedIds);
      if (success) {
        resetSelection();
        handleComplete();
        clearSearch();
      }
    };

    // 편집 완료 시 검색 초기화
    const handleCompleteWithClear = () => {
      handleComplete();
      clearSearch();
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
            <DataListHeader
              type={type as 'book' | 'cd'}
              count={count || 0}
              totalCount={totalCount || 0}
              isEdit={isEdit}
              userId={userId}
              myUserId={myUserId}
              onEdit={handleEdit}
              onComplete={handleCompleteWithClear}
              onDelete={handleDelete}
              onClose={onClose}
            />

            <DataListSearch
              type={type as 'book' | 'cd'}
              value={currentInput}
              onChange={setCurrentInput}
            />

            <DataListContent
              type={type as 'book' | 'cd'}
              isEdit={isEdit}
              isSearching={isSearching}
              filteredDatas={filteredDatas}
              selectedIds={selectedIds}
              userId={userId}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              listRef={listRef}
              observerRef={observerRef}
              onItemSelect={handleItemSelect}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  },
);

export default DataList;
