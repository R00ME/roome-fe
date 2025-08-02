import { useCallback, useEffect, useRef } from 'react';
import { BookReviewData } from '@/types/book';

interface UseBookReviewAutoSaveProps {
  bookId: string | undefined;
  reviewData: BookReviewData;
  autoSaveInterval?: number; // 기본값 5초
}

/**
 * 서평 데이터의 자동 저장 기능을 제공하는 커스텀 훅
 * 세션 스토리지를 사용하여 브라우저 세션 동안만 데이터 유지
 */
export const useBookReviewAutoSave = ({
  bookId,
  reviewData,
  autoSaveInterval = 5000,
}: UseBookReviewAutoSaveProps) => {
  // 최신 reviewData를 참조하기 위한 ref
  const reviewDataRef = useRef(reviewData);
  
  // reviewData가 변경될 때마다 ref 업데이트
  useEffect(() => {
    reviewDataRef.current = reviewData;
  }, [reviewData]);

  // 자동 저장 함수
  const autoSave = useCallback(() => {
    if (!bookId) return;
    sessionStorage.setItem(
      `draft-review-${bookId}`,
      JSON.stringify(reviewDataRef.current),
    );
  }, [bookId]);

  // 수동 임시저장
  const handleTempSave = useCallback(() => {
    autoSave();
    return true; // 성공 여부 반환
  }, [autoSave]);

  // 지정된 간격마다 자동저장
  useEffect(() => {
    const timer = setInterval(autoSave, autoSaveInterval);
    return () => clearInterval(timer);
  }, [autoSave, autoSaveInterval]);

  // 컴포넌트 언마운트 시 자동저장
  useEffect(() => {
    return () => {
      autoSave();
    };
  }, [autoSave]);

  return {
    autoSave,
    handleTempSave,
  };
};
