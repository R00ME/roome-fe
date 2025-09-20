type CdControlBarProps = {
  onTabClick: (key: string) => void;
  openModals: string[];
};

export default function CdControlBar({
  onTabClick,
  openModals,
}: CdControlBarProps) {
  const tabs = [
    { name: '서평 감상', key: 'review' },
    { name: '음악 목록', key: 'playlist' },
    { name: '타임 라인', key: 'timeline' },
  ];

  return (
    <section
      className='relative w-full max-w-md
      bg-white/10 border border-white/20 
      backdrop-blur-2xl 
      rounded-full shadow-md
      flex items-center justify-between
      p-1.5'>
      {tabs.map((tab) => {
        const isActive = openModals.includes(tab.key);
        return (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`
            flex-1 text-center py-1 rounded-full font-semibold text-sm transition-all duration-300
            ${
              isActive
                ? 'bg-white text-[#1b164d] shadow-[0_0_12px_rgba(255,255,255,0.9)] ring-2 ring-white/80'
                : 'text-white/70 hover:text-white'
            }
              `}>
            {tab.name}
          </button>
        );
      })}
    </section>
  );
}
