import { useNavigate, useParams } from 'react-router-dom';
import { useToastStore } from '@/store/useToastStore';
import { bookAPI } from '@/apis/book';
import { deleteCdsFromMyRack } from '@/apis/cd';
import { DATA_LIST_THEMES } from '@/constants/dataListTheme';

interface UseDataListDeleteProps {
  type: 'book' | 'cd';
  userId: number;
  onDelete?: (selectedIds: string[]) => void;
}

export const useDataListDelete = ({
  type,
  userId,
  onDelete,
}: UseDataListDeleteProps) => {
  const navigate = useNavigate();
  const myCdId = Number(useParams().cdId);
  const { showToast } = useToastStore();
  const theme = DATA_LIST_THEMES[type === 'book' ? 'book' : 'cd'];

  const handleDelete = async (selectedIds: string[]) => {
    try {
      if (selectedIds.length === 0) {
        showToast('삭제할 항목을 선택해주세요!', 'error');
        return false;
      }

      if (type === 'book') {
        // 도서 삭제 로직
        const myBookIds = selectedIds.join(',');
        await bookAPI.deleteBookFromMyBook(String(userId), myBookIds);
      } else {
        // CD 삭제 로직
        const myCdIds = selectedIds.map((item) => Number(item));
        await deleteCdsFromMyRack(myCdIds);
        if (myCdIds.includes(myCdId)) {
          navigate(`/cdrack/${userId}`);
        }
      }

      // 부모 컴포넌트에 삭제된 아이템들 알림
      onDelete?.(selectedIds);

      // 성공 메시지
      showToast(`선택한 ${theme.itemLabel}이 삭제되었어요!`, 'success');
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : '삭제 중 오류가 발생했어요.';
      console.error('삭제 중 오류가 발생했습니다:', error);
      showToast(errorMessage, 'error');
      return false;
    }
  };

  return {
    handleDelete,
  };
};
