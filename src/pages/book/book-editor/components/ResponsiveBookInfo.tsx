import { memo } from 'react';
import { BOOK_THEME } from '@/constants/bookTheme';

interface ResponsiveBookInfoProps {
  bookTitle: string;
  author: string;
  genreNames: string[];
  publishedDate: string;
  imageUrl: string;
  theme: string;
}

const ResponsiveBookInfo = memo(
  ({
    bookTitle,
    author,
    genreNames,
    publishedDate,
    imageUrl,
    theme,
  }: ResponsiveBookInfoProps) => {
    const colors = BOOK_THEME[theme ?? 'BLUE'];
    return (
      <div className='hidden max-[1024px]:block'>
        <div
          className='flex items-start gap-4 py-4 px-8'
          style={{
            backgroundColor: `${BOOK_THEME[theme ?? 'BLUE'].secondary}10`,
          }}>
          <img
            src={imageUrl}
            alt={bookTitle}
            className='w-18 h-auto object-cover rounded-md shadow-sm'
          />
          <div className='flex-1 flex flex-col'>
            <div className='flex items-center flex-wrap gap-1 mb-1'>
              <h2
                className='text-lg font-semibold'
                style={{
                  color: BOOK_THEME[theme ?? 'BLUE'].primary,
                }}>
                {bookTitle}
              </h2>
              <span className='text-gray-400'>|</span>
              <p className='text-sm text-gray-600'>{author}</p>
            </div>
            <span
              className='text-lg font-medium mb-1'
              style={{ color: `${colors.primary}` }}>
              {publishedDate?.split('-')[0]}
            </span>
            <div className='flex flex-wrap gap-1'>
              {genreNames.map((genre, index) => (
                <span
                  key={index}
                  className='px-2 py-1 text-xs rounded-full'
                  style={{
                    backgroundColor: `${
                      BOOK_THEME[theme ?? 'BLUE'].secondary
                    }30`,
                    color: BOOK_THEME[theme ?? 'BLUE'].primary,
                  }}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ResponsiveBookInfo;
