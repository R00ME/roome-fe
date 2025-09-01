import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MobileSearchItemHeader } from './MobileSearchItemHeader';
import { MobileSearchItemDetails } from './MobileSearchItemDetails';

interface MobileSearchItemProps {
  item: SearchItemType;
  type: 'CD' | 'BOOK';
  onAdd: (item: SearchItemType) => void;
}

export const MobileSearchItem = ({
  item,
  type,
  onAdd,
}: MobileSearchItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='mb-3 rounded-lg overflow-hidden'>
      <MobileSearchItemHeader
        item={item}
        type={type}
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      />

      <AnimatePresence>
        {isExpanded && (
          <MobileSearchItemDetails
            item={item}
            type={type}
            onAdd={onAdd}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
