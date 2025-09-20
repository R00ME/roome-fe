import sufflesong from '@assets/cd/shuffle-icon.svg';
import React from 'react';

interface RightProps {
  cdReady: CdReady;
  handleToggleLoop: () => void;
  setIsCdListOpen: (value: boolean) => void;
}
const RightGroup = React.memo(
  ({ cdReady, handleToggleLoop }: RightProps) => {

    return (
      <article className='flex items-center gap-4 flex-1 justify-end'>
        <button
          onClick={handleToggleLoop}
          className={cdReady.isLooping ? 'opacity-100' : 'opacity-30'}>
          <img
            className='w-5 md:w-6 aspect-auto'
            src={sufflesong}
            alt='cd 무한재생 버튼'
          />
        </button>

      </article>
    );
  },
);

export default RightGroup;
