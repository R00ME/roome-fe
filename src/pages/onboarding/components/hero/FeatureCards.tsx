import React from 'react';

interface FeatureCardsProps {
  title: string;
  description: string;
}

const FeatureCards = ({ title, description }: FeatureCardsProps) => {
  return (
    <div className='flex flex-col items-center gap-6 px-8 py-14 bg-gradient-to-r text-white from-white/20 to-white/5 backdrop-blur-xl border border-white rounded-4xl'>
      <h3 className='text-3xl font-medium relative '>{title}</h3>
      <p className='text-lg text-center'>{description}</p>
    </div>
  );
};

export default FeatureCards;
