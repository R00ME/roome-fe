import muteIcon from '@assets/cd/mute-icon.svg';
import soundIcon from '@assets/cd/sound-icon.svg';
import React from 'react';
import { YouTubeEvent } from 'react-youtube';

interface LeftProps {
  volume: number;
  cdInfo: CDInfo;
  cdReady: CdReady;
  cdStateChangeEvent: YouTubeEvent;
  handleChangeCdVolume: (event: YouTubeEvent, value: string) => void;
  handleMuteCdVolume: (event: YouTubeEvent) => void;
}

const LeftGroup = React.memo(
  ({
    volume,
    cdReady,
    cdStateChangeEvent,
    handleChangeCdVolume,
    handleMuteCdVolume,
  }: LeftProps) => {
    return (
      <article className='flex flex-1 items-center h-full'>
        {/* 음량 */}
        <div className='flex gap-2 justify-center items-center'>
          {cdReady.isMuted ? (
            <button
              className='w-6 aspect-auto'
              onClick={() =>
                handleChangeCdVolume(cdStateChangeEvent, `${volume}`)
              }>
              <img
                className='w-6 aspect-auto cursor-pointer'
                src={muteIcon}
                alt='음량 아이콘'
              />
            </button>
          ) : (
            <button
              className='w-4 aspect-auto'
              onClick={() => handleMuteCdVolume(cdStateChangeEvent)}>
              <img
                className='w-4 aspect-auto cursor-pointer'
                src={soundIcon}
                alt='음량 아이콘'
              />
            </button>
          )}

          <input
            type='range'
            min='0'
            max='100'
            value={cdReady.volume}
            onChange={(e) =>
              handleChangeCdVolume(cdStateChangeEvent, e.target.value)
            }
            className=' volume-range'
          />
        </div>
      </article>
    );
  },
);

export default LeftGroup;
