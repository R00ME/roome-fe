import { BOOK_THEME } from '@/constants/bookTheme';

interface ReviewTitleInputProps {
  value: string;
  theme: string;
  onChange: (value: string) => void;
}

const ReviewTitleInput = ({
  value,
  theme,
  onChange,
}: ReviewTitleInputProps) => {
  return (
    <input
      type='text'
      maxLength={25}
      required
      placeholder='제목을 입력해주세요...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`overflow-hidden py-4 w-full text-4xl max-[1024px]:text-2xl font-semibold focus:outline-none placeholder:text-opacity-40 text-ellipsis`}
      style={{
        borderBottomWidth: '2px',
        borderBottomColor: `${BOOK_THEME[theme ?? 'BLUE'].secondary}33`,
        color: BOOK_THEME[theme ?? 'BLUE'].primary,
      }}
    />
  );
};

export default ReviewTitleInput;
