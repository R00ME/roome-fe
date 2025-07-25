import { SEARCH_THEME } from '@/constants/searchTheme';
import addIcon from '@/assets/add-icon.svg';
import { motion } from 'framer-motion';

interface MobileSearchItemDetailsProps {
  item: SearchItemType;
  type: 'CD' | 'BOOK';
  onAdd: (item: SearchItemType) => void;
}

export const MobileSearchItemDetails = ({
  item,
  type,
  onAdd,
}: MobileSearchItemDetailsProps) => {
  const theme = SEARCH_THEME[type];

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(item);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`${theme.searchItemBg} border-t border-gray-200/30`}>
      <div className='p-4 flex flex-col sm:flex-row gap-4'>
        {/* 이미지 */}
        <div className='flex-shrink-0 mx-auto sm:mx-0'>
          <div className='relative w-24 h-32 sm:w-20 sm:h-28'>
            <img
              src={item.imageUrl}
              alt={item.title}
              className='object-cover w-full h-full rounded-lg book-shadow'
            />
            <button
              onClick={handleAddClick}
              className={`absolute -bottom-2 -right-2 p-1.5 ${theme.searchResultAddBtn} rounded-full cursor-pointer backdrop-blur-xs`}>
              <img
                src={addIcon}
                alt='add'
                className='w-4 h-4 select-none'
              />
            </button>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className='flex-1 flex flex-col gap-2 text-center sm:text-left'>
          <h4
            className={`font-bold ${theme.searchResultText} text-base sm:text-lg`}>
            {item.title}
          </h4>
          <p className={`${theme.searchItemName} font-medium text-sm`}>
            {item.author || item.artist}
          </p>

          {/* 장르 */}
          {item.genres && item.genres.length > 0 && (
            <div className='flex flex-wrap gap-1 justify-center sm:justify-start'>
              {item.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className={`px-2 py-1 text-xs ${theme.searchGenre} ${theme.searchResultText} rounded-full`}>
                  {genre}
                </span>
              ))}
              {item.genres.length > 3 && (
                <span
                  className={`px-2 py-1 text-xs ${theme.searchGenre} ${theme.searchResultText} rounded-full`}>
                  +{item.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
