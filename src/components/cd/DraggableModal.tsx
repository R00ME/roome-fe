import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import ModalPortal from '../ModalPortal';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

interface DraggableModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function DraggableModal({
  onClose,
  children,
}: DraggableModalProps) {
  const isMobile = useIsMobile();

  return (
    <ModalPortal>
      <div className='fixed inset-0 z-[80] flex items-end md:items-center justify-center'>
        {isMobile ? (
          // === 모바일: 바텀시트 ===
          <div
            className='relative w-full bg-white/80 backdrop-blur-2xl
              border border-white/20 rounded-t-3xl shadow-lg
              p-5 sm:p-8 max-h-[80vh] overflow-y-auto'>
            {children}
          </div>
        ) : (
          // === PC: 드래그 가능한 윈도우 창 ===
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={{ left: -500, right: 500, top: -200, bottom: 200 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className='relative pointer-events-auto 
              max-w-[80%] min-h-[120px] md:min-h-[140px] 
              backdrop-blur-2xl bg-gradient-to-b from-[#ffffff]/10 to-[#b1bad5]/40
              border border-white/20 rounded-2xl shadow-xl p-6'>
            <div className='flex justify-between items-center mb-2'>
              <button
                onClick={onClose}
                className='text-white/60 hover:text-white'>
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </div>
    </ModalPortal>
  );
}
