import { BookReviewData } from '@/types/book';

/**
 * 서평 데이터의 유효성을 검사합니다.
 * @param reviewData - 검사할 서평 데이터
 * @returns 유효성 여부
 */
export const isValidReview = (reviewData: BookReviewData): boolean => {
  // 제목은 필수
  if (!reviewData.title.trim()) {
    return false;
  }

  // 인상 깊은 구절, 감정, 계기, 대화 주제, 자유 형식 중 하나는 필수
  const hasRequiredField = [
    reviewData.quote,
    reviewData.emotion,
    reviewData.reason,
    reviewData.discussion,
    reviewData.freeform,
  ].some((field) => field.trim() !== '');

  return hasRequiredField;
};

/**
 * 서평 데이터를 API 형식으로 변환합니다.
 * @param reviewData - 변환할 서평 데이터
 * @returns API 형식의 서평 데이터
 */
export const transformReviewDataForAPI = (reviewData: BookReviewData) => {
  return {
    title: reviewData.title,
    quote: reviewData.quote,
    takeaway: reviewData.emotion,
    motivate: reviewData.reason,
    topic: reviewData.discussion,
    freeFormText: reviewData.freeform,
    coverColor: reviewData.theme,
  };
};
