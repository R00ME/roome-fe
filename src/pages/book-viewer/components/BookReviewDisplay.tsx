import { bookAPI } from '@apis/book';
import React, { useState, useEffect } from 'react';
import { BOOK_THEME, BookThemeType } from '@/constants/bookTheme';
import { useNavigate, useParams } from 'react-router-dom';
import { useToastStore } from '@/store/useToastStore';
import { BookReviewData } from '@/types/book';
import { BookHeader } from './BookHeader';
import { BookInfo } from './BookInfo';
import { ReviewContent } from './ReviewContent';

interface BookReviewDisplayProps {
  mode: 'preview' | 'view';
  // preview 모드일 때는 실시간 데이터를 직접 받음
  previewData?: BookReviewData;
  // view 모드일 때는 userId와 bookId로 데이터를 조회
  userId?: string;
  bookId?: string;
}

interface ReviewField {
  key: keyof BookReviewData;
  title: string;
}

// const review = await bookAPI.getBookDetail('1');
// const review = await bookAPI.getReview('1');

const REVIEW_FIELDS: ReviewField[] = [
  { key: 'quote', title: '인상 깊은 구절' },
  { key: 'emotion', title: '그 때 나의 감정' },
  { key: 'reason', title: '책을 선택하게 된 계기' },
  { key: 'discussion', title: '다른 사람과 나누고 싶은 대화 주제' },
];

const extractHeadings = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = doc.querySelectorAll('h2, h3, h4, h5');

  return Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;
    return {
      id,
      level: parseInt(heading.tagName.substring(1)),
      text: heading.textContent || '',
    };
  });
};

const BookReviewDisplay = ({
  mode,
  previewData,
  userId,
  bookId,
}: BookReviewDisplayProps) => {
  const navigate = useNavigate();
  const { bookId: urlBookId } = useParams();
  const showToast = useToastStore((state) => state.showToast);
  // view 모드일 때 사용할 데이터 fetch 로직
  const [reviewData, setReviewData] = useState<BookReviewData | null>(null);

  useEffect(() => {
    if (mode === 'view' && userId && bookId) {
      // API 호출 로직 추가하기
    }
  }, [mode, userId, bookId]);

  // 실제 표시할 데이터 (preview 모드면 previewData 사용)
  const displayData = previewData; // mode와 상관없이 previewData 사용
  console.log(displayData);
  if (!displayData) return null;

  const colors = BOOK_THEME[(displayData.theme as BookThemeType) || 'BLUE'];
  const headings = displayData.freeform
    ? extractHeadings(displayData.freeform)
    : [];

  const handleEdit = () => {
    navigate(`/book/${urlBookId}?mode=edit`);
  };

  const handleDelete = async () => {
    if (!urlBookId || !window.confirm('서평을 삭제하시겠습니까?')) return;

    try {
      await bookAPI.deleteReview(urlBookId);
      showToast('서평이 삭제되었습니다.', 'success');
      navigate(`/bookCase/${userId}`);
    } catch (error) {
      console.error('서평 삭제 중 오류 발생:', error);
      showToast('서평 삭제에 실패했습니다.', 'error');
    }
  };

  return (
    <div className='relative h-full overflow-auto'>
      <BookHeader
        title={displayData.title}
        reviewFields={REVIEW_FIELDS}
        headings={headings}
        colors={colors}
      />

      <article
        className='absolute flex flex-col w-full gap-4 rounded-tl-[80px] top-[70%] min-h-[30%] px-24 py-16'
        style={{ backgroundColor: `${colors.surface}` }}>
        <BookInfo
          publishedDate={displayData.publishedDate}
          bookTitle={displayData.bookTitle}
          author={displayData.author}
          genreNames={displayData.genreNames}
          colors={colors}
        />

        <ReviewContent
          reviewFields={REVIEW_FIELDS}
          reviewData={displayData}
          colors={colors}
          mode={mode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </article>
    </div>
  );
};

export default BookReviewDisplay;
