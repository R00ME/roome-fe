import Loading from '@components/Loading';
import { useFetchCdInfo } from '@hooks/cd/useFetchCdInfo';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CdControlBar from './components/CdControlBar';
import CdInfo from './components/CdInfo';
import CdComment from './components/comments/CdComment';
import CdPlayer from './components/player/CdPlayer';
import CdTemplate from './components/template/CdTemplate';
import backgroundIMG from '/images/roome-background-img.webp';
import { useFetchSearchCdLists } from '../../hooks/cd/useFetchSearchCdLists';
import ModalBackground from '../../components/ModalBackground';
import DataList from '../../components/datalist/DataList';

const MemoCdComment = React.memo(CdComment);

export default function CdPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [openModals, setOpenModals] = useState<string[]>([]);
  const { cdInfo, isCdPlaying, isLoading: cdLoading, userId, setIsCdPlaying } =
  useFetchCdInfo();
  const { cdRackInfo, isLoading: rackLoading, lastMyCdId, setCursor, setSearchInput } =
    useFetchSearchCdLists(userId);

  // 뒤로가기시 cd 렉페이지로 이동
  useEffect(() => {
    if (!userId) return;
    const handleBackButton = () => {
      navigate(`/cdrack/${userId}`, { replace: true });
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, userId]);
  
  const onSetCdPlaying = useMemo(() => setIsCdPlaying, [setIsCdPlaying]);
  
  const handleFetchMoreDatas = useCallback(() => {
    setCursor(cdRackInfo.nextCursor);
  }, [cdRackInfo, setCursor]);

  if (cdLoading || rackLoading) return <Loading />;
  
  const hasData = Boolean(cdInfo);

  const handleTabClick = (key: string) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setOpenModals([key]);
    } else {
      setOpenModals((prev) =>
        prev.includes(key) ? prev : [...prev, key]
      );
    }
  };


  const handleCloseModal = () => {
    setOpenModals([]);
  };


  return (
    <div
      className={`relative flex flex-col items-center w-full h-[100vh] bg-center bg-no-repeat bg-cover py-20 `}
      style={{ backgroundImage: `url(${backgroundIMG})` }}>
      <div className='flex justify-center w-full'>
        {/* Control Bar  */}
        <div className='w-[75%] max-w-md h-10'>
          <CdControlBar
            onTabClick={handleTabClick}
            activeModal={openModals[0]}
          />
        </div>
      </div>

      {/* CD Info  */}
      <div className='flex-1 flex items-center justify-center w-full h-full mb-10'>
        {hasData ? (
          <CdInfo
            cdInfo={cdInfo!}
            cdPlaying={isCdPlaying}
          />
        ) : (
          <div className='rounded-xl bg-black/30 p-6 text-center text-white'>
            CD 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        )}
      </div>

      {/* PC: 좌/우 배치 */}
      <div className='hidden md:flex fixed inset-0 pointer-events-none'>
        {openModals.includes('review') && (
          <div
            className='absolute left-4 top-1/2 -translate-y-1/2 
            w-[400px] h-[80%] pointer-events-auto'>
            <CdTemplate
              onClose={() =>
                setOpenModals((prev) => prev.filter((m) => m !== 'review'))
              }
            />
          </div>
        )}
        {openModals.includes('timeline') && (
          <div
            className='absolute right-4 top-1/2 -translate-y-1/2 
            w-[400px] h-[80%] pointer-events-auto'>
            <MemoCdComment
              currentTime={currentTime}
              onClose={() =>
                setOpenModals((prev) => prev.filter((m) => m !== 'timeline'))
              }
            />
          </div>
        )}
        {openModals.includes('playlist') && (
          <ModalBackground onClose={handleCloseModal}>
            <DataList
              setSearchInput={setSearchInput}
              totalCount={cdRackInfo.totalCount}
              datas={cdRackInfo.data}
              type='cd'
              hasMore={cdRackInfo.nextCursor <= lastMyCdId.current}
              isLoading={rackLoading}
              fetchMore={handleFetchMoreDatas}
              userId={userId}
              onClose={handleCloseModal}
            />
          </ModalBackground>
        )}
      </div>

      {/* 재생바 */}
      <section
        className='w-[40%]
        '>
        <CdPlayer
          cdInfo={cdInfo}
          setCdPlaying={onSetCdPlaying}
          setCurrentTime={setCurrentTime}
        />
      </section>
    </div>
  );
}
