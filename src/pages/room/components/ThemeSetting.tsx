import { themeData } from '@constants/roomTheme';
import { useEffect, useRef, useState } from 'react';
import { roomAPI } from '../../../apis/room';
import ConfirmModal from '../../../components/ConfirmModal';
import { useClickOutside } from '../../../hooks/useClickOutside';
import {
  FEATURE_NAMES,
  useFeatureUsageTracking,
} from '../../../hooks/useFeatureUsageTracking';
import { useToastStore } from '../../../store/useToastStore';
import { useUserStore } from '../../../store/useUserStore';
import ThemeSettingCard from './ThemeSettingCard';

export default function ThemeSetting({
  selectedTheme,
  onThemeSelect,
  onClose,
}: ThemeSettingProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useUserStore();
  const { showToast } = useToastStore();
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<
    'BASIC' | 'FOREST' | 'MARINE' | null
  >(null);

  const { startFeatureTracking, trackFeatureCompletion } =
    useFeatureUsageTracking();

  useClickOutside({
    modalRef,
    buttonRef,
    isOpen: true,
    onClose: () => {
      trackFeatureCompletion(FEATURE_NAMES.THEME, user?.userId?.toString());
      onClose();
    },
    excludeSelectors: ['.bottom-menu', '.modal-shadow'],
  });

  useEffect(() => {
    startFeatureTracking(FEATURE_NAMES.THEME, user?.userId?.toString());
  }, [startFeatureTracking, user?.userId]);

  useEffect(() => {
    const fetchUnlockedThemes = async () => {
      if (!user?.userId) return;

      try {
        const themes: string[] = await roomAPI.getUnlockThemes(user.userId);
        setUnlockedThemes(themes);
      } catch (error) {
        console.error('잠금 해제 테마 조회 실패:', error);
      }
    };

    fetchUnlockedThemes();
  }, [user?.userId]);

  const handlePurchaseAndUpdateTheme = async () => {
    if (!pendingTheme || !user?.userId) {
      return;
    }

    try {
      await roomAPI.purchaseThemes(user.roomId, pendingTheme);
      const updatedThemes = await roomAPI.getUnlockThemes(user.userId);
      setUnlockedThemes(updatedThemes);

      await roomAPI.updateRoomTheme(user.roomId, user.userId, pendingTheme);
      trackFeatureCompletion(FEATURE_NAMES.THEME, user?.userId?.toString());
      onThemeSelect(pendingTheme);
      showToast(
        `${themeData[pendingTheme].title} 테마가 적용되었어요!`,
        'success',
      );
    } catch (error) {
      console.error('테마 적용 실패:', error);
      showToast(
        '테마 적용에 실패했어요. 포인트가 부족할 수도 있어요!',
        'error',
      );
    } finally {
      setShowConfirmModal(false);
      setPendingTheme(null);
    }
  };

  const handleLockedClick = (theme: 'BASIC' | 'FOREST' | 'MARINE') => {
    setPendingTheme(theme);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    handlePurchaseAndUpdateTheme();
  };

  const handleClose = () => {
    setShowConfirmModal(false);
    setPendingTheme(null);
  };

  return (
    <div className='flex flex-col items-center justify-end w-full min-h-screen'>
      <div
        ref={modalRef}
        className='setting-gradient w-full 
    h-auto md:h-[330px] 2xl:h-[418px] 
    pt-6 md:pt-10 2xl:pt-0
    flex justify-center items-start md:items-center overflow-y-auto md:overflow-visible'>
        <div className='flex flex-col md:flex-row mb-10 md:mb-25 gap-2 md:gap-10 bottom-[calc(env(safe-area-inset-bottom)+80px)]'>
          {Object.keys(themeData).map((theme) => {
            const isLocked = !unlockedThemes.includes(theme);
            return (
              <ThemeSettingCard
                key={theme}
                theme={theme as 'BASIC' | 'FOREST' | 'MARINE'}
                isSelected={selectedTheme === theme}
                isLocked={isLocked}
                onClick={() => {
                  if (isLocked) {
                    handleLockedClick(theme as 'BASIC' | 'FOREST' | 'MARINE');
                  } else {
                    trackFeatureCompletion(
                      FEATURE_NAMES.THEME,
                      user?.userId?.toString(),
                    );
                    onThemeSelect(theme as 'BASIC' | 'FOREST' | 'MARINE');
                  }
                }}
              />
            );
          })}
        </div>
      </div>
      {showConfirmModal && pendingTheme && (
        <ConfirmModal
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={`${themeData[pendingTheme].title} 테마를 `}
          subTitle='400P로 해제하시겠어요?'
        />
      )}
    </div>
  );
}
