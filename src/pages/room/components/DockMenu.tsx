import { useEffect, useRef, useState } from 'react';
import dockMenuIcon from '@assets/room/dockmenu-icon.svg';
import dockMenuNoselectIcon from '@assets/room/dockmenu-noSelect-icon.svg';
import preferenceNoselectIcon from '@assets/room/preference-noselect-Icon.svg';
import preferenceIcon from '@assets/room/preferenceIcon.svg';
import themeNoselectIcon from '@assets/room/theme-noselect-Icon.svg';
import themeIcon from '@assets/room/themeIcon.svg';

export default function DockMenu({
  activeSettings,
  onSettingsChange,
  resetState,
}: DockMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasSelectedSetting, setHasSelectedSetting] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (resetState) {
      setIsOpen(false);
      setHasSelectedSetting(false);
    }
  }, [resetState]);

  useEffect(() => {
    if (activeSettings === null) {
      setHasSelectedSetting(false);
    } else {
      setHasSelectedSetting(true);
    }
  }, [activeSettings]);

  const getCurrentIcon = () => {
    if (!hasSelectedSetting) return dockMenuIcon;
    if (isOpen) return dockMenuNoselectIcon;
    if (activeSettings === 'preference' && !isOpen) return preferenceIcon;
    if (activeSettings === 'theme' && !isOpen) return themeIcon;
    return dockMenuIcon;
  };

  const handleSettingClick = (setting: 'preference' | 'theme') => {
    if (setting === activeSettings) {
      setIsOpen(false);
      setHasSelectedSetting(false);
      onSettingsChange(null);
    } else {
      setIsOpen(false);
      setHasSelectedSetting(true);
      onSettingsChange(setting);
    }
  };

  const handleMainButtonClick = () => {
    if (isOpen) {
      setIsOpen(false);
      onSettingsChange(null);
      setHasSelectedSetting(false);
    } else {
      setIsOpen(true);
    }
  };

  const getMainButtonBackground = () => {
    if (!hasSelectedSetting) {
      return 'bg-white';
    }
    if (!isOpen && activeSettings) {
      return 'bg-white';
    }
    return 'bg-transparent hover:bg-white/50';
  };

  const showDefaultIcon = () => {
    return !hasSelectedSetting || isOpen || (activeSettings && !isOpen);
  };

  return (
    <div
      ref={menuRef}
      className={`bottom-menu bottom-20 right-21 max-sm:bottom-16 max-sm:right-16 drop-shadow-logo relative ${
        isOpen ? 'h-[202px]' : 'h-16'
      }`}>
      <div className='relative flex flex-col-reverse items-center w-full h-full gap-5'>
        {/* 도구 메뉴 버튼 */}
        <button
          className={`bottom-menu-icon group absolute ${getMainButtonBackground()}`}
          onClick={handleMainButtonClick}
          aria-label='도구 메뉴 열기'>
          <img
            className={`bottom-menu-img absolute transition-opacity ${
              showDefaultIcon()
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
            src={getCurrentIcon()}
          />
          <img
            className={`bottom-menu-img absolute transition-opacity ${
              showDefaultIcon()
                ? 'opacity-0'
                : 'opacity-100 group-hover:opacity-0'
            }`}
            src={dockMenuNoselectIcon}
          />

          {/* tooltip */}
          <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[10px] opacity-0 group-hover:opacity-100 transition-opacity'>
            내방 설정하기
          </span>
        </button>

        {/* 취향 설정 */}
        <div
          className={`bottom-menu-content transition-all duration-100 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
          <button
            onClick={() => handleSettingClick('preference')}
            className={`bottom-menu-icon group absolute bottom-[68px] ${
              activeSettings === 'preference'
                ? 'bg-white'
                : 'bg-transparent hover:bg-white/50'
            }`}>
            <img
              className={`bottom-menu-img absolute transition-opacity ${
                activeSettings === 'preference'
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              src={preferenceIcon}
              alt=''
            />
            <img
              className={`bottom-menu-img absolute transition-opacity ${
                activeSettings === 'preference'
                  ? 'opacity-0'
                  : 'opacity-100 group-hover:opacity-0'
              }`}
              src={preferenceNoselectIcon}
              alt=''
            />

            {/* tooltip */}
            <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[10px] opacity-0 group-hover:opacity-100 transition-opacity'>
              취향 설정하기
            </span>
          </button>

          {/* 테마 설정 */}
          <button
            onClick={() => handleSettingClick('theme')}
            className={`bottom-menu-icon group absolute bottom-[138px] ${
              activeSettings === 'theme'
                ? 'bg-white'
                : 'bg-transparent hover:bg-white/50'
            }`}>
            <img
              className={`bottom-menu-img absolute transition-opacity ${
                activeSettings === 'theme'
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              src={themeIcon}
              alt=''
            />
            <img
              className={`bottom-menu-img absolute transition-opacity ${
                activeSettings === 'theme'
                  ? 'opacity-0'
                  : 'opacity-100 group-hover:opacity-0'
              }`}
              src={themeNoselectIcon}
              alt=''
            />

            {/* tooltip */}
            <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[10px] opacity-0 group-hover:opacity-100 transition-opacity'>
              테마 설정하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
