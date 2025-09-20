import { BookReviewData } from '@/types/book';
import { BOOK_THEME, BookThemeType } from '@/constants/bookTheme';

interface BookHeaderProps {
  title: string;
  headings: Array<{ id: string; level: number; text: string }>;
  colors: (typeof BOOK_THEME)[BookThemeType];
  reviewData: BookReviewData;
}

export const BookHeader = ({
  title,
  headings,
  colors,
  reviewData,
}: BookHeaderProps) => (
  <div className='py-12 flex justify-between items-start px-14 w-full max-[1200px]:flex-col max-[1200px]:p-8'>
    <h1
      className={`mb-8 font-semibold transition-all duration-300 max-sm:text-4xl ${
        title?.length > 10 ? 'text-4xl' : 'text-6xl'
      }`}
      style={{ color: colors.primary }}>
      {title}
    </h1>
    <ul className='flex flex-col items-end justify-start gap-2 shrink-0 max-[1200px]:items-start'>
      <li
        className='text-lg font-semibold'
        style={{ color: colors.primary }}>
        목차
      </li>
      {reviewData.quote && (
        <li
          className='text-sm'
          style={{ color: colors.primary }}>
          <a href='#section-quote'>인상 깊은 구절</a>
        </li>
      )}
      {reviewData.emotion && (
        <li
          className='text-sm'
          style={{ color: colors.primary }}>
          <a href='#section-emotion'>그 때 나의 감정</a>
        </li>
      )}
      {reviewData.reason && (
        <li
          className='text-sm'
          style={{ color: colors.primary }}>
          <a href='#section-reason'>책을 선택하게 된 계기</a>
        </li>
      )}
      {reviewData.discussion && (
        <li
          className='text-sm'
          style={{ color: colors.primary }}>
          <a href='#section-discussion'>다른 사람과 나누고 싶은 대화 주제</a>
        </li>
      )}
      {reviewData.freeform && (
        <li
          className='text-sm'
          style={{ color: colors.primary }}>
          <a href='#section-freeform'>자유 형식</a>
        </li>
      )}
      {headings.map(({ id, level, text }) => (
        <li
          key={id}
          className='text-sm'
          style={{
            color: colors.primary,
            paddingLeft: `${(level - 2) * 1}rem`,
          }}>
          <a href={`#${id}`}>{text}</a>
        </li>
      ))}
    </ul>
  </div>
);
