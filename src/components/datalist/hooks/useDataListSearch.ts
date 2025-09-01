import { useState, useEffect } from 'react';
import { useDebounce } from '@hooks/useDebounce';

interface UseDataListSearchProps {
  datas: DataListInfo[];
  type: 'book' | 'cd';
  setSearchInput?: (value: string) => void;
}

export const useDataListSearch = ({
  datas,
  type,
  setSearchInput,
}: UseDataListSearchProps) => {
  const [currentInput, setCurrentInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState<DataListInfo[]>(datas);

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
            item.author.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            item.publisher.toLowerCase().includes(debouncedQuery.toLowerCase()),
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

  const clearSearch = () => {
    setCurrentInput('');
  };

  return {
    currentInput,
    isSearching,
    filteredDatas,
    setCurrentInput,
    clearSearch,
  };
};
