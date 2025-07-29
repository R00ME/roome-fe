import TypingText from '@components/TypingText';
import FailScreen from './FailScreen';
import SuccessScreen from './SuccessScreen';

export default function ResultScreen({
  showResult,
  eventInfo,
}: {
  showResult: boolean | null;
  eventInfo: EventInfo | null;
}) {
  return (
    <>
      {showResult === null && (
        <div className='absolute top-30 max-sm:top-[8vw] max-sm:px-4 w-full'>
          <TypingText
            speed={150}
            pauseTime={1200}
            text={
              eventInfo?.id ? '이벤트가 열렸어요!' : `아직 이벤트가 없어요!`
            }
            className='h-[250px] text-[35px] font-bold text-white text-center pt-20 max-sm:h-[40vw] max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:flex max-sm:text-[4vw] max-sm:pt-[4vw]'
          />
        </div>
      )}
      {typeof showResult === 'boolean' && showResult === false && (
        <FailScreen />
      )}
      {typeof showResult === 'boolean' && showResult === true && (
        <SuccessScreen eventInfo={eventInfo} />
      )}
    </>
  );
}
