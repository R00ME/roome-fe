import EmptyTemplate from './EmptyTemplate';
import { deleteTemplate } from '@apis/cd';
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useToastStore } from '@/store/useToastStore';

export default function NotEditTemplate({
  templateData,
  questions,
  onToggleEdit,
  changeTemplateData,
}: TemplateProps) {
  const myCdId = Number(useParams().cdId) || 0;
  const userId = Number(useParams().userId) || 0;
  // 방주인이 아니면 템플릿 작성 버튼은 있을 수 없음
  const user = useUserStore((state) => state.user);

  const myUserId = user.userId;

  const showToast = useToastStore((state) => state.showToast);

  const handleDeleteTemplate = async () => {
    try {
      changeTemplateData(null);
      const result = await deleteTemplate(myCdId);
      if (result.status === 204)
        showToast('음악 감상평이 삭제되었어요!', 'success');
    } catch (error) {
      showToast('음악 감상평 삭제에 실패했어요.', 'error');
      changeTemplateData(templateData);
    }
  };

  const answeredQuestions = questions.filter(
    (q) => q.answer && q.answer.trim().length > 0,
  );

  if (!templateData || answeredQuestions.length === 0)
    return (
      <EmptyTemplate
        questions={questions}
        onToggleEdit={onToggleEdit}
      />
    );
  
  return (
    <section className="relative min-h-100 max-h-[70vh] h-full w-full flex flex-col gap-8 px-2 py-3">
      {userId === myUserId && (
        <div className="absolute -top-10 right-1 flex gap-3">
          <button
            onClick={onToggleEdit}
            className="rounded-md text-xs font-semibold
            px-3 py-1.5
            bg-white/20 backdrop-blur-lg
            border border-white/40 text-white shadow-inner
            hover:bg-white/30 hover:text-[#162C63]
            transition-all duration-300"
          >
            수정
          </button>

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={handleDeleteTemplate}
            className="rounded-md text-xs font-semibold
            px-3 py-1.5
            bg-gradient-to-r from-red-400/70 to-pink-500/70
            backdrop-blur-xl border border-white/30
            text-white shadow-md
            hover:from-red-400 hover:to-pink-500
            hover:scale-105 transition-all duration-300"
          >
            삭제
          </button>
        </div>
      )}

      <section 
        className="flex flex-col gap-4 overflow-y-auto scrollbar-none pr-2 "
        >
        {questions
          .filter((q) => q.answer && q.answer.trim().length > 0)
          .map((q, index) => (
          <article
            key={index}
            className="w-full min-w-60 max-w-75
            flex flex-col gap-3 px-6 py-3 rounded-xl
            bg-[#302c51]/40 backdrop-blur-xl
            border border-white/20 shadow-lg
            "
          >
            <h3 className="text-sm md:text-base font-bold text-white "
            >
              {q.question}
            </h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed whitespace-pre-line">
              {q.answer}
            </p>
          </article>
        ))}
      </section>
    </section>
  );
}
