import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '@/apis/book';
import { BookReviewData } from '@/types/book';
import { useToastStore } from '@/store/useToastStore';
import {
  isValidReview,
  transformReviewDataForAPI,
} from '@/utils/reviewValidation';

interface UseBookReviewProps {
  bookId: string | undefined;
  bookInfo: {
    bookTitle: string;
    author: string;
    genreNames: string[];
    publishedDate: string;
    imageUrl: string;
  };
  onComplete?: () => void;
}

/**
 * 서평 데이터 관리 및 API 호출 로직을 제공하는 커스텀 훅
 */
export const useBookReview = ({
  bookId,
  bookInfo,
  onComplete,
}: UseBookReviewProps) => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [reviewFields, setReviewFields] = useState<BookReviewData>(() => {
    // sessionStorage에서 임시저장 데이터 불러오기
    const savedData = sessionStorage.getItem(`draft-review-${bookId}`);
    if (savedData) {
      return JSON.parse(savedData);
    }

    return {
      // 도서 정보
      bookTitle: bookInfo.bookTitle,
      author: bookInfo.author,
      genreNames: bookInfo.genreNames,
      publishedDate: bookInfo.publishedDate,
      imageUrl: bookInfo.imageUrl,
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

  // 필드 변경 핸들러
  const handleFieldChange = useCallback(
    (field: keyof BookReviewData) => (value: string | BookReviewData) => {
      setReviewFields((prev) => {
        // 값이 실제로 변경된 경우에만 업데이트
        if (prev[field] === value) {
          return prev;
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [],
  );

  // 기존 서평 데이터 불러오기
  const fetchReview = useCallback(async () => {
    if (!bookId) return;

    try {
      const review = await bookAPI.getReview(bookId);
      if (review) {
        setHasExistingReview(true);
        setReviewFields({
          bookTitle: bookInfo.bookTitle,
          author: bookInfo.author,
          genreNames: bookInfo.genreNames,
          publishedDate: bookInfo.publishedDate,
          imageUrl: bookInfo.imageUrl,
          title: review.title,
          writeDateTime: review.writeDateTime,
          theme: review.coverColor,
          quote: review.quote,
          emotion: review.takeaway,
          reason: review.motivate,
          discussion: review.topic,
          freeform: review.freeFormText,
        });
      } else {
        setHasExistingReview(false);
      }
    } catch (error) {
      console.error('서평 조회 중 오류 발생:', error);
      setHasExistingReview(false);
    }
  }, [bookId, bookInfo]);

  // 서평 저장
  const handleSave = useCallback(async () => {
    if (!bookId || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!isValidReview(reviewFields)) {
        showToast('제목이나 내용을 깜빡한 것 같아요! ʕ ´•̥̥̥ ᴥ•̥̥̥`ʔ', 'error');
        return;
      }

      const reviewData = transformReviewDataForAPI(reviewFields);

      // API 호출 (수정 또는 새로 작성)
      if (hasExistingReview) {
        await bookAPI.updateReview(bookId, reviewData);
        showToast('서평 수정 완료!', 'success');
      } else {
        await bookAPI.addReview(bookId, reviewData);
        showToast('서평 등록 완료!', 'success');
      }

      // 공통 처리 로직
      sessionStorage.removeItem(`draft-review-${bookId}`);
      onComplete?.();
      navigate(`/book/${bookId}`, { replace: true });
    } catch (error) {
      console.error('서평 저장 중 오류 발생:', error);
      showToast('서평 저장에 실패했습니다 ꌩ-ꌩ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    bookId,
    isSubmitting,
    reviewFields,
    hasExistingReview,
    showToast,
    onComplete,
    navigate,
  ]);

  // 기존 서평 데이터 불러오기
  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  // 유효성 검사 함수 메모이제이션
  const isValidReviewResult = useMemo(
    () => isValidReview(reviewFields),
    [reviewFields],
  );

  // isValidReview 함수 메모이제이션
  const isValidReviewFunction = useCallback(
    () => isValidReviewResult,
    [isValidReviewResult],
  );

  return {
    reviewFields,
    isSubmitting,
    handleFieldChange,
    handleSave,
    isValidReview: isValidReviewFunction,
  };
};
