import { useState, useRef, useEffect } from 'react';
import logo from '@/assets/header/header-logo.svg';
import humburgerIcon from '@/assets/header/hamburger-icon.svg';
import notificationIcon from '@/assets/header/notification-icon.svg';
import housemateIcon from '@/assets/header/housemate-list-icon.svg';
import OnNotificationIcon from '@assets/header/notification-on-icon.svg';
import { Link, useLocation } from 'react-router-dom';
import HiddenMenu from './menus/HiddenMenu';
import HousemateModal from './menus/housemate-modal/HousemateModal';
import NotificationModal from './menus/notification-modal/NotificationModal';
import { notificationAPI } from '../../apis/notification';
import { useUserStore } from '@/store/useUserStore';
import { useToastStore } from '@/store/useToastStore';
import { webSocketService } from '@/apis/websocket';
import { useAuthStore } from '../../store/useAuthStore';
import { useWindowSize } from '@/hooks/useWindowSize';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHousemateModalOpen, setIsHousemateModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const location = useLocation();
  const [isConnecting, setIsConnecting] = useState(true);
  const { isMobile } = useWindowSize();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const housemateButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const showToast = useToastStore((state) => state.showToast);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // 1. 이벤트 리스너 설정
    const eventListeners = new Map([
      ['newNotification', handleNewNotification],
      ['websocketConnected', () => setIsConnecting(false)],
      ['websocketDisconnected', () => setIsConnecting(true)],
    ]);

    // 이벤트 리스너 등록
    eventListeners.forEach((handler, event) => {
      window.addEventListener(event, handler as EventListener);
    });

    // 2. 초기 알림 상태 확인
    const checkUnreadNotifications = async () => {
      const user = useUserStore.getState().user;
      if (!user) return;

      try {
        const response = await notificationAPI.getNotifications(
          user.userId,
          undefined,
          20,
          false,
        );
        setHasUnreadNotifications(response.notifications.length > 0);
      } catch (error) {
        console.error('알림 상태 확인 실패:', error);
      }
    };

    // 3. 웹소켓 연결
    const connectWebSocket = async () => {
      if (!accessToken) {
        // console.log('웹소켓 연결 실패: 토큰이 없음');
        setIsConnecting(false);
        return;
      }

      // console.log('웹소켓 연결 시도 시작');
      setIsConnecting(true);

      try {
        await webSocketService.connect();
      } catch (error) {
        // console.log('웹소켓 연결 실패:', error);
        showToast('알림 서비스 연결에 실패했습니다.', 'error');
        setIsConnecting(false);
      }
    };

    checkUnreadNotifications();
    connectWebSocket();

    return () => {
      eventListeners.forEach((handler, event) => {
        window.removeEventListener(event, handler as EventListener);
      });
      webSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNewNotification = () => {
    setHasUnreadNotifications(true);
    setIsNewNotification(true);
    showToast('새로운 알림이 있습니다', 'success');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleHousemateModal = () => {
    setIsHousemateModalOpen(!isHousemateModalOpen);
  };

  const toggleNotificationModal = () => {
    if (isConnecting) {
      showToast('알림 서비스에 연결 중입니다. 잠시만 기다려주세요.', 'info');
      return;
    }
    setIsNotificationModalOpen(!isNotificationModalOpen);
    if (!isNotificationModalOpen) {
      setIsNewNotification(false);
    }
  };

  // 알림 읽음 상태 업데이트 함수
  const updateNotificationStatus = (hasUnread: boolean) => {
    setHasUnreadNotifications(hasUnread);
  };

  // 웹소켓 연결 중일 때 알림 아이콘에 로딩 표시
  const renderNotificationIcon = () => {
    if (isConnecting) {
      return (
        <div className='relative'>
          <img
            src={notificationIcon}
            alt='알림'
            className='w-8 h-8 opacity-50' // 연결 중일 때 흐리게 표시
          />
        </div>
      );
    }

    if (isNewNotification) {
      return (
        <img
          src={OnNotificationIcon}
          alt='새 알림'
          className='w-8 h-8'
        />
      );
    }

    return (
      <img
        src={notificationIcon}
        alt='알림'
        className='w-8 h-8'
      />
    );
  };

  return (
    <>
      <header className='fixed top-0 z-50 items-start pt-10 max-sm:px-6 max-sm:pt-8 w-full pointer-events-none px-21 item-between'>
        {/* 로고 */}
        <button
          aria-label='로고'
          className='pointer-events-auto max-sm:w-24'>
          <Link to='/'>
            <img
              src={logo}
              alt='logo'
            />
          </Link>
        </button>
        {/* 네비게이션 */}
        <nav className='gap-4 pointer-events-auto item-row'>
          <button
            ref={notificationButtonRef}
            type='button'
            aria-label='알림'
            onClick={toggleNotificationModal}
            className='relative cursor-pointer'>
            {renderNotificationIcon()}
            <div className='absolute top-[2.5px] right-[5.7px]'>
              {/* 기본 알림 점 */}
              <div
                className={`w-2 h-2 bg-[#FF4A9E] rounded-full z-50 ${
                  isNewNotification ? 'animate-ping' : ''
                }`}
                style={{
                  display:
                    hasUnreadNotifications || isNewNotification
                      ? 'block'
                      : 'none',
                }}
              />
              {/* 네온 효과 */}
              {/* <div
                className={`absolute top-0 right-0 w-2 h-2 rounded-full z-40
                  ${
                    isNewNotification ? 'animate-notification-glow' : ''} before:content-[''] before:absolute before:-inset-4 before:bg-gradient-radial before:from-orange-500/40 before:via-orange-500/20 before:to-transparent before:rounded-full before:blur-sm`}
                style={{
                  opacity: isNewNotification ? 1 : 0,
                  transition: 'opacity 300ms ease-in-out',
                }}
              /> */}
            </div>
            <div className='hidden'>
              hasUnread: {hasUnreadNotifications.toString()}, isNew:{' '}
              {isNewNotification.toString()}
            </div>
          </button>
          {!isMobile && (
            <button
              ref={housemateButtonRef}
              type='button'
              aria-label='하우스메이트'
              onClick={toggleHousemateModal}
              className='cursor-pointer'>
              <img
                src={housemateIcon}
                alt='하우스메이트'
                className='w-8 h-8'
              />
            </button>
          )}
          <div className='relative pointer-events-auto'>
            <button
              ref={buttonRef}
              type='button'
              aria-label='메뉴'
              aria-haspopup='true'
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className='cursor-pointer item-middle'>
              <img
                src={humburgerIcon}
                alt='메뉴'
                className='w-8 h-8'
              />
            </button>
            <HiddenMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              buttonRef={buttonRef}
              isMobile={isMobile}
              housemateButtonRef={housemateButtonRef}
              toggleHousemateModal={toggleHousemateModal}
              housemateIcon={housemateIcon}
            />
          </div>
        </nav>
      </header>
      <HousemateModal
        isOpen={isHousemateModalOpen}
        onClose={() => setIsHousemateModalOpen(false)}
        buttonRef={housemateButtonRef}
      />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        buttonRef={notificationButtonRef}
        onNotificationStatusChange={updateNotificationStatus}
      />
    </>
  );
};

export default Header;
