import { useUserStore } from '@/store/useUserStore';
import { useParams } from 'react-router-dom';
import logoOpacity from '@assets/cd/logo-opacity.png';

export default function EmptyTemplate({ questions, onToggleEdit }) {
  const userId = Number(useParams().userId) || 0;
  // 방주인이 아니면 템플릿 작성 버튼은 있을 수 없음
  const user = useUserStore((state) => state.user);

  const myUserId = user.userId;

  // === 방 주인이 아닐 때 (읽기 전용) ===
  if (userId !== myUserId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
        <img
          className="w-[200px] h-[68px] opacity-80"
          src={logoOpacity}
          alt="투명도 적용된 로고"
        />
        <span className="text-white/80 font-semibold text-base md:text-lg">
          아직 작성되지 않은 템플릿입니다.
        </span>
      </div>
    );
  }

  // === 방 주인일 때 (작성 버튼 노출) ===
  return (
    <div className="relative min-h-100 max-h-[70vh] h-full w-full flex flex-col gap-8 px-2 py-">

      <section className="flex flex-col gap-4 overflow-y-auto scrollbar-none">
        {questions.map((q, index: number) => (
          <article
            key={index}
            onClick={onToggleEdit}
            className="w-full flex flex-col gap-3 p-5 
              rounded-xl bg-[#232353]/30 backdrop-blur-xl
              border border-white/20 shadow-inner
              hover:bg-[#302c51]/20 transition"
          >
            <h3 className="text-sm md:text-base font-bold text-white drop-shadow-sm">
              {q.question}
            </h3>
            <p className="text-xs md:text-sm text-white/70 italic">
              클릭해서 감상평을 남겨보세요.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
