import { memo } from 'react';
import { BookReviewData } from '@/types/book';
import { BOOK_THEME, BookThemeType } from '@/constants/bookTheme';
import scrollDownIcon from '@assets/book/scroll-down-icon.svg';
import { formatToKoreanDateTime } from '@/utils/dateFormat';

interface ReviewContentProps {
  reviewData: BookReviewData;
  colors: (typeof BOOK_THEME)[BookThemeType];
  mode: 'preview' | 'view';
  onEdit: () => void;
  onDelete: () => void;
  isMyReview?: boolean;
  nickname: string;
}

// 개별 필드 컴포넌트들
const QuoteSection = memo(
  ({
    content,
    colors,
  }: {
    content: string;
    colors: (typeof BOOK_THEME)[BookThemeType];
  }) => (
    <div
      id='section-quote'
      className='mb-6'>
      <h2
        className='mb-2 text-2xl font-semibold max-sm:text-xl'
        style={{ color: colors.primary }}>
        인상 깊은 구절
      </h2>
      <p
        className='text-lg whitespace-pre-wrap max-sm:text-base'
        style={{ color: colors.secondary }}>
        {content}
      </p>
    </div>
  ),
);

const EmotionSection = memo(
  ({
    content,
    colors,
  }: {
    content: string;
    colors: (typeof BOOK_THEME)[BookThemeType];
  }) => (
    <div
      id='section-emotion'
      className='mb-6'>
      <h2
        className='mb-2 text-2xl font-semibold max-sm:text-xl'
        style={{ color: colors.primary }}>
        그 때 나의 감정
      </h2>
      <p
        className='text-lg whitespace-pre-wrap max-sm:text-base'
        style={{ color: colors.secondary }}>
        {content}
      </p>
    </div>
  ),
);

const ReasonSection = memo(
  ({
    content,
    colors,
  }: {
    content: string;
    colors: (typeof BOOK_THEME)[BookThemeType];
  }) => (
    <div
      id='section-reason'
      className='mb-6'>
      <h2
        className='mb-2 text-2xl font-semibold max-sm:text-xl'
        style={{ color: colors.primary }}>
        책을 선택하게 된 계기
      </h2>
      <p
        className='text-lg whitespace-pre-wrap max-sm:text-base'
        style={{ color: colors.secondary }}>
        {content}
      </p>
    </div>
  ),
);

const DiscussionSection = memo(
  ({
    content,
    colors,
  }: {
    content: string;
    colors: (typeof BOOK_THEME)[BookThemeType];
  }) => (
    <div
      id='section-discussion'
      className='mb-6'>
      <h2
        className='mb-2 text-2xl font-semibold max-sm:text-xl'
        style={{ color: colors.primary }}>
        다른 사람과 나누고 싶은 대화 주제
      </h2>
      <p
        className='text-lg whitespace-pre-wrap max-sm:text-base'
        style={{ color: colors.secondary }}>
        {content}
      </p>
    </div>
  ),
);

const FreeformSection = memo(
  ({
    content,
    colors,
    nickname,
  }: {
    content: string;
    colors: (typeof BOOK_THEME)[BookThemeType];
    nickname: string;
  }) => (
    <div
      id='section-freeform'
      className='mb-6'>
      <h2
        className='mb-2 text-2xl font-semibold'
        style={{ color: colors.primary }}>
        {nickname}님의 서평
      </h2>
      <div
        className='prose-sm prose'
        style={{ color: colors.secondary }}
        dangerouslySetInnerHTML={{
          __html:
            content?.replace(
              /<(h[2-5])>/g,
              (_, tag) => `<${tag} id="heading-$1">`,
            ) || '',
        }}
      />
    </div>
  ),
);

export const ReviewContent = ({
  reviewData,
  colors,
  mode,
  onEdit,
  onDelete,
  isMyReview = true,
  nickname,
}: ReviewContentProps) => (
  <>
    <div className='items-end py-8 mb-12 item-between'>
      <p
        className='text-sm '
        style={{ color: `${colors.primary}80` }}>
        {formatToKoreanDateTime(
          reviewData.writeDateTime ||
            new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString(),
        )}
      </p>
      <button
        onClick={() => {
          const section = document.getElementById('section-quote');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className='gap-2 px-5 py-1.5 text-lg border-2 rounded-full item-middle max-sm:text-base max-sm:px-4 max-sm:py-1'
        style={{
          borderColor: colors.primary,
          color: colors.primary,
        }}>
        Scroll Down
        <img
          src={scrollDownIcon}
          alt='scroll-down-icon'
        />
      </button>
    </div>

    {/* 개별 필드 컴포넌트들로 분리 */}
    {reviewData.quote && (
      <QuoteSection
        content={reviewData.quote}
        colors={colors}
      />
    )}

    {reviewData.emotion && (
      <EmotionSection
        content={reviewData.emotion}
        colors={colors}
      />
    )}

    {reviewData.reason && (
      <ReasonSection
        content={reviewData.reason}
        colors={colors}
      />
    )}

    {reviewData.discussion && (
      <DiscussionSection
        content={reviewData.discussion}
        colors={colors}
      />
    )}

    {reviewData.freeform && (
      <FreeformSection
        content={reviewData.freeform}
        colors={colors}
        nickname={nickname}
      />
    )}

    {mode === 'view' && isMyReview && (
      <div className='gap-3 mt-8 item-middle'>
        <button
          onClick={onEdit}
          className='px-4 py-2 text-sm transition-colors rounded-full hover:opacity-80 font-medium'
          style={{
            backgroundColor: `${colors.secondary}20`,
            color: colors.secondary,
          }}>
          수정
        </button>
        <button
          onClick={onDelete}
          className='px-4 py-2 text-sm transition-colors rounded-full hover:opacity-80 font-medium'
          style={{
            backgroundColor: `${colors.secondary}20`,
            color: colors.secondary,
          }}>
          삭제
        </button>
      </div>
    )}
  </>
);
