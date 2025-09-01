import React from 'react';
import { SearchInput } from '@components/search-modal/SearchInput';
import { DATA_LIST_THEMES, DataListType } from '@/constants/dataListTheme';

interface DataListSearchProps {
  type: 'book' | 'cd';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DataListSearch: React.FC<DataListSearchProps> = ({
  type,
  value,
  onChange,
  placeholder = '어떤 것이든 검색해보세요!',
}) => {
  const dataListType: DataListType = type === 'book' ? 'book' : 'cd';
  const theme = DATA_LIST_THEMES[dataListType];

  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      mainColor={theme.mainColor}
      bgColor={theme.inputBgColor}
    />
  );
};
