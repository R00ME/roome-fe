import goPrevPage from '@assets/cd/go-prev-page.svg';
import goNextPage from '@assets/cd/go-next-page.svg';
import goFirstPage from '@assets/cd/go-first-page.svg';
import goLastPage from '@assets/cd/go-last-page.svg';

interface Pagination {
  currentPage: number;
  totalPage: number;
  onChangePage: (value: number) => void;
  color?: string;
}

export default function Pagination({
  currentPage,
  totalPage,
  onChangePage,
  color,
}: Pagination) {
  console.log('Pagination 컴포넌트 props:', { currentPage, totalPage, color });

  const startNum = Math.max(currentPage - 1, 1);
  const endNum = Math.min(currentPage + 1, totalPage);
  const pageNumberArr = Array.from(
    { length: endNum - startNum + 1 },
    (_, index) => startNum + index,
  );

  console.log('계산된 페이지 범위:', { startNum, endNum, pageNumberArr });

  return (
    <div className='w-full gap-3 py-4 item-middle '>
      <button
        disabled={currentPage === 1}
        onClick={() => onChangePage(1)}
        className='w-8 h-8 transition-all duration-300 bg-white rounded-lg item-middle hover:bg-gray-100'>
        <img
          src={goFirstPage}
          alt='첫 페이지로 가는 버튼'
          className='w-4 h-4'
        />
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
        className='w-8 h-8 transition-all duration-300 bg-white rounded-lg item-middle hover:bg-gray-100'>
        <img
          src={goPrevPage}
          alt='이전 페이지로 가는 버튼'
          className='w-4 h-4'
        />
      </button>
      {pageNumberArr.map((page, index) => (
        <button
          style={{
            backgroundColor: currentPage === page ? color : 'transparent',
          }}
          className={`p-2 rounded-lg w-8 h-8 item-middle transition-all duration-300 ${
            currentPage === page
              ? 'text-white'
              : 'text-[#292929] hover:bg-gray-100'
          }`}
          onClick={() => onChangePage(page)}
          key={index}>
          {page}
        </button>
      ))}
      {currentPage + 1 < totalPage && <p>...</p>}
      {currentPage + 1 < totalPage && <p>{totalPage}</p>}

      <button
        disabled={currentPage === totalPage}
        onClick={() => onChangePage(currentPage + 1)}
        className='w-8 h-8 transition-all duration-300 bg-white rounded-lg item-middle hover:bg-gray-100'>
        <img
          src={goNextPage}
          alt='다음 페이지로 가는 버튼'
          className='w-4 h-4'
        />
      </button>
      <button
        disabled={currentPage === totalPage}
        onClick={() => onChangePage(totalPage)}
        className='w-8 h-8 transition-all duration-300 bg-white rounded-lg item-middle hover:bg-gray-100'>
        <img
          src={goLastPage}
          alt='마지막 페이지로 가는 버튼'
          className='w-4 h-4'
        />
      </button>
    </div>
  );
}
