import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import ProfileCardBg from '@/assets/profile-card/profile-card.svg?react';

interface MobileProfileCardProps extends PropsWithChildren {
  onClickOutside?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  containerClassName?: string;
  backgroundClassName?: string;
}

export const MobileProfileCard = ({
  children,
  onClickOutside,
  className,
  containerClassName,
  backgroundClassName,
}: MobileProfileCardProps) => {
  return (
    <div className='w-full h-screen main-background'>
      <motion.div
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100vh', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18 }}
        onClick={onClickOutside}
        className='fixed inset-0 z-10 flex items-center justify-center'>
        <div
          className={twMerge(
            'relative w-[95vw] max-w-[420px] aspect-[320/430] mt-20',
            containerClassName,
          )}>
          <ProfileCardBg
            className={twMerge('w-full h-full', backgroundClassName)}
          />
          <section
            className={twMerge(
              'absolute inset-0 flex flex-col gap-4 items-center justify-around py-10 px-6 max-sm:gap-1',
              className,
            )}>
            {children}
          </section>
        </div>
      </motion.div>
    </div>
  );
};
