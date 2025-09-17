import React from 'react';
import { motion } from 'framer-motion';
import GuestBookBg from '@assets/guest-book.svg?react';
import GuestbookMobileMessage from './GuestbookMobileMessage';
import GusetbookMobileInput from './GusetbookMobileInput';
import Pagination from '../../../components/Pagination';

interface GuestbookMobileProps {
  onClickOutside: (e: React.MouseEvent<HTMLDivElement>) => void;
  ownerName: string;
  ownerId: number;
  userId: number;
  messages: GuestbookMessageType[];
  refetchGuestbook: () => void;
  onDelete: () => void;
  onSubmitMessage: (guestMessage: string) => void;
  currentPage: number;
  totalPage: number;
  onChangePage: (page: number) => void;
}

const GuestbookMobile = ({
  onClickOutside,
  ownerName,
  ownerId,
  userId,
  messages,
  refetchGuestbook,
  onDelete,
  onSubmitMessage,
  currentPage,
  totalPage,
  onChangePage,
}: GuestbookMobileProps) => {
  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100vh', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 18 }}
      onClick={onClickOutside}
      className='fixed inset-0 z-10 flex items-center justify-center'>
      <div className='relative w-[min(95vw,420px)] aspect-[320/447] mt-20'>
        <GuestBookBg className='absolute inset-0 w-full h-full' />
        <div className='relative z-10 w-full h-full flex flex-col items-center justify-start px-5 py-10 gap-4'>
          <p className='flex gap-2 font-bold text-xl pt-4'>
            <span className='text-[#4983EF]'>{ownerName}</span>
            <span className='text-[#3E507D]'>님의 방명록</span>
          </p>
          <GuestbookMobileMessage
            ownerId={ownerId}
            messages={messages}
            userId={userId}
            refetchGuestbook={refetchGuestbook}
            onDelete={onDelete}
          />
          <GusetbookMobileInput onSubmitMessage={onSubmitMessage} />
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={onChangePage}
            color='#73A1F7'
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GuestbookMobile;
