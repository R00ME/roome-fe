import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalPosition } from '../hooks/useModalPosition';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { CloseButton } from './CloseButton';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  title: string;
  children: React.ReactNode;
  className?: string;
  modalType?: 'notification' | 'housemate';
}

const getModalTheme = (type: 'notification' | 'housemate') => {
  switch (type) {
    case 'housemate':
      return {
        titleColor: 'text-[#D8297B]',
        bgColor: 'bg-[#FCF7FD]',
      };
    case 'notification':
    default:
      return {
        titleColor: 'text-[#162C63]',
        bgColor: 'bg-[#FCF7FD]',
      };
  }
};

export const BaseModal = ({
  isOpen,
  onClose,
  buttonRef,
  title,
  children,
  className = '',
  modalType = 'notification',
}: BaseModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { modalPosition } = useModalPosition({ buttonRef, isOpen });
  const { width } = useWindowSize();
  const theme = getModalTheme(modalType);
  const isMobile = width <= 640;

  useClickOutside({
    modalRef,
    buttonRef,
    isOpen,
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className={`fixed z-50 w-[420px] h-[80vh] max-sm:w-full max-sm:h-full max-sm:right-0 max-sm:top-0 p-3 border-2 border-white bg-white/30 backdrop-blur-lg rounded-3xl overflow-hidden ${className}`}
          style={{
            right: isMobile ? undefined : modalPosition,
            top: isMobile
              ? undefined
              : modalType === 'housemate'
              ? '80px'
              : '40px',
          }}
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 20 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}>
          <motion.div
            className='w-full h-full rounded-2xl'
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(8px)' }}
            transition={{ duration: 0.3 }}>
            <div
              className={`w-full h-full ${theme.bgColor} p-9 rounded-2xl overflow-hidden max-[376px]:p-6`}>
              <CloseButton onClose={onClose} />
              <h2 className={`text-2xl font-bold ${theme.titleColor} mb-6`}>
                {title}
              </h2>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
