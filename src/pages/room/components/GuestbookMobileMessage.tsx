import exProfile from '@assets/rank/exProfile.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { guestbookAPI } from '../../../apis/guestbook';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToastStore } from '../../../store/useToastStore';
import { useUserStore } from '../../../store/useUserStore';
import { getRelativeTimeString } from '../../../utils/dateFormat';

export default function GuestbookMessage({
  messages = [],
  userId,
  ownerId,
  refetchGuestbook,
  onDelete,
}: GuestbookMessageProps) {
  const { showToast } = useToastStore();
  const [modalState, setModalState] = useState<{ [key: number]: boolean }>({});
  const user = useUserStore((state) => state.user);

  const handleDelete = async (guestbookId: number) => {
    try {
      await guestbookAPI.deleteGuestbook(guestbookId, userId);
      showToast('방명록 삭제 완료! 깔끔하게 정리됐어요', 'success');

      if (refetchGuestbook) {
        refetchGuestbook();
      }

      onDelete();
    } catch (error) {
      // console.log('삭제 중 오류 발생', error);
      showToast('삭제하지 못했어요. 다시 시도해 주세요!', 'error');
    }
  };

  const openModal = (guestbookId: number) => {
    setModalState((prev) => ({ ...prev, [guestbookId]: true }));
  };

  const closeModal = (guestbookId: number) => {
    setModalState((prev) => ({ ...prev, [guestbookId]: false }));
  };

  const handleConfirm = (guestbookId: number) => {
    closeModal(guestbookId);
    handleDelete(guestbookId);
  };

  return (
    <div className='w-full h-fit min-h-48 max-h-fit'>
      {/* 방명록 글 0개일 경우 */}
      {messages.length === 0 ? (
        <div className='flex flex-col justify-center items-center text-gray-500/50 h-32 font-medium'>
          <p className='text-xl text-gray-500/20'>｡°(っ°´o`°ｃ)°｡</p>
          <p className='text-sm mt-3'>텅~ 빈 방명록...</p>
          <p className='text-sm mt-1'>당신의 따뜻한 한마디가 필요해요!</p>
        </div>
      ) : (
        messages.slice(0, 1).map((msg) => (
          <div
            key={msg.guestbookId}
            className={`flex bg-[#F5F1FA]/100 rounded-xl w-full h-full py-4 gap-4 px-4 `}>
            {/* 방명록 컨텐츠 */}
            <div className='flex flex-col flex-1 justify-between w-full'>
              <div className='flex justify-between items-center w-full mb-2'>
                {/* 관계 */}
                <p
                  className={`ml-[-2px] rounded-full text-center px-2.5 py-1 text-[10px] font-semibold text-white inline-block self-start whitespace-nowrap
                    ${
                      msg.userId === user.userId
                        ? 'bg-[#B5B5B5]' // 작성자
                        : msg.userId === ownerId
                        ? 'bg-[#8DB2F8]' // 방 주인
                        : msg.relation === '지나가던_나그네'
                        ? 'bg-[#B5B5B5]' // 나그네
                        : 'bg-[#FF4A9E]' // 하우스 메이트
                    }`}>
                  {`${
                    msg.userId === user.userId
                      ? '작성자'
                      : msg.userId === ownerId
                      ? '방 주인'
                      : msg.relation === '지나가던_나그네'
                      ? '지나가던 나그네'
                      : '하우스 메이트'
                  }`}
                </p>
                {/* 삭제 */}
                {(msg.userId === user.userId || ownerId === user.userId) && (
                  <button
                    onClick={() => openModal(msg.guestbookId)}
                    className='text-[#3E507D] opacity-50 text-xs font-semibold hover:opacity-100'>
                    삭제
                  </button>
                )}
                {modalState[msg.guestbookId] && (
                  <ConfirmModal
                    onClose={() => closeModal(msg.guestbookId)}
                    onConfirm={() => handleConfirm(msg.guestbookId)}
                    title='삭제하시겠습니까? 🗑️'
                    subTitle='사라지면 다시는 돌아오지 않아요...'
                  />
                )}
              </div>

              {/* 방명록 본문 */}
              <p className='text-xs text-[#292929]/70 font-medium mb-2 ml-[2px] leading-tight w-full break-words whitespace-pre-wrap'>
                {msg.message}
              </p>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {/* 방문객 프로필 */}
                  <Link
                    to={`/profile/${msg.userId}`}
                    className='flex items-center gap-1.5'>
                    <img
                      src={msg.profileImage || exProfile}
                      alt={`${msg.nickname}의 프로필`}
                      className='w-6 h-6 rounded-full'
                    />
                    <p className='text-sm font-semibold text-[#292929]'>
                      {msg.nickname}
                    </p>
                  </Link>
                </div>
                {/* 작성 일시 */}
                <p className='text-xs text-[#292929]/30 font-medium'>
                  {getRelativeTimeString(msg.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
