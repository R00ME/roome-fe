import { twMerge } from 'tailwind-merge';

interface FeatureIndexProps {
  features: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const FeatureIndex = ({
  features,
  currentIndex,
  onIndexChange,
}: FeatureIndexProps) => {
  return (
    <div className='absolute right-0 translate-x-[28%] sm:translate-x-1/3 max-[1024px]:translate-x-[30%] lg:translate-x-1/15 top-8 flex flex-col gap-2 pointer-events-auto'>
      {features.map((feature, index) => (
        <button
          key={feature}
          onClick={() => onIndexChange(index)}
          className={twMerge(
            'px-6 py-4 rounded-lg text-sm transition-all whitespace-nowrap pointer-events-auto',
            currentIndex === index
              ? 'bg-[#BDD4FF] text-white font-bold'
              : 'bg-white/80 backdrop-blur-sm text-gray-700',
          )}>
          {feature}
        </button>
      ))}
    </div>
  );
};

export default FeatureIndex;
