import { BOOK_THEME } from '@/constants/bookTheme';

interface ReviewActionButtonsProps {
  isSubmitting: boolean;
  isValidReview: boolean;
  theme: string;
  onTempSave: () => void;
  onSave: () => void;
}

const ReviewActionButtons = ({
  isSubmitting,
  isValidReview,
  theme,
  onTempSave,
  onSave,
}: ReviewActionButtonsProps) => {
  return (
    <div className='flex gap-4 max-[1024px]:gap-3 justify-end'>
      <button
        onClick={onTempSave}
        className='px-7 max-[1024px]:px-5 py-2 text-gray-600 bg-gray-200 rounded-[10px] drop-shadow-logo'>
        임시저장
      </button>
      <button
        onClick={onSave}
        className={`px-7 max-[1024px]:px-5 py-2 text-white transition-colors rounded-[10px] drop-shadow-logo hover:opacity-80 active:bg-white ${
          !isValidReview || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor:
            !isValidReview || isSubmitting
              ? undefined
              : BOOK_THEME[theme ?? 'BLUE'].primary,
          color:
            document.activeElement === document.querySelector(':active')
              ? BOOK_THEME[theme ?? 'BLUE'].primary
              : 'white',
        }}>
        {isSubmitting ? '저장 중...' : '저장하기'}
      </button>
    </div>
  );
};

export default ReviewActionButtons;
