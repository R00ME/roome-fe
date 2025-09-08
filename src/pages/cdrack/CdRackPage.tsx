import cd from '@assets/cd/cd.png';
import Loading from '@components/Loading';
import { useParams } from 'react-router-dom';
import TypingText from '../../components/TypingText';
import useFetchCdLists from '../../hooks/cdrack/useFetchCdLists';
import CdHoverLabel from './components/CdHoverLabel';
import CdRack from './components/CdRack';
import { useCdStore } from '../../store/useCdStore';
import { useEffect } from 'react';

export default function CdRackPage() {
  const { userId } = useParams();
  const targetUserId = Number(userId) || 1;
  const { items, initialLoading, isFetchingMore, hasMore, loadMore } =
    useFetchCdLists(targetUserId, 14, { useMock: true });
  const phase = useCdStore((set) => set.phase);

  useEffect(() => {
    if(phase > items.length -3 && hasMore && !isFetchingMore){
      loadMore();
    }
  }, [phase, items, hasMore, isFetchingMore, loadMore])

  if (initialLoading) {
    return <Loading />;
  }

  const isEmpty = !items || items.length === 0;

  return (
    <div className='w-full h-screen'>
      <div className=' w-full h-screen bg-[#516392cc] backdrop-blur-[35px] '>
        {isEmpty ? (
          // 👉 CD 없을 때 UI
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <TypingText
              text='  꽂을 CD가 없네요...'
              className='text-base lg:text-[30px] font-bold text-white/70 mb-6'
            />
            <img
              className='w-48 lg:w-[472px] aspect-square drop-shadow-book hover:animate-slowSpin'
              src={cd}
              alt='빈 CD 이미지'
            />
          </div>
        ) : (
          <>
            <CdRack items={items} />
            <CdHoverLabel />
          </>
        )}
      </div>
    </div>
  );
}
