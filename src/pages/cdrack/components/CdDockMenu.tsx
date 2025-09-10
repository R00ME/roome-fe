import { useEffect, useRef, useState } from 'react';
import CdAddIcon from '../../../components/icons/CdAddIcon';
import CdListIcon from '../../../components/icons/CdListIcon';
import DockMenuIcon from '../../../components/icons/DockMenuIcon';

export default function CdDockMenu({
  activeSettings,
  onSettingsChange,
  resetState,
}: CdDockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (resetState) {
      setIsOpen(false);
    }
  }, [resetState]);

  return (
    <div
      ref={menuRef}
      className={`z-[5] bottom-menu bottom-20 right-21 max-sm:bottom-16 max-sm:right-16 relative ${
        isOpen ? 'h-[202px]' : 'h-16'
      }`}>
      <div className='relative flex flex-col-reverse items-center w-full h-full gap-5'>
        {/* 메인 버튼 */}
        <button
          className='bottom-menu-icon bg-white group absolute'
          onClick={() => setIsOpen((prev) => !prev)}>
          <DockMenuIcon
            className={`w-6 h-6 transition-colors ${
              activeSettings === null
                ? 'text-[#162C63]'
                : 'text-white group-hover:text-[#516392]'
            }`}
          />
          <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[6px] opacity-0 group-hover:opacity-100 transition-opacity'>
            플레이리스트 편집하기
          </span>
        </button>

        {/* 하위 버튼 */}
        {isOpen && (
          <div className='bottom-menu-content'>
            {/* 새 음악 추가하기 */}
            <button
              onClick={() => onSettingsChange('add')}
              className={`bottom-menu-icon group absolute bottom-[68px] ${
                activeSettings === 'add'
                  ? 'bg-white'
                  : 'bg-transparent hover:bg-white/50'
              }`}>
              <CdAddIcon
                className={`w-8 h-8 transition-colors ${
                  activeSettings === 'add'
                    ? 'text-[#162C63]'
                    : 'text-white group-hover:text-[#516392]'
                }`}
              />
              <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[6px] opacity-0 group-hover:opacity-100 transition-opacity'>
                새 음악 추가하기
              </span>
            </button>

            {/* 음악 삭제하기 */}
            <button
              onClick={() => onSettingsChange('delete')}
              className={`bottom-menu-icon group absolute bottom-[138px] ${
                activeSettings === 'delete'
                  ? 'bg-white'
                  : 'bg-transparent hover:bg-white/50'
              }`}>
              <CdListIcon
                className={`w-8 h-8 transition-colors ${
                  activeSettings === 'delete'
                    ? 'text-[#162C63]'
                    : 'text-white group-hover:text-[#516392]'
                }`}
              />
              <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[6px] opacity-0 group-hover:opacity-100 transition-opacity'>
                음악 삭제하기
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
