import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAPI } from '@apis/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../../store/useUserStore';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface HiddenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  isMobile?: boolean;
  housemateButtonRef?: React.RefObject<HTMLButtonElement>;
  toggleHousemateModal?: () => void;
  housemateIcon?: string;
}

const HiddenMenu = ({
  isOpen,
  onClose,
  buttonRef,
  isMobile,
  housemateButtonRef,
  toggleHousemateModal,
  housemateIcon,
}: HiddenMenuProps) => {
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
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          aria-label='숨김 메뉴'
          className='absolute w-[184px] right-[170%] max-sm:right-[120%] top-0 p-2 border-2 border-white bg-white/30 backdrop-blur-lg rounded-2xl font-semibold'
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 20 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}>
          <ul className='overflow-hidden px-5 py-4 text-lg bg-white rounded-xl shadow-lg max-sm:px-4 max-sm:py-2 max-sm:rounded-xl max-sm:font-sm'>
            <li>
              <Link
                to={`/room/${user?.userId}`}
                onClick={onClose}
                className='inline-block w-full px-4 py-3 text-center border-b border-gray-100 text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors'>
                나의 룸
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  onClose();
                  if (user) {
                    navigate(`/profile/${user.userId}`);
                  }
                }}
                className='w-full px-4 py-3 text-center border-b border-gray-100  text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors'>
                내 프로필
              </button>
            </li>
            {isMobile &&
              housemateButtonRef &&
              toggleHousemateModal &&
              housemateIcon && (
                <li>
                  <button
                    ref={housemateButtonRef}
                    type='button'
                    aria-label='하우스메이트'
                    onClick={() => {
                      onClose();
                      toggleHousemateModal();
                    }}
                    className='w-full px-4 py-3 text-center border-b border-gray-100 text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors flex items-center justify-center gap-2'>
                    하우스메이트
                  </button>
                </li>
              )}
            <li>
              <button
                onClick={handleLogout}
                type='button'
                className='w-full py-3 flex items-center justify-center gap-1 text-[#2E4D99]/50 hover:text-[#2E4D99] group transition-colors select-none'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='group-hover:fill-[#2E4D99]'>
                  <path
                    d='M11 9.874C11 10.4263 11.4477 10.874 12 10.874C12.5523 10.874 13 10.4263 13 9.874H11ZM13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4H13ZM9.41442 6.88909C9.91705 6.66021 10.139 6.06721 9.91009 5.56458C9.68121 5.06195 9.08821 4.84004 8.58558 5.06891L9.41442 6.88909ZM5 12.16L4.00001 12.1548C3.99998 12.1604 4 12.166 4.00007 12.1716L5 12.16ZM12 19L12.0115 18.0001C12.0038 18 11.9962 18 11.9885 18.0001L12 19ZM19 12.16L19.9999 12.1716C20 12.166 20 12.1604 20 12.1548L19 12.16ZM15.4144 5.06891C14.9118 4.84004 14.3188 5.06195 14.0899 5.56458C13.861 6.06721 14.083 6.66021 14.5856 6.88909L15.4144 5.06891ZM13 9.874V4H11V9.874H13ZM8.58558 5.06891C5.80609 6.33459 4.01602 9.1007 4.00001 12.1548L5.99999 12.1652C6.0119 9.89118 7.3448 7.83152 9.41442 6.88909L8.58558 5.06891ZM4.00007 12.1716C4.05097 16.5455 7.6376 20.0502 12.0115 19.9999L11.9885 18.0001C8.71901 18.0376 6.03798 15.4179 5.99993 12.1484L4.00007 12.1716ZM11.9885 19.9999C16.3624 20.0502 19.949 16.5455 19.9999 12.1716L18.0001 12.1484C17.962 15.4179 15.281 18.0376 12.0115 18.0001L11.9885 19.9999ZM20 12.1548C19.984 9.1007 18.1939 6.33459 15.4144 5.06891L14.5856 6.88909C16.6552 7.83152 17.9881 9.89118 18 12.1652L20 12.1548Z'
                    fill='currentColor'
                    fillOpacity='1'
                    className='group-hover:fill-opacity-100'
                  />
                </svg>
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
