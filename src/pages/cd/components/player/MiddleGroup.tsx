import pauseSong from '@assets/cd/pause-icon.svg';
import playSong from '@assets/cd/play-icon.svg';
import React from 'react';
import { YouTubeEvent } from 'react-youtube';

interface MiddleProps {
  handleOnOffCd: (value: YouTubeEvent) => void;
  cdStateChangeEvent: YouTubeEvent;
  cdReady: CdReady;
}
const MiddleGroup = React.memo(
  ({ handleOnOffCd, cdStateChangeEvent, cdReady }: MiddleProps) => {
    return (
      <article className='flex flex-col items-center '>
        <button onClick={() => handleOnOffCd(cdStateChangeEvent)}>
          <img
            className='w-5 md:w-7 aspect-auto'
            src={cdReady.isPlaying ? pauseSong : playSong}
            alt='노래 일시정지 버튼'
          />
        </button>
      </article>
    );
  },
);

export default MiddleGroup;
