import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAPI } from '@apis/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../../store/useUserStore';
import { useClickOutside } from '../../../hooks/useClickOutside';
import PowerIcon from '@assets/power-icon.svg?react';

interface HiddenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const HiddenMenu = ({ isOpen, onClose, buttonRef }: HiddenMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useUserStore();

  useClickOutside({
    modalRef: menuRef,
    buttonRef,
    isOpen,
    onClose,
  });

  const handleLogout = async () => {
    await logoutAPI();
    onClose();
    navigate('/login');
  };

  const handleRoomClick = () => {
    onClose();
    navigate(`/room/${user?.userId}`);
  };

  const handleProfileClick = () => {
    onClose();
    if (user) {
      navigate(`/profile/${user.userId}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className='absolute w-[184px] right-[170%] top-0 p-2 border-2 border-white bg-white/30 backdrop-blur-lg rounded-2xl font-semibold'
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 20 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}>
          <ul className='overflow-hidden px-5 py-4 text-lg bg-white rounded-xl shadow-lg'>
            <li>
              <button
                onClick={handleRoomClick}
                className='w-full px-4 py-3 text-center border-b border-gray-100 text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors'>
                나의 룸
              </button>
            </li>
            <li>
              <button
                onClick={handleProfileClick}
                className='w-full px-4 py-3 text-center border-b border-gray-100  text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors'>
                내 프로필
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                type='button'
                className='w-full py-3 flex items-center justify-center gap-1 text-[#2E4D99]/50 hover:text-[#2E4D99] group transition-colors select-none'>
                <PowerIcon className='w-5 h-5' />
                로그아웃
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default HiddenMenu;
