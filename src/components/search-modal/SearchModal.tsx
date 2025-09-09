import React from 'react';
import { SearchInput } from './SearchInput';
import { SearchList } from './SearchList';
import { SearchResult } from './SearchResult';
import { useSearch } from '@/hooks/useSearch';
import ModalBackground from '@/components/ModalBackground';
import { SEARCH_THEME } from '@/constants/searchTheme';
import { motion } from 'framer-motion';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useSearchActions } from './hooks/useSearchActions';
import AlertModal from '@/components/AlertModal';
import ConfirmModal from '@/components/ConfirmModal';

interface SearchModalProps {
  title: string;
  onClose: () => void;
  type: 'CD' | 'BOOK';
  onSelect: (item?: SearchItemType) => void;
  onSuccess?: (item: SearchItemType) => void;
  userId?: string;
}

const LARGE_SCREEN_WIDTH = 1024;

export const SearchModal = ({
  title,
  onClose,
  type,
  onSelect,
  onSuccess,
  userId,
}: SearchModalProps) => {
  const { query, setQuery, results, isLoading, error } = useSearch(type);
  const [selectedItem, setSelectedItem] = React.useState<SearchItemType | null>(
    null,
  );
  const theme = SEARCH_THEME[type];
  const { width } = useWindowSize();
  const isDesktop = width >= LARGE_SCREEN_WIDTH;

  const {
    handleAdd,
    handleUpgrade,
    isAlertModalOpen,
    setIsAlertModalOpen,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
  } = useSearchActions({
    type,
    userId,
    onClose,
    onSelect,
    onSuccess,
  });

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  return (
    <ModalBackground onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: 20 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        className='py-3 px-3.5 sm:p-4 border-2 border-white bg-white/30 filter-blur rounded-2xl sm:rounded-3xl 
                   w-[95vw] max-w-[1000px] h-[90vh] max-h-[657px] 
                   sm:w-[90vw] lg:w-[1000px] sm:h-[657px]'>
        <div
          className='gap-2 sm:gap-4 p-6 sm:p-10 w-full h-full bg-[#fffeff] rounded-xl sm:rounded-2xl 
                        flex flex-col lg:flex-row lg:item-between'>
          {/* 제목 + 검색 바 + 아이템 리스트 */}
          <div className='w-full lg:w-1/2 h-full flex flex-col'>
            <h2
              className={`mb-4 sm:mb-7 text-2xl sm:text-3xl font-bold ${theme.title}`}>
              {title}
            </h2>
            <SearchInput
              value={query}
              onChange={handleSearch}
              placeholder='어떤 것이든 검색해보세요!'
              mainColor={`${type === 'BOOK' ? '#2656CD' : '#7838AF'}`}
            />
            {isLoading && (
              <div className='text-gray-400 text-sm sm:text-base'>
                검색 중...
              </div>
            )}
            {error && (
              <div className='text-gray-400 text-sm sm:text-base'>{error}</div>
            )}
            <div className='flex-1 overflow-hidden'>
              <SearchList
                items={results}
                type={type}
                onItemClick={setSelectedItem}
                selectedItem={selectedItem}
                onAdd={handleAdd}
              />
            </div>
          </div>

          {/* 검색 결과 - 데스크톱에서만 표시 */}
          {isDesktop && (
            <div className='w-full lg:w-1/2 lg:pl-8 mt-4 lg:mt-0 flex-1 lg:flex-none'>
              <SearchResult
                item={selectedItem}
                type={type}
                isLoading={isLoading}
                error={error}
                items={results}
                onSelect={onSelect}
                onClose={onClose}
                onSuccess={onSuccess}
                userId={userId}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* 모달들 */}
      {isAlertModalOpen && (
        <AlertModal
          onConfirm={() => setIsAlertModalOpen(false)}
          title='추가할 수 없는 CD에요!'
          subTitle='다른 CD를 선택해주세요.'
        />
      )}

      {isUpgradeModalOpen && (
        <ConfirmModal
          onClose={() => setIsUpgradeModalOpen(false)}
          onConfirm={handleUpgrade}
          title={type === 'BOOK' ? `책장이 꽉 찼어요!` : 'CD랙이 꽉 찼어요!'}
          subTitle='400 포인트를 소모해 업그레이드 할 수 있어요.'
        />
      )}
    </ModalBackground>
  );
};
