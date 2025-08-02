import { useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReviewTextField from './components/ReviewTextField';
import FreeformEditor from './components/FreeformEditor';
import ReviewTitleInput from './components/ReviewTitleInput';
import ReviewActionButtons from './components/ReviewActionButtons';
import BookReviewDisplay from '@pages/book/book-viewer/components/BookReviewDisplay';
import ResponsiveBookInfo from './components/ResponsiveBookInfo';

import ThemeSelector from './components/ThemeSelector';
import { useToastStore } from '@/store/useToastStore';
import { useUserStore } from '@/store/useUserStore';
import { useBookReview } from '@hooks/book/useBookReview';
import { useBookReviewAutoSave } from '@hooks/book/useBookReviewAutoSave';
import {
  useAutoBackofficeTracking,
  useBackofficeFeatureTracking,
} from '@/hooks/useBackofficeBatchTracking';

interface BookEditorPageProps {
  bookTitle: string;
  author: string;
  genreNames: string[];
  publishedDate: string;
  imageUrl: string;
  onComplete?: () => void;
}

const BookEditorPage = ({
  bookTitle,
  author,
  genreNames,
  publishedDate,
  imageUrl,
}: BookEditorPageProps) => {
  const { bookId } = useParams();
  const showToast = useToastStore((state) => state.showToast);
  const { user } = useUserStore();

  // 페이지 접속 추적 (자동 시작/종료)
  useAutoBackofficeTracking('book', user?.userId?.toString(), 1000);

  const { startTracking, endTracking } = useBackofficeFeatureTracking(
    'book',
    user?.userId?.toString(),
    1000,
  );

  // endTracking 함수 메모이제이션
  const memoizedEndTracking = useCallback(() => {
    endTracking();
  }, [endTracking]);

  // bookInfo 객체 메모이제이션
  const bookInfo = useMemo(
    () => ({
      bookTitle,
      author,
      genreNames,
      publishedDate,
      imageUrl,
    }),
    [bookTitle, author, genreNames, publishedDate, imageUrl],
  );

  // 서평 데이터 관리 커스텀 훅
  const {
    reviewFields,
    isSubmitting,
    handleTitleChange,
    handleThemeChange,
    handleQuoteChange,
    handleEmotionChange,
    handleReasonChange,
    handleDiscussionChange,
    handleFreeformChange,
    handleSave,
    isValidReview,
  } = useBookReview({
    bookId,
    bookInfo,
    onComplete: memoizedEndTracking,
  });

  // 자동 저장 커스텀 훅
  const { handleTempSave } = useBookReviewAutoSave({
    bookId,
    reviewData: reviewFields,
  });

  useEffect(() => {
    startTracking();
  }, [startTracking]);

  // 수동 임시저장 핸들러
  const handleTempSaveClick = useCallback(() => {
    if (handleTempSave()) {
      showToast('임시저장 완료!', 'success');
    }
  }, [handleTempSave, showToast]);

  // 저장 핸들러
  const handleSaveClick = useCallback(() => {
    if (!isValidReview()) {
      showToast('제목이나 내용을 깜빡한 것 같아요! ʕ ´•̥̥̥ ᴥ•̥̥̥`ʔ', 'error');
      return;
    }
    if (!isSubmitting) {
      handleSave();
    }
  }, [isValidReview, showToast, isSubmitting, handleSave]);

  // 유효성 검사 결과 메모이제이션
  const isValidReviewResult = useMemo(() => isValidReview(), [isValidReview]);

  return (
    <section className='flex overflow-x-hidden w-full h-screen max-[1024px]:flex-col'>
      {/* 1024px 이하에서만 표시되는 책 정보 */}
      <ResponsiveBookInfo
        bookTitle={bookTitle}
        author={author}
        genreNames={genreNames}
        publishedDate={publishedDate}
        imageUrl={imageUrl}
        theme={reviewFields.theme}
      />

      {/* 에디터 영역 */}
      <article className='w-1/2 max-[1024px]:w-full h-full p-8 overflow-y-auto bg-[#FDFEFF] scrollbar-hide scrollbar max-[440px]:px-6'>
        <div className='flex overflow-auto flex-col gap-8 px-14 max-[1024px]:px-6 py-12 max-[1024px]:py-0 max-[440px]:px-0'>
          {/* 제목 입력 영역 */}
          <ReviewTitleInput
            value={reviewFields.title}
            theme={reviewFields.theme}
            onChange={handleTitleChange}
          />

          {/* 테마 선택 영역 */}
          <ThemeSelector
            selectedTheme={reviewFields.theme}
            onThemeChange={handleThemeChange}
          />

          <div className='space-y-6'>
            <ReviewTextField
              title='인상 깊은 구절'
              value={reviewFields.quote}
              onChange={handleQuoteChange}
              placeholder='인상 깊은 구절을 남겨주세요.'
              theme={reviewFields.theme}
            />

            <ReviewTextField
              title='그 때 나의 감정'
              value={reviewFields.emotion}
              onChange={handleEmotionChange}
              placeholder='그 때 나의 감정을 입력해주세요.'
              theme={reviewFields.theme}
            />

            <ReviewTextField
              title='책을 선택하게 된 계기'
              value={reviewFields.reason}
              onChange={handleReasonChange}
              placeholder='책을 선택하게 된 계기를 입력해주세요.'
              theme={reviewFields.theme}
            />

            <ReviewTextField
              title='다른 사람과 나누고 싶은 대화 주제'
              value={reviewFields.discussion}
              onChange={handleDiscussionChange}
              placeholder='다른 사람과 나누고 싶은 대화 주제를 입력해주세요.'
              theme={reviewFields.theme}
            />

            <FreeformEditor
              value={reviewFields.freeform}
              onChange={handleFreeformChange}
              theme={reviewFields.theme}
            />

            <ReviewActionButtons
              isSubmitting={isSubmitting}
              isValidReview={isValidReviewResult}
              theme={reviewFields.theme}
              onTempSave={handleTempSaveClick}
              onSave={handleSaveClick}
            />
          </div>
        </div>
      </article>

      {/* 실시간 뷰어 영역 */}
      <article className='overflow-x-hidden w-1/2 max-[1024px]:hidden h-full'>
        <BookReviewDisplay
          mode='preview'
          previewData={reviewFields}
        />
      </article>
    </section>
  );
};

export default BookEditorPage;
