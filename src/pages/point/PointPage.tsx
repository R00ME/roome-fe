import { useUserStore } from '@/store/useUserStore';
import { getPointBalance, getPointHistory } from '@apis/point';
import receipt from '@assets/point/receipt.svg';
import coin from '@assets/point/coin.svg';

import LayeredButton from '@components/LayeredButton';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useWindowSize } from '@/hooks/useWindowSize';
import PointHistory from './components/PointHistory';

export default function PointPage() {
  const navigate = useNavigate();
  const [pointBalance, setPointBalance] = useState(0);
  const { isMobile } = useWindowSize();

  const userId = Number(useParams().userId);
  const myUserId = useUserStore((state) => state.user).userId;

  const { ref, inView } = useInView();

  // useInfiniteQuery
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['points', userId],
      queryFn: async ({ pageParam }) => {
        return pageParam.dayCursor
          ? fetchPointsHistory(pageParam?.itemCursor, pageParam.dayCursor)
          : fetchPointsHistory(pageParam?.itemCursor);
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.nextItemCursor > lastPage.lastId) {
          return {
            itemCursor: lastPage.nextItemCursor,
            dayCursor: lastPage.nextDayCursor,
          };
        }
        return undefined;
      },
      initialPageParam: { itemCursor: 0, dayCursor: '' },
      staleTime: 1000 * 60 * 1, // 1분
    });

  useEffect(() => {
    const fetchPointBalance = async () => {
      try {
        const { balance } = await getPointBalance(userId);
        setPointBalance(balance);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPointBalance();
  }, [userId]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const fetchPointsHistory = useCallback(
    async (itemCursor: number, dayCursor?: string) => {
      return dayCursor
        ? await getPointHistory(20, itemCursor, dayCursor)
        : await getPointHistory(20, itemCursor);
    },
    [],
  );

  if (userId !== myUserId) {
    navigate(`/profile/${userId}`);
  }
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      navigate(-1);
    }
  };

  return (
    <div className='w-full h-screen main-background'>
      {/* 메인 배경 */}
      <motion.div
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100vh', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18 }}
        onClick={handleClickOutside}
        className='fixed inset-0 z-10 flex items-center justify-center'>
        {/* 영수증 */}
        <div
          className={`relative ${
            isMobile
              ? 'w-[min(95vw,420px)] aspect-[400/650]'
              : 'w-[400px] aspect-[400/650]'
          }`}>
          <div
            style={{ backgroundImage: `url(${receipt})` }}
            className='w-full h-full bg-contain bg-no-repeat bg-center flex flex-col items-center gap-4 p-10'>
            <h1 className=' text-[#3E507D] text-3xl font-bold py-4'>
              Point Receipt
            </h1>

            {isLoading ? (
              <div className='w-full h-[400px] flex items-center justify-center'>
                <p className='text-gray-500 animate-pulse'>로딩 중...</p>
              </div>
            ) : (
              <PointHistory
                data={data}
                isFetching={isFetching}
                ref={ref}
              />
            )}

            <div className='w-full'>
              <div className='flex justify-between items-center mb-6 '>
                <p className='text-[#162C63] font-medium text-sm'>
                  포인트 잔고
                </p>

                <div className='flex items-center gap-1'>
                  <img
                    src={coin}
                    alt='코인 이미지'
                    className='w-4 h-4'
                  />
                  <p className='text-[#162C63] text-sm font-medium'>
                    {pointBalance ? pointBalance.toLocaleString('ko-KR') : '0'}
                  </p>
                </div>
              </div>

              {/* <div className='flex flex-col items-center gap-2'>
                <LayeredButton
                  theme='blue'
                  containerClassName='w-fit'
                  className='font-bold w-[160px] h-[40px] py-1.5'
                  disabled={isLoading}
                  onClick={() => navigate('/payment')}>
                  포인트 충전하기
                </LayeredButton>

                <button
                  className='text-sm text-[#3E507D]/30 mt-2'
                  onClick={() => navigate('/payment/refund')}>
                  포인트 환불하기
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
