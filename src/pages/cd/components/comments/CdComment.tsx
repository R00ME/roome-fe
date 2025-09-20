import { useCallback, useState } from 'react';
import DraggableModal from '../../../../components/cd/DraggableModal';
import CommentListButton from './CommentListButton';
import CommentListModal from './CommentListModal';
import VisibleCommentList from './VisibleCommentList';

export default function CdComment({
  currentTime,
  onClose,
}: {
  currentTime: number;
  onClose: () => void;
}) {
  const [isCommentListOpen, setIsCommentListOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsCommentListOpen(false);
  }, []);

  return (
    <DraggableModal zIndex={90} onClose={onClose}>
      <div className='relative min-w-70 min-h-100 h-[50vh]  w-full flex flex-col gap-8 justify-between'>
        {/* 댓글 목록 보기 버튼 */}
        <div className='absolute -top:-1 md:-top-8 right-1 flex gap-3'>
          <CommentListButton setCommentListOpen={setIsCommentListOpen} />
        </div>
        <div className=' flex flex-col gap-6 h-full'>
          {/* 댓글 목록 */}
          <VisibleCommentList currentTime={currentTime} />
        </div>
        {isCommentListOpen && <CommentListModal onClose={handleCloseModal} />}
      </div>
    </DraggableModal>
  );
}
