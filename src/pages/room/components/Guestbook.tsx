import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { guestbookAPI } from '../../../apis/guestbook';
import { useToastStore } from '../../../store/useToastStore';
import { useUserStore } from '../../../store/useUserStore';
import Pagination from '../../../components/Pagination';
import GuestbookMessage from '@pages/room/components/GuestbookMessage';
import GusetbookInput from '@pages/room/components/GusetbookInput';
import { useAutoBackofficeTracking } from '@/hooks/useBackofficeBatchTracking';

export default function Guestbook({
  onClose,
  ownerName,
  ownerId,
}: GuestbookProps) {
  const { showToast } = useToastStore();
  const [guestbookData, setGuestbookData] = useState<GuestbookMessageType[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const user = useUserStore((state) => state.user);

  useAutoBackofficeTracking(
    'guestbook_viewing',
    user?.userId?.toString(),
    2000,
  );

  const fetchGuestbookData = useCallback(
    async (page: number) => {
      try {
        const response = await guestbookAPI.getGuestbook(ownerId, page, 2);
        setGuestbookData(response.guestbook || []);
        setTotalPage(response.pagination?.totalPages);
      } catch (error) {
        console.error('방명록 조회 중 오류:', error);
        setGuestbookData([]);
      }
    },
    [ownerId],
  );

  useEffect(() => {
    fetchGuestbookData(currentPage);
  }, [fetchGuestbookData, currentPage]);

  const handleSubmitMessage = async (guestMessage: string) => {
    if (guestMessage.trim() === '') return;

    try {
      const response = await guestbookAPI.createGuestbook(
        ownerId,
        user.userId,
        guestMessage,
      );
      showToast('방명록 등록 완료! 멋진 한마디, 잘 전달되었어요!', 'success');
      setGuestbookData(response.guestbook || []);
      setTotalPage(response.pagination?.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error('방명록 등록 중 오류 발생:', error);
      showToast(
        '방명록을 등록하는 데 실패했어요. 다시 시도해 주세요!',
        'error',
      );
      setGuestbookData([]);
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteGuestbook = () => {
    if (guestbookData.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else {
      fetchGuestbookData(currentPage);
    }
  };

  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100vh', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 18 }}
      onClick={handleClickOutside}
      className='fixed inset-0 z-10 flex items-center justify-center'>
      <div className='@container relative w-[95vw] h-[95vw] max-w-none max-h-none min-w-0 min-h-0 sm:w-[calc(100vw*0.3966)] sm:max-w-[800px] sm:h-[calc(100vw*0.3611)] sm:max-h-[700px] sm:min-w-[600px] sm:min-h-[550px] max-[560px]:h-[100vw]'>
        {/* 뒤 배경 */}
        <div className='guest-book-background bottom-[-30px] absolute w-full h-full bg-[#73A1F7] max-sm:max-h-[45.875vw] max-sm:min-h-[45.875vw] !rounded-[50px] sm:!rounded-[60px] border-2 border-[#2656CD]'></div>

        {/* 스프링 요소 - 왼쪽 */}
        <div className='spring-left-first !left-[calc(50%-230px)] sm:!left-[calc(50%-248px)]'>
          <div className='spring-element' />
        </div>
        <div className='spring-left-second !left-[calc(50%-180px)] sm:!left-[calc(50%-198px)]'>
          <div className='spring-element' />
        </div>

        {/* 스프링 요소- 오른쪽 */}
        <div className='spring-right-first !right-[calc(50%-230px)] sm:!right-[calc(50%-248px)]'>
          <div className='spring-element' />
        </div>
        <div className='spring-right-second !right-[calc(50%-180px)] sm:!right-[calc(50%-198px)]'>
          <div className='spring-element' />
        </div>

        {/* 메인 배경 */}
        <section className='guest-book flex-col items-center pt-6 sm:pt-10 @2xl:pt-15 px-6 sm:px-13 @2xl:px-16 @3xl:gap-4 max-sm:rounded-[60px] max-sm:!w-full max-[560px]:h-[100vw]'>
          {/* 방명록 컨텐츠 */}
          <span className='flex gap-2 font-bold text-2xl @xl:text-3xl @2xl:text-4xl @2xl:my-3'>
            <p className='text-[#4983EF]'>{ownerName}</p>
            <p className='text-[#3E507D]'>님의 방명록</p>
          </span>
          {/* 방명록 글 */}
          <GuestbookMessage
            ownerId={ownerId}
            messages={guestbookData}
            userId={user.userId}
            refetchGuestbook={() => fetchGuestbookData(currentPage)}
            onDelete={handleDeleteGuestbook}
          />
          {/* 작성 필드 */}
          <GusetbookInput onSubmitMessage={handleSubmitMessage} />
          {/* 페이제네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={handlePageChange}
            color='#73A1F7'
          />
        </section>
      </div>
    </motion.div>
  );
}
