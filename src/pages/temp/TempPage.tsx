import { useEffect, useState } from 'react';
import Guestbook from '../room/components/Guestbook';
import { useUserStore } from '@/store/useUserStore';

const TempPage = () => {
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!user) {
      setUser({
        email: 'temp@example.com',
        nickname: '임시유저',
        profileImage: '',
        roomId: 1,
        userId: 9999,
      });
    }
  }, [user, setUser]);

  const handleOpenGuestbook = () => {
    setIsGuestbookOpen(true);
  };

  const handleCloseGuestbook = () => {
    setIsGuestbookOpen(false);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>방명록 테스트 페이지</h1>
        <button
          onClick={handleOpenGuestbook}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          방명록 열기
        </button>

        {isGuestbookOpen && (
          <Guestbook
            onClose={handleCloseGuestbook}
            ownerName='테스트 유저'
            ownerId={1}
          />
        )}
      </div>
    </div>
  );
};

export default TempPage;
