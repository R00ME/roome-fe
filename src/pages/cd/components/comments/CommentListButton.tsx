import commentEdit from '@assets/cd/comment-edit.svg';
import React from 'react';

const CommentListButton = React.memo(
  ({
    setCommentListOpen,
  }: {
    setCommentListOpen: (value: boolean) => void;
  }) => {
    return (
      <button
        type='button'
        onClick={() => setCommentListOpen(true)}>
        <img
          className='hover:opacity-50 w-6 aspect-auto'
          src={commentEdit}
          alt='댓글 목록 버튼'
        />
      </button>
    );
  },
);

export default CommentListButton;
