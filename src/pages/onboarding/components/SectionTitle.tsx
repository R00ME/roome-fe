import { twMerge } from 'tailwind-merge';

interface SectionTitleProps {
  upperTitle?: string;
  lowerTitle: string;
  description?: string;
  className?: string;
  upperTitleClassName?: string;
  lowerTitleClassName?: string;
  descriptionClassName?: string;
}

const SectionTitle = ({ 
  upperTitle,
  lowerTitle,
  description,
  className,
  upperTitleClassName,
  lowerTitleClassName,
  descriptionClassName
}: SectionTitleProps) => {
  return (
    <div className={twMerge('flex flex-col items-center text-center py-8', className)}>
      <h2 className="flex flex-col gap-2">
        <span
          className={twMerge(
            'text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-300',
            'text-[#0D1F61] opacity-80',
            upperTitleClassName,
          )}>
          {upperTitle}
        </span>
        <span
          className={twMerge(
            'text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-300',
            'text-[#0D1F61] opacity-80',
            lowerTitleClassName,
          )}>
          {lowerTitle}
        </span>
      </h2>
      {description && (
        <p
          className={twMerge(
            'text-base sm:text-lg md:text-xl lg:text-2xl mt-4 transition-all duration-300',
            'text-[#0D1F61] opacity-60',
            descriptionClassName,
          )}>
          {description}
        </p>
      )}
    </div>
  );
};


export default SectionTitle;
