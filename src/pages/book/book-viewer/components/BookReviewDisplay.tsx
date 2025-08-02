// react
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// constants
import { BOOK_THEME, BookThemeType } from '@/constants/bookTheme';

// api
import { bookAPI } from '@apis/book';

// store
import { useToastStore } from '@/store/useToastStore';
import { useUserStore } from '@/store/useUserStore';

// types
import { BookReviewData } from '@/types/book';

// components
import { BookHeader } from './BookHeader';
import { BookInfo } from './BookInfo';
import { ReviewContent } from './ReviewContent';
import ConfirmModal from '@/components/ConfirmModal';

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
  const { user } = useUserStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // view 모드일 때 사용할 데이터 fetch 로직
  // const [reviewData, setReviewData] = useState<BookReviewData | null>(null);

  useEffect(() => {
    if (mode === 'view' && userId && bookId) {
      // API 호출 로직 추가하기
    }
  }, [mode, userId, bookId]);

  // reviewFields를 useMemo로 최적화
  const reviewFields: ReviewField[] = useMemo(
    () => [
      { key: 'quote', title: '인상 깊은 구절' },
      { key: 'emotion', title: '그 때 나의 감정' },
      { key: 'reason', title: '책을 선택하게 된 계기' },
      { key: 'discussion', title: '다른 사람과 나누고 싶은 대화 주제' },
      { key: 'freeform', title: `${user.nickname}님의 서평` },
    ],
    [user.nickname],
  );

  // 실제 표시할 데이터 (preview 모드면 previewData 사용)
  const displayData = previewData; // mode와 상관없이 previewData 사용
  // console.log(displayData);
  if (!displayData) return null;

  const colors = BOOK_THEME[(displayData.theme as BookThemeType) || 'BLUE'];
  const headings = displayData.freeform
    ? extractHeadings(displayData.freeform)
    : [];

  const handleEdit = () => {
    if (!isMyReview) {
      showToast('아직 작성된 서평이 없네요... ʕ ´•̥ ᴥ•̥`ʔ', 'error');
      return;
    }
    navigate(`/book/${urlBookId}?mode=edit`);
  };

  const handleDelete = async () => {
    if (!urlBookId) return;

    if (!isMyReview) {
      showToast('아직 작성된 서평이 없네요... ʕ ´•̥ ᴥ•̥`ʔ', 'error');
      return;
    }

    try {
      await bookAPI.deleteReview(urlBookId);
      showToast('서평이 삭제되었어요!', 'success');
      navigate(`/bookCase/${user.userId}`);
    } catch (error) {
      console.error('서평 삭제 중 오류 발생:', error);
      showToast('서평 삭제에 실패했습니다 ꌩ-ꌩ', 'error');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // URL 패턴으로 내 서평인지 판단
  const pathParts = window.location.pathname.split('/');
  const isMyReview = !(
    pathParts.includes('book') && pathParts.includes('user')
  );

  return (
    <div
      className='overflow-y-auto overflow-x-hidden relative h-full scrollbar'
      style={{ scrollBehavior: 'smooth' }}>
      <BookHeader
        title={displayData.title}
        reviewFields={reviewFields}
        headings={headings}
        colors={colors}
        reviewData={displayData}
      />

      <article
        className='absolute flex flex-col w-full gap-4 rounded-tl-[80px] top-[70%] min-h-[30%] px-24 py-16 overflow-x-hidden max-[1200px]:px-16 max-[1200px]:py-12'
        style={{
          backgroundColor: `${colors.surface}`,
          scrollBehavior: 'smooth',
        }}>
        <BookInfo
          publishedDate={displayData.publishedDate}
          bookTitle={displayData.bookTitle}
          author={displayData.author}
          genreNames={displayData.genreNames}
          colors={colors}
        />

        <ReviewContent
          reviewFields={reviewFields}
          reviewData={displayData}
          colors={colors}
          mode={mode}
          onEdit={handleEdit}
          onDelete={() => setIsDeleteModalOpen(true)}
          isMyReview={isMyReview}
        />
      </article>

      {isDeleteModalOpen && (
        <ConfirmModal
          title='서평 삭제'
          subTitle='정말로 이 서평을 삭제하시겠습니까?'
          onConfirm={handleDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookReviewDisplay;
