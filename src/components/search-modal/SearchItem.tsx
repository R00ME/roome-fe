import { useWindowSize } from '@/hooks/useWindowSize';
import { DesktopSearchItem } from './SearchItem/DesktopSearchItem';
import { MobileSearchItem } from './SearchItem/MobileSearchItem';

interface SearchItemProps {
  item: SearchItemType;
  type: 'CD' | 'BOOK';
  onClick: () => void;
  isSelected?: boolean;
  onAdd?: (item: SearchItemType) => void;
}

const LARGE_SCREEN_WIDTH = 1024;

export const SearchItem = ({
  item,
  type,
  onClick,
  isSelected = false,
  onAdd,
}: SearchItemProps) => {
  const { width } = useWindowSize();
  const isDesktop = width >= LARGE_SCREEN_WIDTH;

  if (isDesktop) {
    return (
      <DesktopSearchItem
        item={item}
        type={type}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  return (
    <MobileSearchItem
      item={item}
      type={type}
      onAdd={onAdd!}
    />
  );
};
