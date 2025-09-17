import React from 'react';
import { motion } from 'framer-motion';
import GuestBookBg from '@assets/guest-book.svg?react';

interface GuestbookMobileProps {
  children: React.ReactNode;
  onClickOutside: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const GuestbookMobile = ({
  children,
  onClickOutside,
}: GuestbookMobileProps) => {
  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100vh', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 18 }}
      onClick={onClickOutside}
      className='fixed inset-0 z-10 flex items-center justify-center'>
      <div className='relative w-[min(95vw,420px)] aspect-[320/447]'>
        <GuestBookBg className='absolute inset-0 w-full h-full' />
        <div className='relative z-10 w-full h-full flex flex-col items-center justify-start px-5 py-6'>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default GuestbookMobile;
