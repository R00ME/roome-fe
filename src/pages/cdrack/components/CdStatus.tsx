import { useUserStore } from '@/store/useUserStore';
import cd_add_icon from '@assets/cd/cd-add-icon.svg';
import cd from '@assets/cd/cd.png';
import { SearchModal } from '@components/search-modal/SearchModal';
import TypingText from '@components/TypingText';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SwiperRef } from 'swiper/react';
import CdSwiper from './CdSwiper';
import Dock from './Dock';
import SlidingTitle from './SlidingTitle';

interface CdStatusProps {
  cdRackInfo: CDRackInfo;
  setCdRackInfo: React.Dispatch<React.SetStateAction<CDRackInfo>>;
  onPrevPage: () => void;
  onNextPage: (cursor: number) => void;
}

export default function CdStatus({
  cdRackInfo,
  setCdRackInfo,
  onPrevPage,
  onNextPage,
}: CdStatusProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearchModalOpen, setIsSerarchModalOpen] = useState(false);

  const [newItem, setNewItem] = useState(null);

  const [slideWidth, setSlideWidth] = useState<number>(0);
  const swiperRef = useRef<SwiperRef | null>(null);
  const myUserId = useUserStore().user.userId;
  const userId = Number(useParams().userId);

  const activeTrack = useMemo(
    () =>
      cdRackInfo?.data?.find(
        (track: CDInfo) =>
          track.myCdId === cdRackInfo?.data[activeIndex]?.myCdId,
      ),
    [cdRackInfo, activeIndex],
  );

  useEffect(() => {
    if (cdRackInfo?.data && cdRackInfo?.data[0]?.coverUrl) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = cdRackInfo?.data[0]?.coverUrl;
      document.head.appendChild(preloadLink);
    }
  }, [cdRackInfo]);

  // 낙관적 업데이트 적용 코드
  useEffect(() => {
    if (!newItem) return;
    const newCdDatas = {
      myCdId: newItem.id,
      title: newItem.title,
      artist: newItem.artist,
      album: newItem.album_title,
      genres: newItem.genres,
      coverUrl: newItem.imageUrl,
      youtubeUrl: newItem.youtubeUrl,
      duration: newItem.duration,
      releaseDate: newItem.date,
    };
    const pageLength = Array.isArray(cdRackInfo?.data)
      ? cdRackInfo.data.length
      : 0;

    setCdRackInfo((prev: CDRackInfo) => {
      const prevData = prev ?? {
        data: [],
        firstMyCdId: 0,
        lastMyCdId: 0,
        nextCursor: 0,
        totalCount: 0,
      };
      return pageLength >= 10
        ? {
            ...prevData,
            lastMyCdId: newCdDatas.myCdId,
            totalCount: prevData.totalCount + 1,
          }
        : {
            ...prevData,
            data: [...prevData.data, newCdDatas],
            nextCursor: newCdDatas.myCdId,
            firstMyCdId:
              pageLength === 0 ? newCdDatas.myCdId : prevData?.firstMyCdId,
            lastMyCdId: newCdDatas.myCdId,
            totalCount: prevData.totalCount + 1,
          };
    });
  }, [newItem]);

  return (
    <div className='flex h-full flex-col gap-10 2xl:gap-12 items-center relative w-full'>
      {cdRackInfo?.data?.length > 0 ? (
        <>
          <div className='flex flex-col items-center text-center mt-30 md:mt-20 '>
            <span className='text-white  opacity-70 text-sm xl:text-[16px] 2xl:text-xl'>
              {activeTrack?.artist} | {activeTrack?.releaseDate.split('-')[0]}
            </span>
            <SlidingTitle
              text={activeTrack?.title}
              width={slideWidth}
            />
          </div>
          <CdSwiper
            ref={swiperRef}
            cdRackDatas={cdRackInfo?.data}
            onActiveTrackId={(activeIndex: number) =>
              setActiveIndex(activeIndex)
            }
            setSlideWidth={setSlideWidth}
          />
        </>
      ) : (
        <div className='relative w-full min-h-full'>
          <TypingText
            text='  꽂을 CD가 없네요...'
            className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base lg:text-[30px] font-bold text-white/70 text-center'
          />
          <img
            className='absolute top-2/4 2xl:top-110 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-65 2xl:w-[472px] 2xl:h-[472px] shrink-0 drop-shadow-book aspect-square m-auto hover:animate-slowSpin'
            src={cd}
            alt='cd 실사 이미지'
          />
        </div>
      )}

      <div className='hidden md:block w-full'>

      <Dock
        ref={swiperRef}
        isEmpty={cdRackInfo?.data?.length > 0 ? false : true}
        cdRackInfo={cdRackInfo}
        setCdRackInfo={setCdRackInfo}
        activeIndex={activeIndex}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        />
        </div>

      {myUserId === userId && (
        <div
          onClick={() => setIsSerarchModalOpen((prev) => !prev)}
          className='hover:animate-pulse fixed bottom-10 right-10 md:bottom-21 md:right-21 z-[5] bg-[#FFFFFF33] backdrop-blur-[35px] rounded-full w-16 h-16 cursor-pointer 
       item-middle border-2 border-[#FFFFFFB2]'>
          <img
            className='w-5 h-5'
            src={cd_add_icon}
            alt='cd 추가 아이콘'
          />
        </div>
      )}

      {isSearchModalOpen && (
        <SearchModal
          title='CD 랙에 담을 음악 찾기'
          onClose={() => setIsSerarchModalOpen(false)}
          type='CD'
          onSelect={(cdItem) => setNewItem(cdItem)}
        />
      )}
    </div>
  );
}
