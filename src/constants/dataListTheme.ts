export const DATA_LIST_THEMES = {
  book: {
    mainColor: '#2656CD',
    subColor: 'text-[#3E507D]',
    completeColor: 'text-[#3E507D80]',
    inputBgColor: 'bg-[#C3D7FF26]',
    itemBgColor: 'bg-[#F1F3FA80]',
    subTextColor: 'text-[#3E507DB2]',
    title: 'BookList',
    itemLabel: '책',
  },
  cd: {
    mainColor: '#7838AF',
    subColor: 'text-[#60308C]',
    completeColor: 'text-[#60308C]/70',
    inputBgColor: 'bg-[#DDC3FF26]',
    itemBgColor: 'bg-[#f7f1fa]/50',
    subTextColor: 'text-[#5F3E7DB2]/70',
    title: 'PlayList',
    itemLabel: 'CD',
  },
} as const;

export type DataListType = keyof typeof DATA_LIST_THEMES;
