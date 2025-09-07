import backgroundIMG from '@/assets/roome-background-img.png';
import Loading from '@components/Loading';
import CdRack from './components/CdRack';
import { useParams } from 'react-router-dom';
import useFetchCdLists from '../../hooks/cdrack/useFetchCdLists';

export default function CdRackPage() {
  const { userId } = useParams()
  const targetUserId = Number(userId) || 1
  const { items, initialLoading, isFetchingMore, hasMore, loadMore } = useFetchCdLists(targetUserId, 14, {useMock:true})

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div
      className='w-full h-screen'>
      <div className=' w-full h-screen bg-[#516392cc] backdrop-blur-[35px] '>
        {/* <CdStatus
          cdRackInfo={cdRackInfo}
          setCdRackInfo={setCdRackInfo}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        /> */}
        <CdRack items={items} />
      </div>
    </div>
  );
}
