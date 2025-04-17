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
        <span className={twMerge(
          'text-5xl font-bold',
          'text-[#0D1F61] opacity-80',
          upperTitleClassName
        )}>
          {upperTitle}
        </span>
        <span className={twMerge(
          'text-6xl font-bold',
          'text-[#0D1F61] opacity-80',
          lowerTitleClassName
        )}>
          {lowerTitle}
        </span>
      </h2>
      {description && (
        <p className={twMerge(
          'text-xl mt-4',
          'text-[#0D1F61] opacity-60',
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </div>
  );
};


export default SectionTitle;
