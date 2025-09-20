import { useToastStore } from '@/store/useToastStore';
import { addCdTemplate, updateTemplate } from '@apis/cd';
import { RefCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

export default function EditTemplate({
  templateData,
  questions,
  changeTemplateData,
  onToggleEdit,
}: TemplateProps) {
  const myCdId = Number(useParams().cdId) || 0;

  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const showToast = useToastStore((state) => state.showToast);

  const setTextAreaRef =
    (index: number): RefCallback<HTMLTextAreaElement> =>
    (element) => {
      textAreaRefs.current[index] = element;
    };

  const handleSubmitTemplate = async () => {
    try {
      const contents = {
        comment1: textAreaRefs.current[0]?.value,
        comment2: textAreaRefs.current[1]?.value,
        comment3: textAreaRefs.current[2]?.value,
        comment4: textAreaRefs.current[3]?.value,
      };
      // 낙관적 업데이트
      changeTemplateData(contents);
      await addCdTemplate(myCdId, contents);
      showToast('음악 감상평이 등록되었어요!', 'success');
      onToggleEdit();
    } catch (error) {
      console.error(error);
      showToast('음악 감상평 등록에 실패했어요.', 'error');
      changeTemplateData(templateData);
    }
  };
  const handleUpdateTemplate = async () => {
    try {
      const contents = {
        comment1: textAreaRefs.current[0]?.value,
        comment2: textAreaRefs.current[1]?.value,
        comment3: textAreaRefs.current[2]?.value,
        comment4: textAreaRefs.current[3]?.value,
      };
      changeTemplateData(contents);
      await updateTemplate(myCdId, contents);
      showToast('음악 감상평을 수정했어요!', 'success');
      onToggleEdit();
    } catch (error) {
      console.error(error);
      showToast('음악 감상평 수정에 실패했어요.', 'error');
      changeTemplateData(templateData);
    }
  };

  return (
    <>
      <form className='relative h-full w-full flex flex-col gap-8 px-3 py-2'>
        <div className='absolute -top-10 right-6 flex gap-3'>
          {/* 취소 버튼 */}
          <button
            type='button'
            onClick={onToggleEdit}
            className='
              rounded-lg text-sm font-semibold
              px-5 py-2
              bg-white/20 backdrop-blur-lg
              border border-white/40
              text-white shadow-inner
              hover:bg-white/30 hover:text-[#162C63]
              transition-all duration-300
            '>
            취소
          </button>

          {/* 저장 버튼 */}
          <button
            type='button'
            onClick={templateData ? handleUpdateTemplate : handleSubmitTemplate}
            className='
              rounded-lg text-sm font-semibold
              px-5 py-2
              bg-gradient-to-r from-[#a18cd1]/60 to-[#fbc2eb]/60
              backdrop-blur-xl
              border border-white/40
              text-white shadow-md
              hover:from-[#a18cd1]/80 hover:to-[#fbc2eb]/80
              hover:scale-105
              transition-all duration-300
            '>
            저장
          </button>
        </div>

        <section
          className='
    grid gap-8 overflow-y-auto scrollbar-none pr-2
    grid-cols-1 md:grid-cols-2
  '>
          {questions.map((q, index) => (
            <article
              key={index}
              className='flex flex-col gap-4 p-6 rounded-2xl 
      bg-[#3d3a5f]/10 backdrop-blur-xl border border-white/20 shadow-inner'>
              <h3 className='text-base lg:text-lg font-bold text-white drop-shadow-sm'>
                {q.question}
              </h3>
              <textarea
                ref={setTextAreaRef(index)}
                name={`comment ${index + 1}`}
                maxLength={200}
                defaultValue={`${q.answer || ''}`}
                className='w-full min-h-[120px] md:min-h-[140px] 
                   rounded-xl resize-none
                  px-4 py-3 text-base text-white/80 placeholder-white/40
                  bg-[#43405c]/10 border border-white/30 backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-pink-300
                  shadow-inner'
                  />
            </article>
          ))}
        </section>
      </form>
    </>
  );
}
