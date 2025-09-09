import backgroundIMG from '@/assets/roome-background-img.png';
import Loading from '@components/Loading';
import { useFetchCdInfo } from '@hooks/cd/useFetchCdInfo';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CdInfo from './components/CdInfo';
import CdComment from './components/comments/CdComment';
import CdPlayer from './components/player/CdPlayer';
import CdTemplate from './components/template/CdTemplate';

const MemoCdComment = React.memo(CdComment);

export default function CdPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const { cdInfo, isCdPlaying, isLoading, userId, setIsCdPlaying } =
    useFetchCdInfo();

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

  if (isLoading) return <Loading />;

  const hasData = Boolean(cdInfo);

  return (
    <div
      className={`flex flex-col justify-between w-full min-h-[100vh] bg-center bg-no-repeat bg-cover`}
      style={{ backgroundImage: `url(${backgroundIMG})` }}>
      {/* 템플릿, CD이미지, 댓글 */}
      <div className='flex justify-center items-end gap-22 h-[87vh] px-22  pt-17 pb-19  '>
        <CdTemplate />
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
        <MemoCdComment currentTime={currentTime} />
      </div>

      {/* 플레이어 */}
      <section className='sticky bottom-0 left-0 right-0'>
        <CdPlayer
          cdInfo={cdInfo}
          setCdPlaying={onSetCdPlaying}
          setCurrentTime={setCurrentTime}
        />
        <div className='h-[enc(safe-area-inset-bottom)]'/>
      </section>
    </div>
  );
}
