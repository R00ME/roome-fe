import React from 'react';
import { twMerge } from 'tailwind-merge';

interface FeatureCardsProps {
  title: string;
  description: string;
  className?: string;
}

const FeatureCards = ({ title, description, className }: FeatureCardsProps) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center gap-6 px-8 py-14 bg-gradient-to-r text-white from-white/20 to-white/5 backdrop-blur-xl border border-white rounded-4xl',
        className,
      )}>
      <h3 className='text-3xl font-medium relative '>{title}</h3>
      <p className='text-lg text-center'>{description}</p>
    </div>
  );
};

export default FeatureCards;
