import backgroundImg from '/images/roome-background-img.webp';
import gameMachine from '@assets/event/game-machine.svg';

import LayeredButton from '@components/LayeredButton';
import { useState, useEffect } from 'react';
import { addEventJoin } from '@apis/event';
import { useToastStore } from '@/store/useToastStore';
import Loading from '@components/Loading';
import ResultScreen from './components/ResultScreen';
import { useFetchEvent } from '@hooks/event/useFetchEvent';
import { useEventSecurityTracking } from '@/hooks/useEventSecurityTracking';
import { useNavigate } from 'react-router-dom';

export default function EventPage() {
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();

  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>('idle');
  const { eventInfo, isLoading, isError } = useFetchEvent();

  const isJoinDisabled = !eventInfo?.id || joinStatus !== 'idle' || isLoading;

  useEffect(() => {
    if (isError) {
      showToast('현재 진행중인 이벤트가 없어요 ૮( ᵕ̩̩ - ᵕ̩̩ c)ა', 'error');
      navigate(-1);
    }
  }, [isError, showToast, navigate]);

  // 이벤트 보안 추적 훅
  const {
    trackEventClick,
    trackParticipationAttempt,
    trackParticipationSuccess,
    trackParticipationFailure,
  } = useEventSecurityTracking({
    eventId: eventInfo?.id?.toString(),
    rewardPoints: eventInfo?.rewardPoints,
    maxParticipants: eventInfo?.maxParticipants,
  });

  const handleJoinEvent = async () => {
    if (joinStatus !== 'idle') return;

    // 보안 추적
    trackEventClick();
    trackParticipationAttempt();

    setJoinStatus('joining');
    try {
      await addEventJoin(eventInfo?.id);
      setJoinStatus('success');

      // 성공 추적
      trackParticipationSuccess();

      showToast(`${eventInfo?.rewardPoints} 포인트를 획득했어요!`, 'success');
      setShowResult(true);
    } catch (error) {
      // 실패 추적
      trackParticipationFailure(error);

      showToast(
        error?.response?.data.message || '알 수 없는 오류가 발생했어요.',
        'error',
      );
      setShowResult(false);
      setJoinStatus('fail');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImg})` }}
      className={`bg-cover bg-center bg-no-repeat h-screen item-middle `}>
      <div className='relative'>
        <img
          src={gameMachine}
          alt='오락 기계 이미지'
          className='max-w-[75vw] sm:max-w-none'
        />
        {/* 보여줄 화면 */}
        <ResultScreen
          showResult={showResult}
          eventInfo={eventInfo}
        />
        <div
          className={`absolute bottom-23 right-33 max-sm:bottom-14 max-sm:right-8 max-[420px]:!bottom-8 ${
            isJoinDisabled && 'pointer-events-none'
          }`}
          onClick={handleJoinEvent}>
          <LayeredButton
            theme='red'
            disabled={isJoinDisabled}
            className={`py-8 px-9 rounded-[10px] font-bold max-sm:rounded-[6px] max-sm:py-2 max-sm:px-4 max-sm:text-sm`}>
            {eventInfo?.id
              ? joinStatus === 'idle'
                ? '참여하기'
                : joinStatus === 'joining'
                ? '참여중...'
                : '참여 완료'
              : '준비중...'}
          </LayeredButton>
        </div>
      </div>
    </div>
  );
}
