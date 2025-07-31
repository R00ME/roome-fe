import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ReviewTextField from './components/ReviewTextField';
import FreeformEditor from './components/FreeformEditor';
import BookReviewDisplay from '@pages/book-viewer/components/BookReviewDisplay';
import { BOOK_THEME } from '@/constants/bookTheme';
import ThemeSelector from './components/ThemeSelector';
import { useToastStore } from '@/store/useToastStore';
import { useUserStore } from '@/store/useUserStore';
import { bookAPI } from '@/apis/book';
import { BookReviewData } from '@/types/book';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showToast = useToastStore((state) => state.showToast);
  const { user } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(
    searchParams.get('mode') === 'edit',
  );

  // 페이지 접속 추적 (자동 시작/종료)
  useAutoBackofficeTracking('book', user?.userId?.toString(), 1000);

  const { startTracking, endTracking } = useBackofficeFeatureTracking(
    'book',
    user?.userId?.toString(),
    1000,
  );
  const [reviewFields, setReviewFields] = useState<BookReviewData>(() => {
    // localStorage에서 임시저장 데이터 불러오기
    const savedData = localStorage.getItem(`draft-review-${bookId}`);
    if (savedData) {
      return JSON.parse(savedData);
    }

    return {
      // 도서 정보
      bookTitle,
      author,
      genreNames,
      publishedDate,
      imageUrl,
      // 리뷰 정보
      title: '',
      writeDateTime: '',
      theme: 'BLUE',
      quote: '',
      emotion: '',
      reason: '',
      discussion: '',
      freeform: '',
    };
  });

  // 자동 저장 함수
  const autoSave = useCallback(() => {
    if (!bookId) return;
    localStorage.setItem(
      `draft-review-${bookId}`,
      JSON.stringify(reviewFields),
    );
  }, [bookId, reviewFields]);

  // 수동 임시저장
  const handleTempSave = () => {
    autoSave();
    showToast('임시저장 완료!', 'success');
  };

  // 5초마다 자동저장
  useEffect(() => {
    const timer = setInterval(autoSave, 5000);
    return () => clearInterval(timer);
  }, [autoSave]);

  // 컴포넌트 마운트 시 추적 시작
  useEffect(() => {
    startTracking();
  }, [startTracking]);

  // 수정 모드일 때 기존 서평 데이터 불러오기
  useEffect(() => {
    const fetchReview = async () => {
      if (!bookId) return;

      try {
        const review = await bookAPI.getReview(bookId);
        if (review) {
          setIsEditMode(true);
          setReviewFields({
            bookTitle,
            author,
            genreNames,
            publishedDate,
            imageUrl,
            title: review.title,
            writeDateTime: review.writeDateTime,
            theme: review.coverColor,
            quote: review.quote,
            emotion: review.takeaway,
            reason: review.motivate,
            discussion: review.topic,
            freeform: review.freeFormText,
          });
        }
      } catch (error) {
        console.error('서평 조회 중 오류 발생:', error);
        showToast(
          '아직 서평이 없어요! 첫 서평을 작성해주세요 ( 灬´ ˘ `灬 )',
          'success',
        );
      }
    };

    fetchReview();
  }, [bookId, bookTitle, author, genreNames, publishedDate, imageUrl]);

  const handleFieldChange =
    (field: keyof BookReviewData) => (value: string | BookReviewData) => {
      setReviewFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const isValidReview = () => {
    // 제목은 필수
    if (!reviewFields.title.trim()) {
      return false;
    }

    // 인상 깊은 구절, 감정, 계기, 대화 주제, 자유 형식 중 하나는 필수
    const hasRequiredField = [
      reviewFields.quote,
      reviewFields.emotion,
      reviewFields.reason,
      reviewFields.discussion,
      reviewFields.freeform,
    ].some((field) => field.trim() !== '');

    return hasRequiredField;
  };

  const handleSave = async () => {
    if (!bookId || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const reviewData = {
        title: reviewFields.title,
        quote: reviewFields.quote,
        takeaway: reviewFields.emotion,
        motivate: reviewFields.reason,
        topic: reviewFields.discussion,
        freeFormText: reviewFields.freeform,
        coverColor: reviewFields.theme,
      };

      // API 호출 (수정 또는 새로 작성)
      if (isEditMode) {
        await bookAPI.updateReview(bookId, reviewData);
        showToast('서평 수정 완료!', 'success');
      } else {
        await bookAPI.addReview(bookId, reviewData);
        showToast('서평 등록 완료!', 'success');
      }

      // 공통 처리 로직
      localStorage.removeItem(`draft-review-${bookId}`);

      endTracking();

      navigate(`/book/${bookId}`, { replace: true });
    } catch (error) {
      console.error('서평 저장 중 오류 발생:', error);
      showToast('서평 저장에 실패했습니다 ꌩ-ꌩ', 'error');

      // 실패 시에도 추적 종료
      endTracking();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='flex overflow-x-hidden w-full h-screen'>
      {/* 에디터 영역 */}
      <article className='w-1/2 h-full p-8 overflow-y-auto bg-[#FDFEFF] scrollbar-hide scrollbar'>
        <div className='flex overflow-auto flex-col gap-8 px-14 py-12'>
          {/* 제목 입력 영역 */}
          <input
            type='text'
            maxLength={25}
            required
            placeholder='제목을 입력해주세요...'
            value={reviewFields.title}
            onChange={(e) => handleFieldChange('title')(e.target.value)}
            className={`overflow-hidden py-4 w-full text-4xl font-semibold focus:outline-none placeholder:text-opacity-40 text-ellipsis`}
            style={{
              borderBottomWidth: '2px',
              borderBottomColor: `${
                BOOK_THEME[reviewFields.theme ?? 'BLUE'].secondary
              }33`,
              color: BOOK_THEME[reviewFields.theme ?? 'BLUE'].primary,
            }}
          />

          {/* 테마 선택 영역 */}
          <ThemeSelector
            selectedTheme={reviewFields.theme}
            onThemeChange={(theme) => handleFieldChange('theme')(theme)}
          />

          <div className='space-y-6'>
            <ReviewTextField
              title='인상 깊은 구절'
              value={reviewFields.quote}
              onChange={handleFieldChange('quote')}
              placeholder='인상 깊은 구절을 남겨주세요.'
              theme={reviewFields.theme}
            />

            <ReviewTextField
              title='그 때 나의 감정'
              value={reviewFields.emotion}
              onChange={handleFieldChange('emotion')}
              placeholder='그 때 나의 감정을 입력해주세요.'
              theme={reviewFields.theme}
            />

            <ReviewTextField
              title='책을 선택하게 된 계기'
              value={reviewFields.reason}
              onChange={handleFieldChange('reason')}
              placeholder='책을 선택하게 된 계기를 입력해주세요.'
              theme={reviewFields.theme}
            />

            <ReviewTextField
              title='다른 사람과 나누고 싶은 대화 주제'
              value={reviewFields.discussion}
              onChange={handleFieldChange('discussion')}
              placeholder='다른 사람과 나누고 싶은 대화 주제를 입력해주세요.'
              theme={reviewFields.theme}
            />

            <FreeformEditor
              value={reviewFields.freeform}
              onChange={handleFieldChange('freeform')}
              theme={reviewFields.theme}
            />

            <div className='flex gap-4 justify-end'>
              <button
                onClick={handleTempSave}
                className='px-7 py-2 text-gray-600 bg-gray-200 rounded-[10px] drop-shadow-logo'>
                임시저장
              </button>
              <button
                onClick={() => {
                  if (!isValidReview()) {
                    showToast(
                      '제목이나 내용을 깜빡한 것 같아요! ʕ ´•̥̥̥ ᴥ•̥̥̥`ʔ',
                      'error',
                    );
                    return;
                  }
                  if (!isSubmitting) {
                    handleSave();
                  }
                }}
                className={`px-7 py-2 text-white transition-colors rounded-[10px] drop-shadow-logo hover:opacity-80 active:bg-white ${
                  !isValidReview() || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : ''
                }`}
                style={{
                  backgroundColor:
                    !isValidReview() || isSubmitting
                      ? undefined
                      : BOOK_THEME[reviewFields.theme ?? 'BLUE'].primary,
                  color:
                    document.activeElement === document.querySelector(':active')
                      ? BOOK_THEME[reviewFields.theme ?? 'BLUE'].primary
                      : 'white',
                }}>
                {isSubmitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* 실시간 뷰어 영역 */}
      <article className='overflow-x-hidden w-1/2 h-full'>
        <BookReviewDisplay
          mode='preview'
          previewData={reviewFields}
        />
      </article>
    </section>
  );
};

export default BookEditorPage;
