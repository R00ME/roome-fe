import { useToastStore } from '@/store/useToastStore';
import { TOAST_STYLES } from '@/constants/toast';

export const Toast = () => {
  const { message, type } = useToastStore();

  if (!message || !type) return null;

  const style = TOAST_STYLES[type];

  return (
    <div
      className={`
      fixed top-8 left-1/2 -translate-x-1/2 z-[500]
      py-4 px-8 rounded-lg
      flex items-center gap-4 justify-center
      border-2 ${style?.bg} ${style?.border}
      animate-fade-in-down
      shadow-md
      w-auto max-w-sm sm:max-w-md md:max-w-lg
      sm:w-auto max-sm:w-[calc(100vw-3rem)]
    `}>
      <img
        src={style?.icon}
        alt={`${type} 알림 아이콘`}
        className={`w-5 h-5 flex-shrink-0 ${style?.iconColor}`}
      />
      <span
        className={`${style?.textColor} font-semibold break-keep text-center text-sm sm:text-base`}>
        {message}
      </span>
    </div>
  );
};
