import cdImg from '@assets/cd/cd.png';
import bookImg from '@assets/room/book.png';
import { useRef } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutside';
import PreferenceSettingCard from './PreferenceSettingCard';

export default function PreferenceSetting({
  storageData,
  onFurnitureToggle,
  bookshelfLevel,
  cdRackLevel,
  furnitures,
  bookGenres,
  cdGenres,
  onClose,
}: PreferenceSettingProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside({
    modalRef,
    buttonRef,
    isOpen: true,
    onClose,
    excludeSelectors: ['.bottom-menu'],
  });

  return (
    <div className='flex flex-col items-center justify-end w-full min-h-screen '>
      <div
        ref={modalRef}
        className='setting-gradient 
          w-full
          h-auto md:h-110 2xl:h-110
          bottom-[calc(env(safe-area-inset-bottom)+80px)] md:bottom-auto
          px-17 md:p-6'>
        <div className='flex flex-col items-start md:items-center
          justify-center md:flex-row gap-4 md:gap-10 mb-35  '>
          <PreferenceSettingCard
            title={'음악'}
            level={cdRackLevel}
            genres={cdGenres}
            thumbnail={cdImg}
            maxCount={storageData.maxMusic}
            savedCount={storageData.savedMusic}
            writtenCount={storageData.writtenMusicLogs}
            isAdd={furnitures[1].isVisible}
            onClick={() => onFurnitureToggle('CD_RACK')}
          />
          <PreferenceSettingCard
            title={'도서'}
            level={bookshelfLevel}
            genres={bookGenres}
            thumbnail={bookImg}
            maxCount={storageData.maxBooks}
            savedCount={storageData.savedBooks}
            writtenCount={storageData.writtenReviews}
            isAdd={furnitures[0].isVisible}
            onClick={() => onFurnitureToggle('BOOKSHELF')}
          />
        </div>
      </div>
    </div>
  );
}
